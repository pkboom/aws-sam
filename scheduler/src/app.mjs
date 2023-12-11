import Log from './Log.js'
import Email from './Email.js'

const log = new Log()

export const handler = async (event, context) => {
  console.log(context)

  let scheduleLogGroupName = `/aws/lambda/${context.functionName}`

  try {
    // await log.startQuery(billedDurationInput())

    // let body = await log.getQueryResults()

    // new Email().setSubject('Billed duration of dmarc processing').setBody(body).send()

    // await log.startQuery(maxMemoryInput())

    // let body = await log.getQueryResults()

    new Email().setSubject('Dmarc processing').setBody(body()).send()

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}

async function body() {
  let billedDurationResult = await billedDuration()
  let maxMemoryResult = await maxMemory()

  return ['Billed duration of dmarc processing', billedDurationResult, 'Max memory used of dmarc processing', maxMemoryResult].join('\n')
}

async function billedDuration() {
  await log.startQuery(billedDurationInput())

  return await log.getQueryResults()
}

function billedDurationInput() {
  let now = new Date().getTime()

  let yesterday = new Date(now - 1000 * 60 * 60 * 24).getTime()

  let queryString = `
filter @type = "REPORT"
| fields @requestId, @billedDuration
| sort by @billedDuration desc
| limit 3
`

  return {
    logGroupName: process.env.DMARC_LOG_GROUP_NAME,
    startTime: yesterday / 1000,
    endTime: now / 1000,
    queryString: queryString,
  }
}

async function maxMemory() {
  await log.startQuery(maxMemoryInput())

  return await log.getQueryResults()
}

function maxMemoryInput() {
  let now = new Date().getTime()

  let yesterday = new Date(now - 1000 * 60 * 60 * 24).getTime()

  let queryString = `
filter @type = "REPORT"
| fields @requestId, @maxMemoryUsed
| sort by @maxMemoryUsed desc
| limit 3
`

  return {
    logGroupName: process.env.DMARC_LOG_GROUP_NAME,
    startTime: yesterday / 1000,
    endTime: now / 1000,
    queryString: queryString,
  }
}
