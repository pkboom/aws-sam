import { args } from './indexArguments.js'
import { execSync } from 'child_process'

const run = async () => {
  let options = ` --value1 ${args.value1} --value2 ${args.value2} --value3 ${args.value3}`

  let command = `node ${args.devDir}/${args.command}.js ${options}`

  console.log(command)

  execSync(command, {
    stdio: 'inherit',
  })
}

run()
