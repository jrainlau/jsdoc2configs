import * as path from 'path'
import { glob } from 'glob'

export function fillTemplate(template: string, data: Record<string, string>, delimiter: string) {
  if (delimiter.length % 2 !== 0) {
    throw new Error('Delimiter must be an even number of characters long')
  }
  const middleIndex = delimiter.length / 2
  const startDelimiter = delimiter.slice(0, middleIndex)
  const endDelimiter = delimiter.slice(middleIndex)
  const regex = new RegExp(`${startDelimiter}\\s*(\\w+)\\s*${endDelimiter}`, 'g')

  return template.replace(regex, (match, p1) => {
    const value = data[p1]
    if (value === undefined) {
      return match
    }
    return JSON.stringify(value)
  })
}

export async function getFilesByPattern(pattern: string) {
  const files = await glob(pattern, { ignore: 'node_modules/**' })
  return files.map(file => path.resolve(file))
}
