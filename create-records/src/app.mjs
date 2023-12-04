import Report from './Report.js'

export const handler = async event => {
  try {
    console.log('##### Processing dmarc report ######')

    let report = new Report()

    await report.getMessage(event)

    await report.toJson()

    await report.getAddresses()

    await report.sendToKinesis()

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
