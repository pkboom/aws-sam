export const currentTimestamp = () => {
  return new Date().getTime()
}

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export { wait }
