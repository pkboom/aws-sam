import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { argv } from './commonArguments.js'

const client = new SQSClient({})

const run = async () => {
  let input = {
    MessageBody: JSON.stringify({
      eml: 'google.eml',
    }),
    QueueUrl: argv.outputValue,
  }
  let command = new SendMessageCommand(input)

  let response = await client.send(command)

  console.log(response)
}

run()
