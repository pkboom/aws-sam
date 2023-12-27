import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let command = `aws kinesis list-shards \
--stream-name ${argv.value1} \
--exclusive-start-shard-id shardId-000000000000
`

let shards = JSON.parse(execSync(command).toString()).Shards.map(shard => shard.ShardId)

console.log(`Total shards: ${shards.length}`)
