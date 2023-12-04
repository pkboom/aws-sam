import { argv } from './startMessageMoveTaskArguments.js'
import { execSync } from 'child_process'

let command = `aws sqs start-message-move-task \
--source-arn ${argv.sourceArn} \
--destination-arn ${argv.destinationArn} \
--max-number-of-messages-per-second 50
`

execSync(command, {
  stdio: 'inherit',
})
