import jsdoc2configs from '../index'

describe('jsdoc2configs', () => {
  test('returns', async () => {
    const configs = await jsdoc2configs({
      inputs: ['./test_folder_1/*.ts'],
      template: `{
      "desc": {{ desc }},
      "param": {{ param }},
      "returns": {{ returns }}
}`,
      convertFunction: (docContent: string) => JSON.parse(docContent),
    })

    console.log(configs)

    expect(1).toBe(1)
  })
})
