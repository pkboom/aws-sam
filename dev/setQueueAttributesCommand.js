import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let attributes = {
  VisibilityTimeout: '' + argv.visibilityTimeout,
}

// https://awscli.amazonaws.com/v2/documentation/api/latest/reference/sqs/set-queue-attributes.html
let command = `
aws sqs set-queue-attributes \
--queue-url ${argv.value} \
--attributes '${JSON.stringify(attributes)}'
`

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
