import api from '@/services/navmenu'

export default {
  namespace: 'index',
  state: {
    navLeftList: [],
    collapsed: false
  },
  effects: {
    *getNavLeft({ payload }, { put, call }) {
      try {
        const data = yield call(api.reqNavLeft)
        // 递归增加网站根目录前缀,避免生产环境中404问题
        // const traversalAddBasename = navMenus => {
        //   navMenus = navMenus.map(_ => {
        //     _.href = `${basename}${_.href}`
        //     return _
        //   })
        //   navMenus = navMenus.map(item => {
        //     if (item.children && item.children.length > 0) {
        //       item.children = traversalAddBasename(item.children)
        //     }
        //     return item
        //   })
        //   return navMenus
        // }
        yield put({ type: 'redgetNavLeft', payload: data.data })
      } catch (e) {
        console.log(e.message)
      }
    }
  },
  reducers: {
    redgetNavLeft(state, action) {
      return {
        ...state,
        navLeftList: action.payload
      }
    },
    changeCollapsed(state, action) {
      return {
        ...state,
        collapsed: action.data
      }
    }
  }
}
