import { args } from './indexArguments.js'
import { execSync } from 'child_process'

const run = async () => {
  let options

  if (args.command === 'startMessageMoveTask') {
    options += ` --sourceArn ${args.sourceArn} --destinationArn ${args.destinationArn}`
  } else if (args.command === 'sendMessageBatch') {
    options += ` --outputValue '${args.outputValue}' --count ${args.count}`
  } else {
    options = `--stackName ${args.stackName} --outputValue '${args.outputValue}' --devDir ${args.devDir}`
    //
  }

  let command = `node ${args.devDir}/${args.command}Command.js ${options}`

  console.log(command)

  execSync(command, {
    stdio: 'inherit',
  })
}

run()
