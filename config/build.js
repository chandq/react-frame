/*
 * @Description:
 * @Date: 2022-08-02 10:03:35
 * @LastEditors: chendq
 * @LastEditTime: 2022-08-02 11:32:00
 * @Author      : chendq
 */
/**
 * @author chendq
 * @description production模式构建，并生成包含构建信息的JSON文件
 */
const path = require('path')
const fs = require('fs')
const shelljs = require('shelljs')
const chalk = require('chalk')
let context = {
  startTime: new Date(),
  endTime: '',
  projTag: '',
  projName: '',
  projVersion: '',
  nodeVersion: process.versions.node,
  npmVersion: shelljs.exec('npm --version', { silent: true }).trim()
}

const pkgFile = path.resolve('package.json')
const { name, version } = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'))
context.projName = name
context.projVersion = version
shelljs.exec('webpack --progress --config ./config/webpack.pro.js')
console.info(chalk.bold.yellow(`\n==> Finish all modules build: \n`))
context.endTime = new Date()
const builtFileString = JSON.stringify(context, null, 4)
const distDir = path.resolve('dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}
const buildFilePath = path.resolve('dist', '_build.json')
fs.writeFileSync(buildFilePath, builtFileString)
console.info(`生成构建信息文件 dist/_build.json`, builtFileString)
