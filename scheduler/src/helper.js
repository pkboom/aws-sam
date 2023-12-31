export const currentTimestamp = () => {
  return new Date().getTime()
}

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export { wait }

export const errorMessages = {
  badXml: 'Bad xml',
  badAttachment: 'Bad attachment',
  noAttachment: 'No attachment',
  badContentType: 'Bad content type',
  badKey: 'Bad key',
  badEvent: 'Bad event',
  test: 'test',
}

export const REVERSE_LOOKUP = 'reverse_lookup'

export const REVERSE_LOOKUP_INDEX = 'reverse_lookup_index'
