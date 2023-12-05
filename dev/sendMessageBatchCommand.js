import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { argv } from './sendMessageBatchArguments.js'

const client = new SQSClient({})

console.log(argv)

const run = async () => {
  let entries = []

  for (let i = 0; i < argv.count; i++) {
    for (let j = 0; j < 10; j++) {
      entries.push({
        Id: j.toString(),
        MessageBody: JSON.stringify({
          eml: 'google.eml',
        }),
      })
    }

    let input = {
      QueueUrl: argv.outputValue,
      Entries: entries,
    }

    let command = new SendMessageBatchCommand(input)

    let response = await client.send(command)

    console.log(response)

    entries = []

    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

run()