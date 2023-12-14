import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let command = `aws ses verify-email-identity --email-address ${argv.value}`

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
