import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let command = `aws kinesis update-shard-count \
--stream-name ${argv.value} \
--scaling-type UNIFORM_SCALING \
--target-shard-count ${argv.count}`

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
