import { XMLValidator, XMLParser } from 'fast-xml-parser'
import dns from 'dns'
import { Reader } from '@maxmind/geoip2-node'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

let __dirname = path.dirname(fileURLToPath(import.meta.url))

const client = new S3Client({})

class Dmarc {
  constructor() {
    this.xml = null
    this.json = null
    this.countryReader = null
    this.asnReader = null
    this.ip = null
    this.reverses = []
  }

  async getXml() {
    let command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      // Key: 'test.txt',
      // Key: 'whisnantstrategies.com!s.freepeople.com!1698710400!1698796799.xml',
      Key: 'google.com!spotify.com!1693958400!1694044799.xml',
    })

    try {
      let response = await client.send(command)

      this.xml = await response.Body.transformToString()

      // console.log(this.xml)
    } catch (err) {
      console.error(err)
    }
  }

  toJson() {
    const result = XMLValidator.validate(this.xml)

    if (result.err) {
      throw Error(`XML is invalid: ${result.err.msg}`)
    }

    this.json = new XMLParser().parse(this.xml)

    // console.log(this.json)

    this.xml = null
  }

  async useIpToGeo() {
    let buffer = readFileSync(path.join(__dirname, 'GeoLite2-Country.mmdb'))

    this.countryReader = Reader.openBuffer(buffer)

    buffer = readFileSync(path.join(__dirname, 'GeoLite2-ASN.mmdb'))

    this.asnReader = Reader.openBuffer(buffer)
  }

  async getReverses() {
    let records = Array.isArray(this.json.feedback.record) ? this.json.feedback.record : [this.json.feedback.record]

    let ips = []

    for (let i = 0; i < records.length; i++) {
      ips.push(records[i].row.source_ip)
    }

    console.log(`records.length: ${records.length}`)

    console.log(`ips.length: ${ips.length}`)

    let uniqueIps = ips.filter((value, index, self) => self.indexOf(value) === index)

    console.log(`uniqueIps.length: ${uniqueIps.length}`)

    let reverses = []

    for (let i = 0; i < uniqueIps.length; i++) {
      reverses.push(this.reverseLookup(uniqueIps[i]))
    }

    this.reverses = await Promise.all(reverses)

    // console.log(this.reverses)
  }

  async reverseLookup(ip) {
    try {
      let reverse = dns.promises.reverse(ip)

      let timeout = new Promise(resolve => {
        setTimeout(resolve, 5000, [null])
      })

      return [ip, await Promise.race([reverse, timeout])]
    } catch (error) {
      return [ip, [null]]
    }
  }

  toDocument() {
    // console.log('toDocument')

    let startTime = new Date()
    let loop20Time = new Date()

    let report_metadata = this.json.feedback.report_metadata
    let policy_published = this.json.feedback.policy_published
    let records = Array.isArray(this.json.feedback.record) ? this.json.feedback.record : [this.json.feedback.record]

    for (let i = 0; i < records.length; i++) {
      let record = records[i]

      this.ip = record.row.source_ip

      console.log(`ip: ${this.ip}`)

      let data = { report_metadata, policy_published, record }

      data.record.auth_results = {
        dkim_auth: this.dkimAuth(record.auth_results.dkim),
        spf_auth: record.auth_results.spf,
      }

      // console.log(data.record.auth_results)

      data.record.row = {
        ...data.record.row,
        source_ip_details: this.sourceIpDetails(),
      }

      // console.log(data.record.row)

      // Here we send data to kinesis
      // console.log(data);

      records[i] = null

      if (i % 20 === 0 || i === records.length - 1) {
        let endTime = new Date()

        let totalTime = endTime - startTime
        let loopTime = endTime - loop20Time

        // console.log(`totalTime: ${totalTime}ms, recordTime: ${loopTime}ms`, process.memoryUsage().heapUsed)

        loop20Time = endTime
      }

      // console.log('================ loop done ===================')
    }
  }

  dkimAuth(dkim) {
    // if only spf only exists, then dkim_1 is undefined
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

  sourceIpDetails() {
    let reverse = this.reverses.find(ip => ip[0] === this.ip)

    return {
      country_iso_code: this.getCountry(),
      organization_name: this.getAns(),
      host: reverse[1][0],
    }
  }

  getCountry() {
    let response

    try {
      response = this.countryReader.country(this.ip)
    } catch (error) {
      //
    }

    // console.log(response)

    return response?.country?.isoCode
  }

  getAns() {
    let response

    try {
      response = this.asnReader.asn(this.ip)
    } catch (error) {
      //
    }

    // console.log(response)

    return response?.autonomousSystemOrganization
  }
}

export default Dmarc
