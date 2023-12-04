import { v4 as uuidv4 } from 'uuid'
import { currentTimestamp, wait } from '/opt/nodejs/helper.js'

export const lambdaHandler = async (event, context) => {
  console.log('Hello World')

  console.log('uuid: ' + uuidv4())

  await wait(5000)

  console.log(currentTimestamp())

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello world',
      }),
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
