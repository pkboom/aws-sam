export const handler = async (event, context) => {
  for (const record of event.Records) {
    try {
      console.log('hit2')

      console.log(`Processed Kinesis Event - EventID: ${record.eventID}`)

      const recordData = await getRecordDataAsync(record.kinesis)

      console.log(`Record Data: ${recordData}`)
    } catch (err) {
      console.error(`An error occurred ${err}`)

      throw err
    }
  }

  console.log(`Successfully processed ${event.Records.length} records.`)
}

async function getRecordDataAsync(payload) {
  var data = Buffer.from(payload.data, 'base64').toString('utf-8')

  await Promise.resolve(1) //Placeholder for actual async work

  return data
}
