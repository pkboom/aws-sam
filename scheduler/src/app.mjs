import Email from './Email.js'
import Query from './Query.js'

export const handler = async (event, context) => {
  let scheduleLogGroupName = `/aws/lambda/${context.functionName}`

  console.log(`scheduleLogGroupName: ${scheduleLogGroupName}`)

  let now = new Date().getTime()

  let yesterday = new Date(now - 1000 * 60 * 60 * 24).getTime()

  try {
    let billedDurationResults = new Query()
      .setFrom(now)
      .setTo(yesterday)
      .setLogGroup(process.env.DMARC_LOG_GROUP_NAME)
      .setQuery(billedDurationQuery())
      .run()

    let maxMemoryResults = new Query()
      .setFrom(now)
      .setTo(yesterday)
      .setLogGroup(process.env.DMARC_LOG_GROUP_NAME)
      .setQuery(maxMemoryQuery())
      .run()

    let body = ['Billed duration', billedDurationResults, '===', 'Max memory used', maxMemoryResults].join('\n')

    new Email().setSubject('Dmarc processing').setBody(body).send()

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}

function billedDurationQuery() {
  return `
  filter @type = "REPORT"
  | fields @requestId, @billedDuration
  | sort by @billedDuration desc
  | limit 3
  `
}

function maxMemoryQuery() {
  return `
  filter @type = "REPORT"
  | fields @requestId, @maxMemoryUsed
  | sort by @maxMemoryUsed desc
  | limit 3
  `
}
