import { describe, expect, test } from 'bun:test'
import jsdoc2configs from '../index'

describe('jsdoc2configs', () => {
  test('Should return { jsdocList, renderedList } after running', async () => {
    const { jsdocList, renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/file_1.ts'],
      template: `{{ desc }}`,
    })

    expect(jsdocList).toBeArray()
    expect(renderedList).toBeArray()
    expect(jsdocList.every(item => typeof item === 'object')).toBeTrue()
    expect(renderedList.every(item => typeof item === 'string')).toBeTrue()
  })

  test('Only works with matched keyCommentTag.', async () => {
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/file_1.ts'],
      template: `{
      "desc": {{ desc }},
      "param": {{ param }},
      "returns": {{ returns }}
}`,
      convertFunction: (docContent: string) => JSON.parse(docContent),
    })

    expect(renderedList.length).toBe(2)
    expect(renderedList[0].desc).toBe('Sum of two numbers.')
    expect(renderedList[1].desc).toBe('Diff of two numbers.')
  })

  test('Should replace the delimiter with values', async () => {
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/file_1.ts'],
      template: `{
      "desc": {{ desc }},
      "param": {{ param }},
      "returns": {{ returns }}
}`,
      convertFunction: (docContent: string) => JSON.parse(docContent),
    })

    expect(renderedList.length).toBe(2)
    expect(renderedList[0].desc).toBe('Sum of two numbers.')
    expect(Array.isArray(renderedList[0].param)).toBe(true)
    expect(renderedList[0].param).toStrictEqual([{ type: "{number}", comment: "- Number of one.", paramName: "a", optional: false }, { type: "{number}", comment: "- Number of another.", paramName: "b", optional: false }])
    expect(renderedList[0].returns).toStrictEqual({ type: "{number}", comment: "a + b"})
  })

  test('Multiple comment tags with same name are supported', async () => {
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/file_2.ts'],
      template: `{
      "desc": {{ desc }},
      "param": {{ param }},
      "returns": {{ returns }}
}`,
      convertFunction: (docContent: string) => JSON.parse(docContent),
    })

    expect(renderedList.length).toBe(2)
    expect(Array.isArray(renderedList[0].param)).toBe(false)
    expect(Array.isArray(renderedList[1].param)).toBe(true)
  })

  test('Custom tags are supported', async () => {
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/file_3.ts'],
      template: `{
      "desc": {{ desc }},
      "example": {{ example }},
      "returns": {{ returns }},
      "custom": {{ custom }}
}`,
      convertFunction: (docContent: string) => JSON.parse(docContent),
    })

    expect(renderedList[0].example).toBe("```js\n// example code block\nconst foo = getFoo() {}\n\nassert.strictEqual(foo, 'foo')\n```")
    expect(renderedList[0].custom).toBe("Oh this is a custom comment tag!")
  })

  test('Allow glob syntax in input.', async () => {
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/**.ts'],
      template: `{ "desc": {{ desc }} }`,
      convertFunction: (docContent: string) => JSON.parse(docContent),
    })

    expect(renderedList.length).toBe(5)
  })

  test('Allow custom template', async () => {
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/**.ts'],
      template: `{{ desc }}`,
    })

    expect(renderedList.length).toBe(5)
    expect(renderedList.every(item => typeof item === 'string')).toBe(true)
  })

  test('Allow custom convertFunction', async () => {
    const CUSTOM_SUFFIX = '[CUSTOM_SUFFIX]'
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/**.ts'],
      template: `{{ desc }}`,
      convertFunction: (docContent: string) => docContent.replace(/\"/g, '') + CUSTOM_SUFFIX,
    })

    expect(renderedList.every(item => typeof item === 'string')).toBe(true)
    expect(renderedList.every(item => (item as string).endsWith(CUSTOM_SUFFIX))).toBe(true)
  })

  test('Allow custom delimiter', async () => {
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/**.ts'],
      delimiter: '%%',
      template: `% desc %`,
    })

    expect(renderedList.length).toBe(5)
    expect(renderedList.every(item => typeof item === 'string')).toBe(true)
  })

  test('Allow custom keyCommentTag', async () => {
    const { renderedList } = await jsdoc2configs({
      inputs: ['test/fixtures/**.ts'],
      keyCommentTag: 'otherKeyTag',
      template: `{{ desc }}`,
    })

    expect(renderedList.length).toBe(1)
    expect(renderedList[0]).toStrictEqual(`"This function does not have a jsdoc2configs"`)
  })
})
