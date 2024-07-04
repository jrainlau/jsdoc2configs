# jsdoc2configs
`jsdoc2configs` 是一个用于从 JSDoc 注释生成配置文件的库。它支持自定义模板、转换函数、分隔符和注释标签。

## 功能特性
- **从 JSDoc 注释生成配置文件**：解析 JSDoc 注释，根据模板生成配置文件。

- **自定义模板**：使用自定义模板生成配置文件。

- **自定义转换函数**：使用自定义转换函数处理生成的配置内容。

- **自定义分隔符**：使用自定义分隔符替换模板中的占位符。

- **自定义注释标签**：使用自定义注释标签标记需要生成配置的代码块。

- **支持 Glob 语法**：使用 Glob 语法指定输入文件。

## 安装
```bash
bun add jsdoc2configs
```

## 使用方法
基本用法

假设我们有一个 `.ts` 文件

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

接着我们创建一个 `run.ts` 文件： 

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

生成后，我们可以从输出中看到日志：

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

## 配置选项

`jsdoc2configs(option)` 接收一个 `Jsdoc2ConfigsOptions` 对象：

```ts
interface Jsdoc2ConfigsOptions {
  inputs: string[]; // 输入文件路径，支持 Glob 语法。
  template: string; // 用于生成配置文件的模板。
  delimiter?: string; // 自定义分隔符，用于替换模板中的占位符，默认为 "{{}}"
  keyCommentTag?: string; // 自定义注释标签，用于标记需要生成配置的代码块，默认为 "jsdoc2configs"
  convertFunction?: (docContent: string) => any; // 自定义转换函数，用于处理生成的配置内容。
}

```

## 示例
完整的使用示例可以参考 [测试用例](./test/index.spec.ts)。

## 开发和构建
推荐使用 [bun](https://bun.sh/) 进行开发和测试

```bash
bun test
```

由于目前 bun 并非 100% 支持 NodeJS 的 API，所以直接使用 `bun build` 会报错，因此该项目仍然使用 Rollup 进行构建。

```bash
yarn build # rollup -c
```

## 许可证
[MIT](./LICENSE)
