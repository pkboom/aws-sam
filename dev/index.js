import { args } from './indexArguments.js'
import { execSync } from 'child_process'

const run = async () => {
  let options = `--outputValue '${args.outputValue}' --devDir ${args.devDir} --count ${args.count}`

  if (args.command === 'startMessageMoveTaskCommand') {
    options += ` --sourceArn ${args.sourceArn} --destinationArn ${args.destinationArn}`
  } else if (args.command === 'setQueueAttributesCommand') {
    options += ` --visibilityTimeout ${args.visibilityTimeout}`
  } else if (args.command === 'deleteLogGroupsCommand') {
    options += ` --confirm ${args.confirm}`
  } else if (['sendMessageBatchCommand', 'updateShardCountCommand'].includes(args.command)) {
    options += ` --count ${args.count}`
  } else if (args.command === 'putRetentionPolicyCommand') {
    options += ` --logGroupName ${args.logGroupName} --retentionInDays ${args.retentionInDays}`
  } else if (args.command === 'verifyEmailIdentityCommand') {
    options += ` --email ${args.email}`
  }

  let command = `node ${args.devDir}/${args.command}.js ${options}`

  console.log(command)

  execSync(command, {
    stdio: 'inherit',
  })
}

run()
