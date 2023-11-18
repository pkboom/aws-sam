import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
import { XMLParser } from 'fast-xml-parser'
import dns from 'dns'

let __dirname = path.dirname(fileURLToPath(import.meta.url))

const run = async () => {
  let xml = readFileSync(path.join(__dirname, 'data', 'google.com!spotify.com!1693958400!1694044799.xml'), 'utf-8')

  let json = new XMLParser().parse(xml)

  let records = Array.isArray(json.feedback.record) ? json.feedback.record : [json.feedback.record]

  let ips = []

  for (let i = 0; i < records.length; i++) {
    ips.push(records[i].row.source_ip)
  }

  console.log(ips.length)

  console.log(records.length)

  let uniqueIps = ips.filter((value, index, self) => self.indexOf(value) === index)

  console.log(uniqueIps.length)

  let reverses = []

  for (let i = 0; i < uniqueIps.length; i++) {
    let ip = uniqueIps[i]

    reverses.push(reverseLookup(ip))
  }

  let result = await Promise.all(reverses)

  console.log(result)
  console.log(result.length)

  console.log(records.length)

  console.log(ips.length)

  console.log(uniqueIps.length)
}

run()

async function reverseLookup(ip) {
  try {
    let reverse = dns.promises.reverse(ip)

    let timeout = new Promise(resolve => {
      setTimeout(resolve, 5000, [ip, [null]])
    })

    return [ip, await Promise.race([reverse, timeout])]
  } catch (error) {
    return [ip, [null]]
  }
}
