import { XMLValidator, XMLParser } from 'fast-xml-parser'
import dns from 'dns'
import { Reader } from '@maxmind/geoip2-node'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

let __dirname = path.dirname(fileURLToPath(import.meta.url))

const client = new S3Client({})

class Reverse {
  constructor() {
    this.xml = null
    this.json = null
    this.countryReader = null
    this.asnReader = null
    this.ip = null
    this.reverses = []
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
}

export default Reverse
