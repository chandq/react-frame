module.exports = {
  root: true, // "root": true 配置项表示代码规范的校验范围，停止向上查找
  env: {
    es6: true,
    amd: true,
    browser: true,
    commonjs: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'react-app'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'warn'
  },
  parser: '@babel/eslint-parser', // parser指定解析器，默认的为espree。babel-eslint是一个Babel parser的包装器，这个包装器使得 Babel parser 可以和 ESLint 协调工作
  parserOptions: {
    sourceType: 'module', // 设置为 "script" (默认) 或 "module"（ES6)。
    ecmaFeatures: {
      // 这是个对象，表示你想使用的额外的语言特性:
      jsx: true // 启用 JSX
    }
  },
  globals: {
    cdq: false,
    basename: false,
    log: false,
    error: false,
    globalThis: false
  },
  plugins: ['react']
}
