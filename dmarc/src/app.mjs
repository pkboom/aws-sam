import Report from './Report.js'
import { errorMessages } from './helper.js'

export const handler = async event => {
  try {
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

    if (Object.values(errorMessages).includes(err.message)) {
      return {
        statusCode: 200,
      }
    }

    return err
  }
}
