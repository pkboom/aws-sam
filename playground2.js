import Tangerine from 'tangerine'
import dns from 'dns'

let resolver = new Tangerine()

const run = async () => {
  let result = await resolver.reverse('113.192.242.121')
  let result2 = await dns.promises.reverse('113.192.242.121')

  console.log({ result })
  console.log({ result2 })
}

run()
