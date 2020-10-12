import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { routerRedux, Route, Switch, Redirect } from 'dva/router'
import { Spin } from 'antd'
import Page404 from '../pages/404'
import Login from '../layout/Login'
const Home = lazy(() => import(/* webpackChunkName: "home-vendor" */ '../layout/Index'))
import Homepage from '../pages/Home'
import Yunapp from '../pages/Mydemo/Yunapp'
import Visual from '../pages/Mydemo/Visual'

const { ConnectedRouter } = routerRedux
// dva路由在生产环境中必须匹配网站根目录前缀,否则会出现404问题
const getRoutePath = path => {
  return process.env.NODE_ENV === 'development' ? path : `${process.env.PUBLIC_URL}${path}`.replace('//', '/')
}
//Suspense 组件为路由组件未加载成功之前做的操作，lazy()方法为路由懒加载
export default function Router({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Suspense fallback={<Spin size="large" style={{ position: 'fixed', top: '50%', left: '50%' }} />}>
        <Switch>
          <Route exact path={getRoutePath('/')} component={Login} />
          <Route key={'login'} path={getRoutePath('/login')} exact component={Login} />
          <Route
            key={'home'}
            path={getRoutePath('/home')}
            render={() => {
              //路由插槽，Home组件通过this.props.children来接收路由匹配过来的组件
              return (
                <Home>
                  <Route key={'portal'} exact path={getRoutePath('/home/portal')} component={Homepage} />
                  <Route key={'yunapp'} exact path={getRoutePath('/home/mydemo/yunapp')} component={Yunapp} />
                  <Route key={'visual'} exact path={getRoutePath('/home/mydemo/visual')} component={Visual} />
                </Home>
              )
            }}
          />
          <Route exact path={getRoutePath('/404')} component={Page404} />
          <Redirect from={getRoutePath('/')} to={getRoutePath('/404')}></Redirect>
        </Switch>
      </Suspense>
    </ConnectedRouter>
  )
}

Router.propTypes = {
  //利用propTypes对props进行校验
  history: PropTypes.object
}
/**关于prop-types
 * propTypes能用来检测全部数据类型的变量，包括基本类型的的字符串，布尔值，数字，以及引用类型的对象，数组，函数，甚至还有ES6新增的符号类型
 * 例子：
  Son.propTypes = {
      optionalArray: PropTypes.array,//检测数组类型
      optionalBool: PropTypes.bool,//检测布尔类型
      optionalFunc: PropTypes.func,//检测函数（Function类型）
      optionalNumber: PropTypes.number,//检测数字
      optionalObject: PropTypes.object,//检测对象
      optionalString: PropTypes.string,//检测字符串
      optionalSymbol: PropTypes.symbol,//ES6新增的symbol类型
  }
 */
