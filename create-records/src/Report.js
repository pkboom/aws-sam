import { XMLValidator, XMLParser } from 'fast-xml-parser'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import zlib from 'zlib'
import { simpleParser } from 'mailparser'
import unzipper from 'unzipper'
import { KinesisClient, PutRecordsCommand } from '@aws-sdk/client-kinesis'
import { wait } from '/opt/nodejs/helper.js'
import Tangerine from 'tangerine'
import Bottleneck from 'bottleneck'

class Report {
  constructor() {
    this.message = null
    this.records = null
    this.json = null
    this.ip = null
    this.reverses = {}
    this.s3Client = new S3Client({})
    this.kinesisClient = new KinesisClient({})
    this.tangerine = new Tangerine({
      timeout: 5000,
      tries: 1,
    })
    this.limiter = new Bottleneck({
      maxConcurrent: 500,
    })
  }

  async getMessage(event) {
    // let key = JSON.parse(event.Records[0].body).eml
    let key = 'google.eml'

    let command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    })

    try {
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

    for (const attachment of parsed.attachments) {
      console.log(attachment.filename)
      console.log(attachment.contentType)

      if (attachment.contentType === 'application/zip') {
        let { files } = await unzipper.Open.buffer(attachment.content)

        content = await files[0].buffer()
      } else if (attachment.contentType === 'application/gzip') {
        content = zlib.unzipSync(attachment.content)
      } else {
        throw new Error(`Unknown content type: ${attachment.contentType}`)
      }
    }

    let xml = content.toString()

    let result = XMLValidator.validate(xml)

    if (result.err) {
      console.log(`Bad xml: ${result.err.msg}`)

      throw Error('Bad xml')
    }

    this.json = new XMLParser().parse(xml)

    this.records = Array.isArray(this.json.feedback.record) ? this.json.feedback.record : [this.json.feedback.record]

    this.message = null

    // console.log(this.json)
    // console.log(`records.length: ${this.records.length}`)
  }

  async getAddresses() {
    let ips = []

    for (let i = 0; i < this.records.length; i++) {
      ips.push(this.records[i].row.source_ip)
    }

    console.log(`ips.length: ${ips.length}`)

    let uniqueIps = ips.filter((value, index, self) => self.indexOf(value) === index)

    console.log(`uniqueIps.length: ${uniqueIps.length}`)

    let reverses = []

    for (let i = 0; i < uniqueIps.length; i++) {
      reverses.push(this.reverseLookup(uniqueIps[i]))
    }

    let addresses = await Promise.allSettled(reverses)

    this.reverses = uniqueIps.reduce((acc, ip, index) => {
      if (addresses[index].status === 'rejected') {
        acc[ip] = ''
      } else {
        acc[ip] = addresses[index].value.join()
      }

      return acc
    }, {})

    // await this.s3Client.send(
    //   new PutObjectCommand({
    //     Bucket: process.env.BUCKET_NAME,
    //     Key: 'reverses_lookup.json',
    //     Body: JSON.stringify(this.reverses),
    //   }),
    // )
  }

  reverseLookup(ip) {
    return this.limiter.schedule(() => this.tangerine.reverse(ip))
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
