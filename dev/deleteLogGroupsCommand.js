import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let command = `aws logs describe-log-groups`

let logGroups = JSON.parse(execSync(command).toString()).logGroups.map(logGroup => logGroup.logGroupName)

if (argv.confirm) {
  logGroups = logGroups.forEach(logGroup => {
    command = `aws logs delete-log-group --log-group-name ${logGroup}`

    console.log(command)

    execSync(command, {
      stdio: 'inherit',
    })

    console.log('All deleted.')
  })
} else {
  console.log('We are not deleting the log groups.')

  console.log(logGroups)
}
