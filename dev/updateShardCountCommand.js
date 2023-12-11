import { argv } from './commonArguments.js'
import { execSync } from 'child_process'

let command = `aws kinesis update-shard-count \
--stream-name ${argv.outputValue} \
--scaling-type UNIFORM_SCALING \
--target-shard-count ${argv.count}`

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
