import { argv } from './commonArguments.js'
import { execSync } from 'child_process'

let attributes = {
  VisibilityTimeout: '' + argv.visibilityTimeout,
}

// https://awscli.amazonaws.com/v2/documentation/api/latest/reference/sqs/set-queue-attributes.html
let command = `
aws sqs set-queue-attributes \
--queue-url ${argv.outputValue} \
--attributes '${JSON.stringify(attributes)}'
`

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
