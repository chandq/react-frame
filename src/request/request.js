/*
 * @created: Tuesday, 2019-10-15 13:27:51
 * @author: chendq
 * ---------
 * @desc 请求发送拦截器
 */

const requestSuccess = config => {
  // config.baseURL = domainConfig['DOMAIN'] && 'http://aso-web2b.psa-dev.supaur.tech'
  if (config.xhrHeaders) {
    // 传'X-Requested-With': 'XMLHttpRequest'的header信息，仅用于帮助后端识别前端发出的请求为ajax请求
    config.headers = Object.assign({}, config.headers, config.xhrHeaders)
  }
  const token = sessionStorage.getItem('token') // 仅对接call-center会用token,其他场景用cookie
  if (token) {
    config.params = Object.assign(config.params || {}, {
      access_token: token
    })
  }
  !config.params && (config.params = {})
  // url查询参数追加时间戳，解决IE11下无法获取用户信息的兼容性问题（很诡异）
  // config.params.timestamp = Date.now()

  return config
}

export default requestSuccess
