import redis from 'redis'
import { XMLValidator, XMLParser } from 'fast-xml-parser'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import zlib from 'zlib'
import { simpleParser } from 'mailparser'
import unzipper from 'unzipper'
import { KinesisClient, PutRecordsCommand } from '@aws-sdk/client-kinesis'
import { errorMessages, REVERSE_LOOKUP, REVERSE_LOOKUP_INDEX } from '/opt/nodejs/helper.js'
import Tangerine from 'tangerine'
import Bottleneck from 'bottleneck'
import { readFileSync } from 'fs'

class Report {
  constructor() {
    this.message = null
    this.records = null
    this.json = null
    this.ip = null
    this.reverses = {}
    this.s3Client = new S3Client({})
    this.kinesisClient = new KinesisClient()
    this.resolver = new Tangerine()
    this.limiter = new Bottleneck({
      maxConcurrent: 500,
    })
    this.redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_HOST_ENDPOINT}`,
    })
  }

  async getMessage(event) {
    // let key = JSON.parse(event.Records[0].body).eml
    let key = 'u86npvbdq335llj1d62p1b5b1jmlmplsgip207g1'

    console.log(`key: ${key}`)

    try {
      let command = new GetObjectCommand({
        Bucket: process.env.MAILBUCKET_NAME,
        Key: key,
      })

      let response = await this.s3Client.send(command)

      let arrayBuffer = await response.Body.toArray()

      this.message = Buffer.concat(arrayBuffer)
    } catch (err) {
      console.error(err)
    }
  }

  async toJson() {
    let parsed = await simpleParser(this.message.toString())

    let content

    console.log(parsed)

    if (parsed.attachments.length === 0) {
      throw new Error(errorMessages.noAttachment)
    }

    for (const attachment of parsed.attachments) {
      console.log(attachment.filename)
      console.log(attachment.contentType)

      if (attachment.contentType === 'application/zip') {
        try {
          let { files } = await unzipper.Open.buffer(attachment.content)

          content = await files[0].buffer()
        } catch (error) {
          throw new Error(errorMessages.badAttachment)
        }
      } else if (attachment.contentType === 'application/gzip') {
        try {
          content = zlib.unzipSync(attachment.content)
        } catch (error) {
          throw new Error(errorMessages.badAttachment)
        }
      } else {
        // We need to get an email with a bad content type to test this.

        console.log(`Bad content type: ${attachment.contentType}`)

        throw new Error(errorMessages.badContentType)
      }
    }

    let xml = content.toString()

    let result = XMLValidator.validate(xml)

    if (result.err) {
      console.log(`Bad xml: ${result.err.msg}`)

      throw new Error(errorMessages.badXml)
    }

    this.json = new XMLParser().parse(xml)

    this.records = Array.isArray(this.json.feedback.record) ? this.json.feedback.record : [this.json.feedback.record]

    this.message = null

    console.log(this.json)
    console.log(`records.length: ${this.records.length}`)
  }

  async getAddresses() {
    await this.redisClient.connect()

    // dev
    // await this.redisClient.del(REVERSE_LOOKUP)
    // await this.redisClient.del(REVERSE_LOOKUP_INDEX)
    // let file = readFileSync('reverses.json', 'utf8')
    // let json = JSON.parse(file)
    // await this.redisClient.hSet(REVERSE_LOOKUP, json)
    // let asdf = await this.redisClient.hGetAll(REVERSE_LOOKUP)
    // console.log({ asdf })
    // dev ends

    let ips = []

    for (let i = 0; i < this.records.length; i++) {
      ips.push(this.records[i].row.source_ip)
    }

    console.log(`ips.length: ${ips.length}`)

    let uniqueIps = ips.filter((value, index, self) => self.indexOf(value) === index)

    console.log(`uniqueIps.length: ${uniqueIps.length}`)

    let newIps = []

    let reverseLookup = await this.redisClient.hmGet(REVERSE_LOOKUP, uniqueIps)

    let existingIps = uniqueIps.reduce((acc, ip, index) => {
      if (reverseLookup[index] === null) {
        newIps.push(ip)
      } else {
        acc[ip] = reverseLookup[index]
      }

      return acc
    }, {})

    console.log({ existingIps })
    console.log({ newIps })

    let reverses = []

    let date = new Date().getTime()

    for (let i = 0; i < newIps.length; i++) {
      reverses.push(this.reverseLookup(newIps[i]))

      await this.redisClient.zAdd(REVERSE_LOOKUP_INDEX, {
        score: date,
        value: newIps[i],
      })
    }

    let addresses = await Promise.allSettled(reverses)

    console.log(addresses)
    console.log(addresses.length)

    this.reverses = newIps.reduce((acc, ip, index) => {
      if (addresses[index].status === 'rejected') {
        acc[ip] = ''
      } else {
        acc[ip] = addresses[index].value.join()
      }

      return acc
    }, {})

    console.log(this.reverses)

    await this.redisClient.hSet(REVERSE_LOOKUP, this.reverses)

    await this.removeOldIps(date)

    throw new Error('test')

    Object.assign(this.reverses, existingIps)

    await this.redisClient.quit()

    console.log(this.reverses)

    throw new Error('test')

    // For dev
    // await this.s3Client.send(
    //   new PutObjectCommand({
    //     Bucket: process.env.MAILBUCKET_NAME,
    //     Key: 'reverses_lookup.json',
    //     Body: JSON.stringify(this.reverses),
    //   }),
    // )
  }

  reverseLookup(ip) {
    return this.limiter.schedule(() => this.resolver.reverse(ip))
  }

  async removeOldIps(date) {
    if (Math.floor(Math.random() * 10000) !== 1) {
      return
    }

    let lastWeek = new Date(date - 7 * 24 * 60 * 60 * 1000).getTime()

    let oldIps = await this.redisClient.zRangeByScore(REVERSE_LOOKUP_INDEX, 0, lastWeek)

    await this.redisClient.hDel(REVERSE_LOOKUP, oldIps)

    await this.redisClient.zRemRangeByScore(REVERSE_LOOKUP_INDEX, 0, lastWeek)
  }

  async sendToKinesis() {
    let payload = []
    let report_metadata = this.json.feedback.report_metadata
    let policy_published = this.json.feedback.policy_published

    for (let i = 0; i < this.records.length; i++) {
      let record = this.records[i]

      let data = {
        id: `${report_metadata.org_name}_${report_metadata.report_id}_${i}`,
        report_metadata,
        policy_published,
        record,
      }

      data.record.auth_results = {
        dkim_auth: this.dkimAuth(record.auth_results.dkim),
        spf_auth: record.auth_results.spf,
      }

      data.record.row = {
        ...data.record.row,
        source_ip_details: this.reverses[record.row.source_ip],
      }

      // PartitionKey: https://stackoverflow.com/a/48400535/22110543
      payload.push({
        Data: Buffer.from(JSON.stringify(data)),
        PartitionKey: `partitionKey-${i}`,
      })

      let current = i + 1

      if (current === this.records.length || current % 500 === 0) {
        await this.sendRecords(payload)

        payload = []

        console.log(current)
      }
    }
  }

  async sendRecords(payload) {
    while (true) {
      try {
        let command = new PutRecordsCommand(this.createInput(payload))

        let response = await this.kinesisClient.send(command)

        if (response.FailedRecordCount === 0) {
          return
        }

        throw new Error(`FailedRecordCount: ${response.FailedRecordCount}`)
      } catch (error) {
        console.log(error)
      }

      await wait(700)
    }
  }

  createInput(payload) {
    return {
      StreamARN: process.env.KINESIS_ARN,
      Records: payload,
    }
  }

  dkimAuth(dkim) {
    // if only spf only exists, dkim_1 is undefined
    return Array.isArray(dkim)
      ? {
          dkim_1: dkim[0],
          dkim_2: dkim[1],
        }
      : {
          dkim_1: dkim,
          dkim_2: undefined,
        }
  }
}

export default Report
