import dva from 'dva'
import { createBrowserHistory } from 'history' //使用history路由模式
import '@/utils/config'
import '@/styles/index.css'
import '@/utils/setrem'

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

if (module.hot) {
  module.hot.accept()
}
