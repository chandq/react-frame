import { lazy } from 'react'
import Page404 from '../pages/404'
import Login from '../layout/Login'
// const Home = lazy(() => import(/* webpackChunkName: "home-vendor" */ '../layout/Index'))
// import Yunapp from '../pages/Mydemo/Yunapp'
// import Visual from '../pages/Mydemo/Visual'
// import Canvas from '../pages/Mydemo/Canvas'
import Portal from '../layout/Index'
import Homepage from '../pages/Home'

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/home/portal'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/404',
    name: '404',
    component: Page404
  },
  {
    path: '/home',
    name: 'home',
    layout: Portal,
    children: [
      {
        path: '/home/portal',
        name: 'portal',
        component: Homepage
      },
      {
        path: '/home/mydemo/yunapp',
        name: 'yunapp',
        component: lazy(() => import('../pages/Mydemo/Yunapp'))
        // component: Yunapp
      },
      {
        path: '/home/mydemo/visual',
        name: 'visual',
        component: lazy(() => import('../pages/Mydemo/Visual'))
        // component: Visual
      },
      {
        path: '/home/mydemo/canvas',
        name: 'canvas',
        component: lazy(() => import('../pages/Mydemo/Canvas'))
        // component: Canvas
      }
    ]
  }
]
let routesMap = new Map()
const getRoutesMapFromConfig = routes => {
  routes.forEach(_ => {
    routesMap.set(_.path, _.name)
    if (_.children) {
      getRoutesMapFromConfig(_.children)
    }
  })
}
getRoutesMapFromConfig(routes)
export const getRoutesMap = routesMap
export default routes
