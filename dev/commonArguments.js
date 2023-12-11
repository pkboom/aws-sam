import yargs from 'yargs/yargs'

export const argv = yargs(process.argv.slice(2)).option('outputValue', {
  type: 'string',
}).argv
