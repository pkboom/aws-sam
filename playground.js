import redis from 'redis'
import { readFileSync } from 'fs'
import dns from 'dns'

const redisClient = redis.createClient({ port: 6379, host: '127.0.0.1' })

await redisClient.connect()

let file = readFileSync('reverses.json', 'utf8')

let json = JSON.parse(file)

const REVERSE_LOOKUP = 'reverse_lookup'

const REVERSE_LOOKUP_INDEX = 'reverse_lookup_index'

const run = async () => {
  await redisClient.del(REVERSE_LOOKUP)
  await redisClient.del(REVERSE_LOOKUP_INDEX)

  await redisClient.hSet(REVERSE_LOOKUP, json)

  let uniqueIps = ['2a01:111:f403:7053::80b', '157.7.106.52', '113.192.242.121', '113.192.242.122', '113.192.242.123']

  let reverseLookup = await redisClient.hmGet(REVERSE_LOOKUP, uniqueIps)

  console.log({ reverseLookup })

  let newIps = []

  let existingIps = uniqueIps.reduce((acc, ip, index) => {
    if (reverseLookup[index] === null) {
      newIps.push(ip)
    } else {
      acc[ip] = reverseLookup[index]
    }

    return acc
  }, {})

  console.log({ existingIps })
  console.log({ newIps })

  let addresses = {}

  let date = new Date().getTime()

  for (let i = 0; i < newIps.length; i++) {
    addresses[newIps[i]] = await dns.promises.reverse(newIps[i])

    await redisClient.zAdd(REVERSE_LOOKUP_INDEX, {
      score: new Date(date - i * 24 * 60 * 60 * 1000).getTime(),
      value: newIps[i],
    })
  }

  let oneDayBeforelastWeek = new Date(date - 8 * 24 * 60 * 60 * 1000).getTime()
  let lastWeek = new Date(date - 7 * 24 * 60 * 60 * 1000).getTime()

  await redisClient.zAdd(REVERSE_LOOKUP_INDEX, {
    score: oneDayBeforelastWeek,
    value: '113.192.242.123',
  })

  let reverses = newIps.reduce((acc, ip) => {
    acc[ip] = addresses[ip].join()

    return acc
  }, {})

  console.log({ reverses })

  await redisClient.hSet(REVERSE_LOOKUP, reverses)

  reverseLookup = await redisClient.hGetAll(REVERSE_LOOKUP)

  console.log({ reverseLookup })

  Object.assign(reverses, existingIps)

  console.log({ reverses })

  console.log({ date })

  console.log({ oneDayBeforelastWeek })

  let oldIps = await redisClient.zRangeByScore(REVERSE_LOOKUP_INDEX, 0, lastWeek)

  console.log({ oldIps })

  await redisClient.hDel(REVERSE_LOOKUP, oldIps)

  reverseLookup = await redisClient.hGetAll(REVERSE_LOOKUP)

  console.log({ reverseLookup })

  await redisClient.quit()
}

run()
