module.exports = {
  root: true, // "root": true 配置项表示代码规范的校验范围，停止向上查找
  env: {
    es6: true,
    amd: true,
    browser: true,
    commonjs: true,
    node: true
  },
  extends: ['eslint:recommended'],
  rules: {
    'space-before-function-paren': 0,
    'no-async-promise-executor': 0,
    indent: 'off',
    'no-useless-escape': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prefer-destructuring': [
      'error',
      {
        object: true,
        array: false
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    // 'brace-style': ['error', 'stroustrup'],
    'object-curly-spacing': 'off',
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    'comma-dangle': ['error', 'never'],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx']
      }
    ],
    'react/require-default-props': 'off',
    'react/forbid-prop-types': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-unused-vars': 'off',
    'line-comment-position': 'off',
    'no-extra-semi': 'off'
  },
  parser: 'babel-eslint', // parser指定解析器，默认的为espree。babel-eslint是一个Babel parser的包装器，这个包装器使得 Babel parser 可以和 ESLint 协调工作
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
