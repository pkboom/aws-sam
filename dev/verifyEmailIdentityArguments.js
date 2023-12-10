import yargs from 'yargs/yargs'

export const argv = yargs(process.argv.slice(2)).option('email', {
  type: 'string',
}).argv
