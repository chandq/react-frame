//如果采用的webpack cli 实现HMR功能的方式，无需此自建服务。
//注意：通过express启动服务器后，devServer中的配置就不起作用了。

const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const ConnectHistoryApiFallback = require('connect-history-api-fallback')
//由于我们使用的自定义服务，WDS不生效了，那么我们可以使用connect-history-api-fallback来实现和historyApiFallback相同的功能。
const config = require('./webpack.dev.js')
const utils = require('./utils')
const chalk = require('chalk')
const { getAvailAblePort } = require('./utils')
// const open = require('open')

const compiler = webpack(config) // 编译器，编译器执行一次就会重新打包一下代码
const app = express() // 生成一个实例
// const {
//   devServer: { contentBase }
// } = config //将webpack.dev.js中的port端口和contentBase打包目录解构出来。
const contentBase = path.join(__dirname, '../dist')
const DIST_DIR = path.resolve(__dirname, '../', contentBase) // 设置静态访问文件路径
// 等同于const DIST_DIR = path.resolve(__dirname, '../dist');

let devMiddleware = webpackDevMiddleware(compiler, {
  // 使用编译器
})

let hotMiddleware = webpackHotMiddleware(compiler, {
  log: false,
  heartbeat: 2000
})

app.use(ConnectHistoryApiFallback()) //这里使用connect-history-api-fallback

app.use(devMiddleware)

app.use(hotMiddleware)
// 监听webpack生命周期内webpack-hot-middleware钩子函数(webpack通过tabable暴露很多hooks), 执行完后回调
// compiler.hooks.done.tap('webpack-hot-middleware', stats => {
//   console.log('watch webpack-hot-middleware: ', 'after**********')
//   parseMockFiles()
//   let lasthash = stats.hash
//   // 每当新一个编译完成后都会向客户端发送消息
// })

// 设置访问静态文件的路径
app.use(express.static(DIST_DIR))
const HOST = utils.getIPAdress()

let port = 8080
var done = false
getAvailAblePort(port, function cb(res) {
  port = res
  done = true
})
// 将异步函数转换为同步代码代码执行
require('deasync').loopWhile(function () {
  return !done
})

const server = app.listen(port, err => {
  //监听端口
  if (err) {
    console.error(err)
  } else {
    console.log(`==> ⏳  Please wait Webpack Task completed...`)

    // var host = server.address().address
    // var port1 = server.address().port
    // console.log('地址为 http://%s:%s', host, port1)
    compiler.hooks.done.tap('DonePlugin', () => {
      console.info(chalk.bold.yellow(`\n==> 🌍  Your application is running at: \n`))
      console.log(`- local: ${chalk.blue(`http://localhost:${port}/`)}`)
      console.log(`- network: ${chalk.blue.underline(`http://${HOST}:${port}/`)}\n`)
    })
  }
})
