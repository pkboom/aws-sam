import { execSync } from 'child_process'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

let command

for (let i = argv.value2; i > 0; i--) {
  command = `aws lambda delete-layer-version \
--layer-name ${argv.value1} \
--version-number ${i}
`

  console.log(command)

  execSync(command, {
    stdio: 'inherit',
  })
}

console.log('Layer deleted!')
