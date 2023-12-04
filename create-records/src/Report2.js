import { XMLValidator, XMLParser } from 'fast-xml-parser'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import zlib from 'zlib'
import { simpleParser } from 'mailparser'
import unzipper from 'unzipper'
import { v4 as uuidv4 } from 'uuid'

class Report {
  constructor() {
    this.message = null
    this.records = null
    this.json = null
    this.reverses = []
    this.s3Client = new S3Client({})
  }

  async getMessage(event) {
    let command = new GetObjectCommand({
      Bucket: process.env.MAILBUCKET_NAME,
      // Key: event.Records[0].body,
      Key: 'google.eml',
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
      throw Error(`XML is invalid: ${result.err.msg}`)
    }

    this.json = new XMLParser().parse(xml)

    this.records = Array.isArray(this.json.feedback.record) ? this.json.feedback.record : [this.json.feedback.record]

    this.message = null

    // console.log(this.json)
    // console.log(`records.length: ${this.records.length}`)
  }

  async createRecords() {
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

      payload.push(data)

      if (i + 1 === this.records.length || (i + 1) % 2000 === 0) {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.RECORDBUCKET_NAME,
            Key: `records_${uuidv4()}.json`,
            Body: JSON.stringify(payload),
          }),
        )

        payload = []
      }
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
