const fs = require('fs')
const os = require('os')
const path = require('path')

let currentProfile = ''

let config = fs
  .readFileSync(path.join(os.homedir(), '.aws', 'credentials'), 'utf8')
  .split(/\r?\n/)
  .filter(line => line.trim())
  .reduce((acc, line) => {
    if (line.startsWith('[')) {
      currentProfile = line.slice(1, -1)

      acc.push({ name: currentProfile })
    } else {
      let [name, value] = line.split('=')

      acc.find(profile => profile.name === currentProfile)[name.trim()] = value.trim()
    }

    return acc
  }, [])

console.log(config)
