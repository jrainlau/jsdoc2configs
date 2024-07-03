import { Project, SyntaxKind } from 'ts-morph'
import { fillTemplate, getFilesByPattern } from './utils'

interface Jsdoc2ConfigsOptions {
  inputs: string[];
  template: string;
  delimiter?: string;
  keyCommentTag?: string;
  convertFunction?: (docContent: string) => any;
}

const DEFAULT_DELIMITER = '{{}}'
const DEFAULT_KEY_COMMENT_TAG = 'jsdoc2configs'

const jsdoc2configs = async (options: Jsdoc2ConfigsOptions) => {
  const {
    inputs,
    template,
    delimiter = DEFAULT_DELIMITER,
    keyCommentTag = DEFAULT_KEY_COMMENT_TAG,
    convertFunction,
  } = options

  const docContentsList: Record<string, string>[] = []
  const result: any[] = []

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
        const tagName = tag.getTagName()
        if (index === 0 && tagName !== keyCommentTag) return

        const comment = tag.getComment()

        if (!docContent[tagName]) {
          docContent[tagName] = comment
        } else {
          const tmp = docContent[tagName]
          if (Array.isArray(tmp)) {
            tmp.push(comment)
          } else {
            docContent[tagName] = [tmp, comment]
          }
        }
      })
      if (docContent.hasOwnProperty(keyCommentTag)) {
        docContentsList.push(docContent)
      }
    })

    docContentsList.forEach((docContent) => {
      const res = fillTemplate(template, docContent, delimiter)
      if (res === template) return
      result.push(convertFunction?.(res) || res)
    })
  }

  return result
}

export default jsdoc2configs

jsdoc2configs({
  inputs: ['./test/test_folder_1/file_1.ts'],
  template: `{
  "desc": {{ desc }},
  "param": {{ param }},
  "returns": {{ returns }}
}`,
  convertFunction: (docContent: string) => JSON.parse(docContent),
})
  .then(console.log)
  .catch(console.error)
