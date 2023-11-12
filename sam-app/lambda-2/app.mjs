export const handler = async (event, context) => {
  try {
    if (!event?.Records?.length) {
      return 'No records'
    }
    for (const record of event.Records) {
      const body = record.body
      const source = record?.messageAttributes?.source

      console.log(body)
      console.log(source)
    }
    return 'Successfully processed Records'
  } catch (err) {
    console.log(err)
    return err
  }
}
