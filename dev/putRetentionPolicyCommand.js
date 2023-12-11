import { argv } from './putRetentionPolicyArguments.js'
import { execSync } from 'child_process'

let command = `aws logs put-retention-policy --log-group-name ${argv.logGroupName} --retention-in-days ${argv.retentionInDays}`

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
