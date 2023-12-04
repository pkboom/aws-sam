import Record from './Record.js'

export const handler = async event => {
  try {
    console.log('##### sendToKinesis ######')
    // console.log(event)

    let record = new Record()

    await record.getRecords(event)

    await record.getAddresses()

    await record.send()

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
