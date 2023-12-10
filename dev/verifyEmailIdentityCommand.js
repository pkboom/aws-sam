import { argv } from './verifyEmailIdentityArguments.js'
import { execSync } from 'child_process'

let command = `aws ses verify-email-identity --email-address ${argv.email} `

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
