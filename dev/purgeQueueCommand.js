import { SQSClient, PurgeQueueCommand } from '@aws-sdk/client-sqs'
import { argv } from './commonArguments.js'

const client = new SQSClient({})

const run = async () => {
  let input = {
    QueueUrl: argv.outputValue,
  }

  let command = new PurgeQueueCommand(input)

  let response = await client.send(command)

  console.log(response)
}

run()
