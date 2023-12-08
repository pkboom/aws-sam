import { XMLParser } from 'fast-xml-parser'
import { simpleParser } from 'mailparser'
import { readFileSync } from 'fs'

let eml = readFileSync('hello.eml', 'utf8')

let parsed = await simpleParser(eml.toString())

console.log(parsed.from)
