export const handler = async (event, context) => {
  try {
    console.log('######################### hit scheduler #########################')
    console.log(event)

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
