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
      return `"${match}"`
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
  'JSDocTemplateTag',
  'JSDocSeeTag',
  'JSDocPropertyTag',
  'JSDocThrowsTag',
]

const JSDocTagWithTypeExpression = [
  'JSDocParameterTag',
  'JSDocReturnTag',
  'JSDocThrowsTag',
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
  
  let tagContent: string | { type: string; comment: string | undefined; paramName?: string; optional?: boolean; } | undefined = comment

  JSDocTagWithTypeExpression.forEach((tag) => {
    if (tag === tagKindName) {
      const typedJsdocTag = jsdocTag as JSDocParameterTag

      const [tagLabel, tagTypeExpression, paramName] = typedJsdocTag.getChildren().map(node => node.getFullText())
      tagContent = {
        type: tagTypeExpression,
        comment,
        paramName,
        optional: typedJsdocTag.isBracketed?.() ?? undefined,
      }
    }
  })

  JSDocTagWithTypeDefinition.forEach((tag) => {
    if (tag === tagKindName) {
      const [tagLabel, tagTypeExpression] = jsdocTag.getChildren().map(node => node.getFullText())
      tagContent = {
        type: tagTypeExpression,
        comment,
      }
    }
  })

  return tagContent
}
