import { readFileSync, writeFileSync } from 'fs'
const src = readFileSync('lib/data/food-dupes.ts', 'utf8')
const matches = [...src.matchAll(/id:\s*["']([\w-]+)["'][\s\S]{0,800}?ko:\s*["']([^"']+)["']/g)]
const list = matches.map(m => m[1] + ' | ' + m[2]).join('\n')
writeFileSync('data/food-checklist.txt', list)
console.log('Saved ' + matches.length + ' foods to data/food-checklist.txt')
