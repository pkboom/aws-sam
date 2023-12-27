import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

const client = new SQSClient({})

function s3Message() {
  return {
    Records: [
      {
        s3: {
          object: {
            key: 'email/whisnantstrategies.eml',
          },
        },
      },
    ],
  }
}

const run = async () => {
  let entries = []

  for (let i = 0; i < argv.value2; i++) {
    for (let j = 0; j < 10; j++) {
      entries.push({
        Id: j.toString(),
        MessageBody: JSON.stringify(s3Message()),
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
