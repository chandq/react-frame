var nodemon = require('nodemon') //引入nodemon模块

/**
 * script 重启的脚本
 * ext 检测的文件
 */
nodemon({
  script: './server/mockServer.js',
  watch: ['mock'],
  ext: 'js'
})

nodemon
  .on('start', function () {
    console.log('mockServer has started')
  })
  .on('quit', function () {
    console.log('mockServer has quit')
    process.exit()
  })
  .on('restart', function (files) {
    console.log('mockServer restarted due to: ', files)
  })
