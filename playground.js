async function sendMessage() {
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    success: true,
    response: 1234,
  }
}

module.exports.sendMessage = sendMessage
