import Bottleneck from 'bottleneck'
import dns from 'dns'
import { readFileSync } from 'fs'

let limiter = new Bottleneck({
  maxConcurrent: 500,
})

export const lambdaHandler = async (event, context) => {
  try {
    let ips = readFileSync('ips.json', 'utf8')

    let json = JSON.parse(ips)

    console.log(json.length)

    let reverses = []

    for (let i = 0; i < json.length; i++) {
      reverses.push(reverseLookup(json[i]))
    }

    const result = await Promise.allSettled(reverses)

    console.log(result)

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}

function reverseLookup(ip) {
  // console.log(ip)
  return limiter.schedule(
    {
      expiration: 5000,
    },
    () => dns.promises.reverse(ip),
  )
}
