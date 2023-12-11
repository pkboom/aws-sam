import Email from './Email.js'
import Query from './Query.js'

export const handler = async (event, context) => {
  let scheduleLogGroupName = `/aws/lambda/${context.functionName}`

  let now = new Date().getTime()

  let yesterday = new Date(now - 1000 * 60 * 60 * 24).getTime()

  try {
    let result = await new Query()
      .setFrom(yesterday)
      .setTo(now)
      .setLogGroup(process.env.DMARC_LOG_GROUP_NAME)
      .setQuery(query())
      .run()

    let body = ['Period: 1 day', result]

    await new Email().setSubject('Dmarc processing').setBody(body.join('\n')).send()

    result = await new Query().setFrom(yesterday).setTo(now).setLogGroup(scheduleLogGroupName).setQuery(query()).run()

    body = ['Period: 1 day', result]

    await new Email().setSubject('Dmarc Scheduler').setBody(body.join('\n')).send()

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}

function query() {
  return `
filter @type = "REPORT"
| stats 
  max(@maxMemoryUsed / 1000 / 1000) as maxMemoryUsedMB,
  max(@memorySize / 1000 / 1000) as provisionedMemoryMB,
  provisionedMemoryMB - maxMemoryUsedMB as overProvisionedMB,
  max(@billedDuration / 1000) as billedDurationSec
`
}
