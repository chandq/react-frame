import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { routerRedux, Route, Switch, Redirect } from 'dva/router'
import { Spin } from 'antd'
import routes from './routes'
const { ConnectedRouter } = routerRedux
// dva路由在生产环境中必须匹配网站根目录前缀,否则会出现404问题
const getRoutePath = path => {
  return process.env.NODE_ENV === 'development' ? path : `${process.env.PUBLIC_URL}${path}`.replace('//', '/')
}

// 组件必须大驼峰命名,否则无法正常渲染
const parseRoutes = (routesConfig, app) => {
  const config = routesConfig.map(
    ({ path, name, layout: Layout, redirect, children, component: Component, ...dynamics }) => {
      // const Component = typeof dynamics.component === 'function' ? dynamic({ app, ...dynamics }) : dynamics.component
      return redirect ? (
        <Redirect exact from={getRoutePath(path)} to={getRoutePath(redirect)}></Redirect>
      ) : (
        <Route
          path={getRoutePath(path)}
          key={name}
          exact={!children}
          render={props => {
            if (Layout) {
              if (children) {
                return (
                  <Layout>
                    <Suspense fallback={<Spin size="large" style={{ position: 'fixed', top: '50%', left: '50%' }} />}>
                      {parseRoutes(children, app)}
                    </Suspense>
                  </Layout>
                )
              } else {
                return (
                  <Layout>
                    <Component {...props} />
                  </Layout>
                )
              }
            } else {
              if (children) {
                return <div>{parseRoutes(children, app)}</div>
              }
              return <Component {...props} />
            }
          }}
        />
      )
    }
  )
  return config
}
//Suspense 组件为路由组件未加载成功之前做的操作，lazy()方法为路由懒加载
export default function RouterConfig({ history, app }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        {parseRoutes(routes, app)}
        <Redirect to={getRoutePath('/404')}></Redirect>
      </Switch>
    </ConnectedRouter>
  )
}

RouterConfig.propTypes = {
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
