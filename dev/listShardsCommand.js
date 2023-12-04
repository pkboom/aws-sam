import { argv } from './commonArguments.js'
import { execSync } from 'child_process'

let command = `aws kinesis list-shards \
--stream-name ${argv.outputValue} \
--exclusive-start-shard-id shardId-000000000000
`

let shards = JSON.parse(execSync(command).toString()).Shards.map(shard => shard.ShardId)

console.log(`Total shards: ${shards.length}`)
