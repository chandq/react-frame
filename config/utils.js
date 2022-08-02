const os = require('os')
///获取本机ip
function getIPAdress() {
  var interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

const net = require('net')

// 检测端口是否被占用
function portIsOccupied(port) {
  return new Promise((resolve, reject) => {
    // 创建服务并监听该端口
    const server = net.createServer().listen(port)
    server.on('listening', function () {
      // 执行这块代码说明端口未被占用
      server.close()
      // 关闭服务
      console.log('The port【' + port + '】 is available.') // 控制台输出信息
      resolve(false)
    })

    server.on('error', function (err) {
      if (err.code === 'EADDRINUSE') {
        // 端口已经被使用
        server.close()
        // 关闭服务
        console.log('The port【' + port + '】 is occupied, please change other port.')
        resolve(err)
      }
    })
  })
}

// 获取可用的web服务端口号
async function getAvailAblePort(port = 8080, portAvailableCallback) {
  let res = await portIsOccupied(port)
  if (res instanceof Error) {
    // console.log(`端口：${port}被占用\n`)
    port++
    await getAvailAblePort(port, portAvailableCallback)
  } else {
    portAvailableCallback(port)
  }
}
module.exports = { getIPAdress, portIsOccupied, getAvailAblePort }
