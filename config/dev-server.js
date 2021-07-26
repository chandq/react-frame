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
// const open = require('open')

const complier = webpack(config) // 编译器，编译器执行一次就会重新打包一下代码
const app = express() // 生成一个实例
const {
  devServer: { port, contentBase }
} = config //将webpack.dev.js中的port端口和contentBase打包目录解构出来。
const DIST_DIR = path.resolve(__dirname, '../', contentBase) // 设置静态访问文件路径
// 等同于const DIST_DIR = path.resolve(__dirname, '../dist');

let devMiddleware = webpackDevMiddleware(complier, {
  // 使用编译器
  quiet: true, //向控制台显示任何内容
  noInfo: true
})

let hotMiddleware = webpackHotMiddleware(complier, {
  log: false,
  heartbeat: 2000
})

app.use(ConnectHistoryApiFallback()) //这里使用connect-history-api-fallback

app.use(devMiddleware)

app.use(hotMiddleware)
// 监听webpack生命周期内webpack-hot-middleware钩子函数(webpack通过tabable暴露很多hooks), 执行完后回调
// complier.hooks.done.tap('webpack-hot-middleware', stats => {
//   console.log('watch webpack-hot-middleware: ', 'after**********')
//   parseMockFiles()
//   let lasthash = stats.hash
//   // 每当新一个编译完成后都会向客户端发送消息
// })

// 设置访问静态文件的路径
app.use(express.static(DIST_DIR))
const HOST = utils.getIPAdress()

app.listen(port, err => {
  //监听端口
  if (err) {
    console.error(err)
  } else {
    console.log(`==> ⏳  Please wait Webpack Task completed...`)
    complier.hooks.done.tap('DonePlugin', () => {
      console.info(chalk.bold.yellow(`\n==> 🌍  Your application is running at: \n`))
      console.log(`- local: ${chalk.blue(`http://localhost:${port}/`)}`)
      HOST.forEach(h => {
        console.log(`- network: ${chalk.blue.underline(`http://${h}:${port}/`)}`)
      })
      console.log('\n')
    })
  }
})
