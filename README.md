## red-bridge

> 基于 react + react-router + dva + axios + antd + es6 + less 的脚手架

### 项目介绍

本项目是利用 webpack4 搭建的搭建一个基于 react + react-router + dva + axios + antd + es6 + less + eslint + prettier 用于中后台开发的脚手架,
主要是希望通过配置本项目,来对 webpack 工具有一个更加深入和全面的认识，在练习中提升自己。

### 功能实现

- [x] ES6/7
- [x] react/react-router/dva/antd
- [x] less
- [x] axios
- [x] dev-server/static resource server
- [x] 模块热替换（HMR）
- [x] sourcemap
- [x] CSS 代码分割
- [x] 代码分割(SplitChunksPlugin)
- [x] 代码压缩(terser-webpack-plugin)
- [x] 浏览器缓存
- [x] tree shaking
- [x] DellPlugin
- [x] PWA
- [x] eslint
- [x] 路由懒加载
- [x] 本地 Mock 服务
- [x] web 性能分析(webpack-bundle-analyzer)
- [x] sematic version
- [x] Flexible layout (rem)

### 快速开始

```javascript
//该项目支持使用npm|yarn|cnpm管理依赖, 推荐cnpm(速度杠杠的)
git clone 本项目路径
yarn install || npm install  // 依赖包安装
yarn dll || npm run dll   // dllplugin进行打包
yarn start || npm run start // 开发模式启动项目
yarn build || npm run build // 生产环境项目打包
yarn dev-build || npm run dev-build // 开发环境打包
```

## 代码格式化

[Eslint 代码格式 (for Vscode)](./_doc/代码格式化.md)

## Vue 代码片段

[Vue 代码片段 (for Vscode)](./_doc/代码片段.md)

## git 提交规范

[git commit 规范](./_doc/.gitmessage.txt)

## 文件换行符问题

[LR or CRLF](./_doc/文件换行符.md)
