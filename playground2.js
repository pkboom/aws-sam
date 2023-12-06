import Bottleneck from 'bottleneck'
import dns from 'dns'
import { readFileSync, unlinkSync, writeFileSync } from 'fs'

try {
  unlinkSync('result.json')
} catch (error) {
  //
}

let limiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 1000,
  id: 'reverseLookup',
  datastore: 'redis',
  clientOptions: {
    host: '127.0.0.1',
    port: 6379,
  },
})

let ips = readFileSync('ips.json', 'utf8')

let newIps = JSON.parse(ips)

let uniqueIps = newIps.filter((value, index, self) => self.indexOf(value) === index)

console.log(uniqueIps.length)

const run = async () => {
  let reverses = []

  for (let i = 0; i < uniqueIps.length; i++) {
    reverses.push(reverseLookup(newIps[i]))
  }

  const result = await Promise.allSettled(reverses)

  writeFileSync('result.json', JSON.stringify(result))
}

run()

function reverseLookup(ip) {
  return limiter.schedule(
    {
      expiration: 5000,
    },
    () => dns.promises.reverse(ip),
  )
}
