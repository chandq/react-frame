import dva from 'dva'
import { createBrowserHistory } from 'history' //使用history路由模式
// import qhistory from 'qhistory'
import '@/utils/config'
import { stringify, parse } from 'qs' //qs是npm仓库所管理的包,qs.stringify()作用是将对象或者数组序列化成URL的格式。
//具体参照https://www.jianshu.com/p/7e64878fb210
import '@/styles/index.css'
import '@/utils/setrem'

console.log(
  'process.env.PUBLIC_URL: ',
  window,
  process.env.NODE_ENV,
  process.env.PUBLIC_URL,
  window.cdq.dataType(process.env.NODE_ENV),
  window.cdq.dataType(process.env.PUBLIC_URL)
)
//1.Initialize
const app = dva({
  history: createBrowserHistory(),
  onStateChange: (...arg) => {
    // console.log('onStateChange', arg)
  }
})

//app.use();

//2.Model
/**component model 如果有*/

/**page model */
app.model(require('./layout/Login/model').default)
app.model(require('./layout/Index/model').default)

//3.Router
app.router(require('./router/index').default)

//4.Start
app.start('#root')
