import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let command = `aws sqs start-message-move-task \
--source-arn ${argv.value} \
--destination-arn ${argv.value2} \
--max-number-of-messages-per-second 50
`

execSync(command, {
  stdio: 'inherit',
})
