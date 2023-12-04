import dns from 'dns'
import { KinesisClient, PutRecordsCommand } from '@aws-sdk/client-kinesis'
import { GetObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

class Record {
  constructor() {
    this.key = null
    this.records = null
    this.reverses = []
    this.kinesisClient = new KinesisClient({})
    this.s3Client = new S3Client({})
  }

  async getRecords(event) {
    let body = JSON.parse(event.Records[0].body)

    this.key = body.Records[0].s3.object.key

    let command = new GetObjectCommand({
      Bucket: process.env.RECORDBUCKET_NAME,
      Key: this.key,
    })

    let response = await this.s3Client.send(command)

    let arrayBuffer = await response.Body.toArray()

    let records = Buffer.concat(arrayBuffer).toString()

    this.records = JSON.parse(records)

    // console.log(this.records)
  }

  async getAddresses() {
    let ips = []

    for (let i = 0; i < this.records.length; i++) {
      ips.push(this.records[i].record.row.source_ip)
    }

    console.log(`ips.length: ${ips.length}`)

    let uniqueIps = ips.filter((value, index, self) => self.indexOf(value) === index)

    console.log(`uniqueIps.length: ${uniqueIps.length}`)

    for (let i = 0; i < uniqueIps.length; i++) {
      let ip = uniqueIps[i]

      let temp
      let timeout

      try {
        let reverse = dns.promises.reverse(ip)

        timeout = new Promise(resolve => setTimeout(() => resolve([null]), 3000))

        temp = await Promise.race([reverse, timeout])
      } catch (error) {
        temp = [null]
      }

      this.reverses.push([ip, temp])
    }
  }

  async send() {
    let payload = []

    for (let i = 0; i < this.records.length; i++) {
      let record = this.records[i]

      record.row = {
        ...record.row,
        source_ip_details: this.sourceIpDetails(record.record.row.source_ip),
      }

      // console.log(record)

      // PartitionKey: https://stackoverflow.com/a/48400535/22110543
      payload.push({
        Data: Buffer.from(JSON.stringify(record)),
        PartitionKey: `PartitionKey-${i}`,
      })

      if (i + 1 === this.records.length || (i + 1) % 500 === 0) {
        await this.sendRecords(payload)

        await this.deleteRecords()

        payload = []
      }
    }
  }

  async deleteRecords() {
    let command = new DeleteObjectCommand({
      Bucket: process.env.RECORDBUCKET_NAME,
      Key: this.key,
    })

    try {
      await this.s3Client.send(command)
    } catch (error) {
      //
    }
  }

  sourceIpDetails(ip) {
    let reverse = this.reverses.find(item => item[0] === ip)

    return {
      host: reverse[1].join(),
    }
  }

  async sendRecords(payload) {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/kinesis/command/PutRecordsCommand
    let command = new PutRecordsCommand(this.createInput(payload))

    let response = await this.kinesisClient.send(command)

    if (response.FailedRecordCount === 0) {
      return
    }

    console.log(`We have failed records${response.FailedRecordCount}. Let's try again`)

    throw new Error('Failed records')
  }

  createInput(payload) {
    return {
      StreamARN: process.env.KINESIS_ARN,
      Records: payload,
    }
  }
}

export default Record
