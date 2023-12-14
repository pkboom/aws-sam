import { args } from './indexArguments.js'
import { execSync } from 'child_process'

const run = async () => {
  let options = ` --value ${args.value} --value2 ${args.value2}`

  if (args.command === 'startMessageMoveTaskCommand') {
    options += ` --sourceArn ${args.sourceArn} --destinationArn ${args.destinationArn}`
  } else if (args.command === 'setQueueAttributesCommand') {
    options += ` --visibilityTimeout ${args.visibilityTimeout}`
  } else if (['fillBucketCommand'].includes(args.command)) {
    options += ` --devDir ${args.devDir}`
  } else if (['sendMessageBatchCommand', 'updateShardCountCommand'].includes(args.command)) {
    options += ` --count ${args.count}`
  }

  let command = `node ${args.devDir}/${args.command}.js ${options}`

  console.log(command)

  execSync(command, {
    stdio: 'inherit',
  })
}

run()
