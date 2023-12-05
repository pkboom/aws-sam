import { input } from '@inquirer/prompts'
import autocomplete from 'inquirer-autocomplete-standalone'
import fuzzy from 'fuzzy'
import fs from 'fs'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import toml from 'toml'
import { execSync } from 'child_process'

async function search(options, input = '') {
  let results = await new Promise(resolve => {
    setTimeout(() => {
      resolve(fuzzy.filter(input, options).map(el => el.original))
    }, 200)
  })

  return results.map(item => ({
    value: item,
    // description: `${item} - description`,
  }))
}

let devDir = path.dirname(fileURLToPath(import.meta.url))

let answers = { devDir }

answers['stackName'] = await autocomplete({
  message: 'What is the stack name?',
  source: async (input = '') => {
    let stacks = readdirSync(path.join(devDir, '..'), { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => dir.name)
      .filter(dir => !dir.startsWith('.'))
      .filter(dir => !['dev', 'node_modules'].includes(dir))

    return await search(stacks, input)
  },
})

answers['command'] = await autocomplete({
  message: 'What do you want to do?',
  source: async (input = '') => {
    let commands = fs
      .readdirSync(devDir)
      .filter(file => file.includes('Command'))
      .map(file => file.replace('Command.js', ''))
      .sort()

    return await search(commands, input)
  },
})

let stackOutputs = JSON.parse(execSync(`sam list stack-outputs --stack-name ${answers.stackName} --output json`).toString())

if (['sendMessageBatch', 'sendMessage'].includes(answers.command)) {
  console.log('It needs a url')
}

if (!['startMessageMoveTask'].includes(answers.command)) {
  answers['outputKey'] = await autocomplete({
    message: 'What is the outputKey?',
    source: async (input = '') => {
      let outputKeys = stackOutputs.map(output => output.OutputKey)

      return await search(outputKeys, input)
    },
  })

  answers['outputValue'] = stackOutputs.find(output => output.OutputKey === answers['outputKey'])?.OutputValue
}

if (['startMessageMoveTask'].includes(answers.command)) {
  answers['sourceArnKey'] = await autocomplete({
    message: 'What is the sourceArn?',
    source: async (input = '') => {
      let outputKeys = stackOutputs.map(output => output.OutputKey)

      return await search(outputKeys, input)
    },
  })

  answers['sourceArn'] = stackOutputs.find(output => output.OutputKey === answers['sourceArnKey'])?.OutputValue

  answers['destinationArnKey'] = await autocomplete({
    message: 'What is the destinationArn?',
    source: async (input = '') => {
      let outputKeys = stackOutputs.map(output => output.OutputKey)

      return await search(outputKeys, input)
    },
  })

  answers['destinationArn'] = stackOutputs.find(output => output.OutputKey === answers['destinationArnKey'])?.OutputValue
}

if (['sendMessageBatch'].includes(answers.command)) {
  answers['count'] = await input({ message: 'How many times?' })
}

console.log(answers)

export const args = answers
