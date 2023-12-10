import { CloudWatchLogsClient, StartQueryCommand, GetQueryResultsCommand } from '@aws-sdk/client-cloudwatch-logs'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { wait } from './helper.js'

export const handler = async (event, context) => {
  try {
    console.log('######################### hit scheduler #########################')

    let client = new CloudWatchLogsClient()

    let now = new Date().getTime()
    let yesterday = new Date(now - 1000 * 60 * 60 * 24).getTime()

    console.log(`now: ${now / 1000}`)
    console.log(`yesterday: ${yesterday / 1000}`)

    let queryString = `
filter @type = "REPORT"
| fields @requestId, @billedDuration
| sort by @billedDuration desc
| limit 3
`

    let input = {
      logGroupName: '/aws/lambda/dmarc-DmarcFunction-4ruUK28mno8F',
      startTime: yesterday / 1000,
      endTime: now / 1000,
      queryString,
    }

    let command = new StartQueryCommand(input)
    let response = await client.send(command)

    console.log(response)
    console.log(`queryId: ${response.queryId}`)

    input = {
      queryId: response.queryId,
    }

    while (true) {
      command = new GetQueryResultsCommand(input)
      response = await client.send(command)

      console.log(`Status: ${response.status}`)

      if (response.status === 'Complete') {
        console.log(response.results)

        break
      }

      await wait(1000)
    }

    let body = response.results
      .map(
        result =>
          result
            .filter(item => item.field !== '@ptr')
            .map(item => `${item.field}: ${item.value}`)
            .join('\n') + '\n',
      )
      .join('\n')

    input = {
      Source: 'keunbae@inboxmonster.com',
      Destination: {
        ToAddresses: ['ppotpo@gmail.com'],
      },
      Message: {
        Subject: {
          Data: 'Result of dmarc processing',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: body,
            Charset: 'UTF-8',
          },
        },
      },
      ReplyToAddresses: [],
    }

    client = new SESClient()

    command = new SendEmailCommand(input)
    response = await client.send(command)

    console.log(response)

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
