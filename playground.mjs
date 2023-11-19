const run = async () => {
  let promise = new Promise(function (resolve) {
    setTimeout(() => resolve('done'), 3000)
  })

  let result = [1, await promise] // wait till the promise resolves (*)

  console.log(result)
}

run()
