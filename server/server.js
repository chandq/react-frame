/**
 * @desc 前端静态资源服务服务器
 * @author chendq
 * @date 2019-11-19
 * */
const env = require('../config/process.env.config')
const Express = require('express')
const path = require('path')
const utils = require('../config/utils')
const chalk = require('chalk')

const app = new Express()
const PORT = 9000
const HOST = utils.getIPAdress()
app.use(env.publicPath, Express.static(path.join(__dirname, '../dist'))) // 将dist目录下所有文件作为静态文件来管理
app.get('/domain', (req, res, next) => {
  res.sendFile(`${path.resolve(__dirname, '..')}/dist/domain.json`)
})
app.get('*', (req, res) => {
  res.sendFile(`${path.resolve(__dirname, '..')}/dist/index.html`)
})

app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`==> ⏳  Please wait Webpack Task completed...`)
    console.info(chalk.yellow(`\n==> 🌍  Your application is running at: \n`))
    console.log(`- local: ${chalk.blue(`http://localhost:${PORT}/`)}`)
    HOST.forEach(h => {
      console.log(`- network: ${chalk.blue.underline(`http://${h}:${PORT}/`)}`)
    })
    console.log('\n')
  }
})
