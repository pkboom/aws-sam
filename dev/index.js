import { args } from './indexArguments.js'
import { execSync } from 'child_process'

const run = async () => {
  let options = `--stackName ${args.stackName} --outputValue '${args.outputValue}' --devDir ${args.devDir} --count ${args.count}`

  if (args.command === 'startMessageMoveTask') {
    options += ` --sourceArn ${args.sourceArn} --destinationArn ${args.destinationArn}`
  } else if (args.command === 'setQueueAttributes') {
    options += ` --visibilityTimeout ${args.visibilityTimeout}`
  } else if (args.command === 'deleteLogGroups') {
    options += ` --confirm ${args.confirm}`
  } else {
    //
  }

  let command = `node ${args.devDir}/${args.command}Command.js ${options}`

  console.log(command)

  execSync(command, {
    stdio: 'inherit',
  })
}

run()
