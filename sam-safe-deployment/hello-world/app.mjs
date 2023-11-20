export const lambdaHandler = async (event, context) => {
  console.log(event)

  console.log(1111)

  throw new Error('error')

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
