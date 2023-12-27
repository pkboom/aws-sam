import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let command = `aws logs put-retention-policy --log-group-name ${argv.value1} --retention-in-days ${argv.value2}`

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
