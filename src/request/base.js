const isDev = process.env.NODE_ENV === 'development' //判断当前是什么环境

const baseUrl = isDev ? 'http://localhost:8090/mock' : 'http://172.96.219.170:8090/mock'

export default baseUrl
