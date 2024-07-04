import { Project, SyntaxKind } from 'ts-morph'
import { fillTemplate, getFilesByPattern, getJSDocFullContent } from './utils'

interface Jsdoc2ConfigsOptions {
  inputs: string[];
  template?: string;
  delimiter?: string;
  keyCommentTag?: string;
  convertFunction?: (docContent: string) => any;
}

const DEFAULT_TEMPLATE = ``
const DEFAULT_DELIMITER = '{{}}'
const DEFAULT_KEY_COMMENT_TAG = 'jsdoc2configs'
const DEFAULT_CONVERT_FUNCTION = (docContent: string) => docContent

const jsdoc2configs = async (options: Jsdoc2ConfigsOptions) => {
  const {
    inputs,
    template = DEFAULT_TEMPLATE,
    delimiter = DEFAULT_DELIMITER,
    keyCommentTag = DEFAULT_KEY_COMMENT_TAG,
    convertFunction = DEFAULT_CONVERT_FUNCTION,
  } = options

  const jsdocList: Record<string, string>[] = []
  const renderedList: any[] = []

  let filePathList: string[] = [];
  for (const pattern of inputs) {
    const list = await getFilesByPattern(pattern)
    filePathList = [...filePathList, ...list]
  }

  for (const filePath of filePathList) {
    const project = new Project()
    const sourceFile = project.addSourceFileAtPath(filePath)
    const jsDocComments = sourceFile.getDescendantsOfKind(SyntaxKind.JSDoc)

    jsDocComments.forEach((doc) => {
      const docContent: {[key: string]: any} = {}
      doc.getTags().forEach((tag, index) => {
        const tagName = tag.getTagName?.() || tag.getKindName()
        if (index === 0 && tagName !== keyCommentTag) return

        const content = getJSDocFullContent(tag)

        if (!docContent[tagName]) {
          docContent[tagName] = content
        } else {
          const tmp = docContent[tagName]
          if (Array.isArray(tmp)) {
            tmp.push(content)
          } else {
            docContent[tagName] = [tmp, content]
          }
        }
      })
      if (docContent.hasOwnProperty(keyCommentTag)) {
        jsdocList.push(docContent)
      }
    })
  }

  jsdocList.forEach((docContent) => {
    const res = fillTemplate(template, docContent, delimiter)
    if (res === template) { return }
    renderedList.push(convertFunction?.(res) || res)
  })

  return { jsdocList, renderedList }
}

export default jsdoc2configs
