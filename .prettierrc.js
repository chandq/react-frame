/**
 * https://prettier.io/docs/en/options.html：请确保先执行了 npm i -D prettier
 * 项目代码风格优先级
 * 1. .perttierc.js (统一项目风格)
 * 2. .editorconfig (统一IDE风格)
 * 3. vscode中的设置
 */
module.exports = {
  trailingComma: 'none', // 多行时尽可能打印尾随逗号。默认 none-没有尾随逗号。可选：es5：在ES5中有效的尾随逗号（对象、数组等）。例如本文件，设置成 es5，就算你最后一个属性-属性值没有加逗号，也会帮你自动加上逗号
  arrowParens: 'avoid', // 在单个箭头函数参数周围加上括号。默认 avoid-尽可能的省略parens。例 x => x。可选 "always"-使用包括parens。例 (x) => x
  // es6: true,
  tabWidth: 2, // 个缩进级别的空格数。默认 2
  semi: false, // 在语句末尾打印分号。默认 true
  singleQuote: true, // 使用单引号而不是双引号。默认 false
  printWidth: 120 // 指定打印机将换行的行长度。默认 80
}
