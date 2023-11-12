export const lambdaHandler = async event => {
  try {
    console.log(event)

    console.log(event.Records[0].body)

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
