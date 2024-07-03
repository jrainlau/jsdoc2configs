import * as path from 'path'
import { glob } from 'glob'
import { JSDocCallbackTag, JSDocParameterTag, JSDocTag, SyntaxKind } from 'ts-morph'

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

const SupportedJSDocTagsKinds = [
'JSDocTag',
'JSDocAugmentsTag',
'JSDocAuthorTag',
'JSDocDeprecatedTag',
'JSDocClassTag',
'JSDocPublicTag',
'JSDocPrivateTag',
'JSDocProtectedTag',
'JSDocReadonlyTag',
'JSDocOverrideTag',
'JSDocCallbackTag',
'JSDocOverloadTag',
'JSDocParameterTag',
'JSDocReturnTag',
'JSDocTypeTag',
'JSDocTemplateTag',
'JSDocSeeTag',
'JSDocPropertyTag',
'JSDocThrowsTag',
]

const JSDocTagWithTypeExpression = [
  'JSDocParameterTag',
  'JSDocReturnTag',
  'JSDocThrowsTag',
  'JSDocTypeTag',
]

const JSDocTagWithTypeDefinition = [
  'JSDocCallbackTag',
  'JSDocAugmentsTag',
]

export function getJSDocFullContent(jsdocTag: JSDocTag) {
  const tagKindName = jsdocTag.getKindName()
  if (!SupportedJSDocTagsKinds.includes(tagKindName)) {
    return `${tagKindName} is not supported`
  }
  const comment = jsdocTag.getCommentText()
  
  let tagContent = comment

  JSDocTagWithTypeExpression.forEach((tag) => {
    if (tag === tagKindName) {
      const typedJsdocTag = jsdocTag as JSDocParameterTag
      const typeExpression = typedJsdocTag.getTypeExpression()
      let paramName = typedJsdocTag.getName?.() || ''
      if (paramName) {
        paramName = typedJsdocTag.isBracketed?.() ? `[${paramName}]` : paramName
      }
      tagContent = `${typeExpression?.getText()} ${paramName} ${comment}`
    }
  })

  JSDocTagWithTypeDefinition.forEach((tag) => {
    if (tag === tagKindName) {
      tagContent = `CUSTOM_KIND ${comment}`
    }
  })

  return tagContent
}
