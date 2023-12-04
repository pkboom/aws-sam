import Bottleneck from 'bottleneck'
import dns from 'dns'
import { readFileSync, unlinkSync, writeFileSync } from 'fs'

try {
  unlinkSync('result.json')
} catch (error) {
  //
}

let limiter = new Bottleneck({
  maxConcurrent: 500,
})

let ips = readFileSync('ips2.json', 'utf8')

let json = JSON.parse(ips)

let uniqueIps = json.filter((value, index, self) => self.indexOf(value) === index)

console.log(uniqueIps.length)

const run = async () => {
  let reverses = []

  for (let i = 0; i < uniqueIps.length; i++) {
    reverses.push(reverseLookup(json[i]))
  }

  const result = await Promise.allSettled(reverses)

  writeFileSync('result.json', JSON.stringify(result))
}

run()

async function reverseLookup(ip) {
  // console.log(ip)
  return limiter.schedule(
    {
      expiration: 5000,
    },
    () => dns.promises.reverse(ip),
  )
}
