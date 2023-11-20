export const lambdaHandler = async (event, context) => {
  console.log(event)

  console.log(3333)

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
