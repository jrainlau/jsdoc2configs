# jsdoc2configs
[中文文档](./README.zh.md)

`jsdoc2configs` is a library for generating configuration files from JSDoc comments. It supports custom templates, conversion functions, delimiters, and comment tags.

## Features
- **Generate configuration files from JSDoc comments**: Parse JSDoc comments to generate configuration files based on a template.

- **Custom templates**: Use custom templates to generate configuration files.

- **Custom conversion functions**: Use custom conversion functions to process the generated configuration content.

- **Custom delimiters**: Use custom delimiters to replace placeholders in the template.

- **Custom comment tags**: Use custom comment tags to mark code blocks that need to generate configurations.

- **Glob syntax support**: Use Glob syntax to specify input files.

## Installation
```bash
bun add jsdoc2configs
```

## Usage
Basic Usage

Let's say we have a `.ts` file:

```ts
/**
 * @jsdoc2configs
 * 
 * @desc Sum of two numbers.
 * @export
 * @param {number} a - Number of one.
 * @param {number} b - Number of another.
 * @returns {number} a + b
 */
export function sum(a: number, b: number) {
   return a + b
}
```

then we create a `run.ts` file: 

```ts
import jsdoc2configs from 'jsdoc2configs'

jsdoc2configs({
  inputs: ['path/to/your/file.ts'],
  template: `{
    "desc": {{ desc }},
    "param": {{ param }},
    "returns": {{ returns }}
  }`,
  convertFunction: (docContent) => JSON.parse(docContent),
})
  .then(console.log)
```

after generating, we could see the log from output:

```bash
[
  {
    desc: "Sum of two numbers.",
    param: [
      {
        type: "{number}",
        comment: "- Number of one.",
        paramName: "a",
        optional: false,
      }, {
        type: "{number}",
        comment: "- Number of another.",
        paramName: "b",
        optional: false,
      }
    ],
    returns: {
      type: "{number}",
      comment: "a + b",
    },
  }, {
    desc: "Diff of two numbers.",
    param: [
      {
        type: "{number}",
        comment: "- Number of one.",
        paramName: "a",
        optional: false,
      }, {
        type: "{number}",
        comment: "- Number of another.",
        paramName: "b",
        optional: false,
      }
    ],
    returns: {
      type: "{number}",
      comment: "a - b",
    },
  }
]
```

## Configurations

`jsdoc2configs(option)` receives a `Jsdoc2ConfigsOptions` object:

```ts
interface Jsdoc2ConfigsOptions {
  inputs: string[]; // Input file paths, supports Glob syntax.
  template: string; // Template for generating configuration files.
  delimiter?: string; // Custom delimiter to replace placeholders in the template, default to "{{}}"
  keyCommentTag?: string; // Custom comment tag to mark code blocks that need to generate configurations, default to "jsdoc2configs"
  convertFunction?: (docContent: string) => any; // Custom conversion function to process the generated configuration content.
}

```

## Examples
Full usage examples could be refereed to [UNIT TEST](./test/index.spec.ts).

## Development and Build
It is recommended to use [bun](https://bun.sh/) for development and testing.

```bash
bun test
```

Since bun does not currently support 100% of NodeJS APIs, using bun build directly will result in errors. Therefore, this project still uses Rollup for building.

```bash
yarn build # rollup -c
```

## License
[MIT](./LICENSE)
