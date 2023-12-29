import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let command = `aws lambda update-function-configuration \
--function-name  my-function \
--memory-size ${argv.value1}`

console.log(command)

execSync(command, {
  stdio: 'inherit',
})
