import { args } from './indexArguments.js'
import { execSync } from 'child_process'

const run = async () => {
  let options

  if (args.command === 'startMessageMoveTask') {
    options += ` --sourceArn ${args.sourceArn} --destinationArn ${args.destinationArn}`
  } else {
    options = `--stackName ${args.stackName} --outputValue '${args.outputValue}' --devDir ${args.devDir} --count ${args.count}`
  }

  let command = `node ${args.devDir}/${args.command}Command.js ${options}`

  console.log(command)

  execSync(command, {
    stdio: 'inherit',
  })
}

run()
