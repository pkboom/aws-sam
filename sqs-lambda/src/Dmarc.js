import { XMLValidator, XMLParser } from 'fast-xml-parser'
import dns from 'dns'
import { Reader } from '@maxmind/geoip2-node'

class Dmarc {
  constructor(xml) {
    this.xml = xml
    this.json = null
    this.countryReader = null
    this.asnReader = null
    this.ip = null
    this.cache = {}
  }

  toJson() {
    const result = XMLValidator.validate(this.xml)

    if (result.err) {
      throw Error(`XML is invalid: ${result.err.msg}`)
    }

    this.json = new XMLParser().parse(this.xml)

    return this
  }

  async useIpToGeo(countryBuffer, asnBuffer) {
    this.countryReader = Reader.openBuffer(countryBuffer)

    this.asnReader = Reader.openBuffer(asnBuffer)
  }

  async toDocument() {
    let startTime = new Date()
    let loop20Time = new Date()

    let report_metadata = this.json.feedback.report_metadata
    let policy_published = this.json.feedback.policy_published
    let records = Array.isArray(this.json.feedback.record) ? this.json.feedback.record : [this.json.feedback.record]

    let length = records.length

    for (let i = 0; i < length; i++) {
      let record = records[i]

      this.ip = record.row.source_ip

      console.log(`ip: ${this.ip}`)

      let data = { report_metadata, policy_published, record }

      data.record.auth_results = {
        dkim_auth: this.dkimAuth(record.auth_results.dkim),
        spf_auth: record.auth_results.spf,
      }

      console.log(data.record.auth_results)

      data.record.row = {
        ...data.record.row,
        source_ip_details: await this.sourceIpDetails(),
      }

      console.log('hit3')
      console.log(data.record.row)

      // Here we send data to kinesis
      // console.log(data);

      records[i] = null

      if (i % 20 === 0 || i === length - 1) {
        let endTime = new Date()

        let totalTime = endTime - startTime
        let loopTime = endTime - loop20Time

        console.log(`totalTime: ${totalTime}ms, recordTime: ${loopTime}ms`, process.memoryUsage().heapUsed)

        loop20Time = endTime
      }

      this.ip = null

      console.log('================ loop done ===================')
    }

    console.log(this.cache.length)

    // only distinct ips
    let temp = Object.keys(this.cache).filter((value, index, self) => self.indexOf(value) === index)
    console.log(temp.length)
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

  async sourceIpDetails() {
    let ip = Object.keys(this.cache).find(ip => ip === this.ip)

    if (ip) {
      console.log('found')
      console.log(this.cache[ip])

      return this.cache[ip]
    }

    let addresses

    try {
      console.log('Reverse ip')

      let reverse = dns.promises.reverse(this.ip)

      let timeout = new Promise(resolve => {
        setTimeout(resolve, 10000, [null])
      })

      addresses = await Promise.race([reverse, timeout])
    } catch (error) {
      addresses = [null]

      console.log(error.message)
    }

    console.log({ addresses })

    this.cache[this.ip] = {
      country_iso_code: this.getCountry(),
      organization_name: this.getAns(),
      host: addresses[0],
    }

    return this.cache[this.ip]
  }

  getCountry() {
    let response

    try {
      response = this.countryReader.country(this.ip)
    } catch (error) {
      //
    }

    console.log(response)

    return response?.country?.isoCode
  }

  getAns() {
    let response

    try {
      response = this.asnReader.asn(this.ip)
    } catch (error) {
      //
    }

    console.log(response)

    return response?.autonomousSystemOrganization
  }
}

export default Dmarc