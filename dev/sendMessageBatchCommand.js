import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

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
      QueueUrl: argv.value,
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
