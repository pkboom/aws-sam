// import uuid
import { v4 as uuidv4 } from 'uuid'
import { currentTimestamp } from './helper.js'

export const handler = async (event, context) => {
  try {
    console.log('######################### hit scheduler #########################')
    console.log(currentTimestamp())
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudwatch-logs/command/StartQueryCommand/

    //  print uuid
    console.log(uuidv4())

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
