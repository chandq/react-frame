const os = require('os')
///获取本机ip
function getIPAdress() {
  var interfaces = os.networkInterfaces()
  let ips = []
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        ips.push(alias.address)
      }
    }
  }
  return ips
}
module.exports = { getIPAdress }
