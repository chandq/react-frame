import React, { Component } from 'react'
import { connect } from 'dva'
import { UserOutlined, VideoCameraOutlined, DesktopOutlined, BarChartOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { routerRedux, withRouter, Link } from 'dva/router' //dva的routerRedux实现路由跳转需通过dispatch触发
//如果要使用this.props.history.push(),引入withRouter高阶函数即可。import {withRouter} from 'dva/router';
//如果要是有Link标签实现声明式跳转，引入Link组件即可。import {Link} from 'dva/router';

import './index.less'

const { SubMenu } = Menu
//const data = menuDate.menuDate//正常情况应该通过props把列表数据传递过来
@connect()
class NavLeft extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openedKey: [], //刷新页面SubMenu状态保留数组
      selectedKeys: []
    }
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps.props)) {
      if (!nextProps.siderCollapse) {
        this.selectedRouterMenu(nextProps.location)
      }
    }
  }
  componentDidMount() {
    // 监听路由的变化,如果路由发生变化则进行相应操作
    this.props.history.listen(router => {
      // 最新路由的 location 对象，可以通过比较 pathname 是否相同来判断路由的变化情况
      let location = router.location ? router.location : router
      if (this.props.location.pathname !== location.pathname) {
        // 路由发生了变化
        this.selectedRouterMenu(location)
        return
      }
      this.selectedRouterMenu(this.props.location)
    })
  }
  selectedRouterMenu(location) {
    const isDev = process.env.NODE_ENV === 'development'
    const pathnameArr = isDev ? location.pathname.split('/') : location.pathname.slice(basename.length).split('/')
    if (pathnameArr.length === 4) {
      this.setState({
        openedKey: [pathnameArr[2]],
        selectedKeys: pathnameArr[3]
      })
    } else if (pathnameArr.length === 3) {
      this.setState({
        selectedKeys: pathnameArr[2]
      })
    }
  }

  jump(path, keyPath) {
    //路由跳转
    this.props.dispatch(routerRedux.push((basename + path).replace('//', '/'))) //跳转路由，下方是点击收起其他SubMenu逻辑
  }
  handleClick(e) {
    if (e.key === this.state.selectedKeys) {
      return void 0
    }
    // 解决点击不含子菜单时无法跳转页面的问题
    if (e.keyPath.length === 1) {
      this.props.dispatch(routerRedux.push({ name: e.key }))
    }
    this.setState({ selectedKeys: e.key })
  }
  subChange(openKeys) {
    this.setState({ openedKey: openKeys })
  }

  getIcon(name) {
    const icons = {
      BarChartOutlined: <BarChartOutlined />,
      DesktopOutlined: <DesktopOutlined />
    }
    return icons[name]
  }

  getRoutePath = path => (basename + path).replace('//', '/')

  renderMenu(data) {
    if (data.length) {
      return data.map(item => {
        if (item.children) {
          return (
            <SubMenu
              key={item.href?.split('/')[2]}
              title={
                <span>
                  {item.icon ? this.getIcon(item.icon) : <VideoCameraOutlined />}
                  <span>{item.name}</span>
                </span>
              }
            >
              {item.children.map(it => (
                <Menu.Item
                  key={it.href && it.href.split('/')[3] ? it.href.split('/')[3].split('?')[0] : it.href}
                  // onClick={keyPath => this.jump(it.href, keyPath)}
                >
                  <span>
                    <Link to={this.getRoutePath(it.href)}>{it.name}</Link>
                  </span>
                </Menu.Item>
              ))}
            </SubMenu>
          )
        } else {
          return (
            <Menu.Item
              key={item.href && item.href.split('/')[2] ? item.href.split('/')[2].split('?')[0] : item.href}
              // onClick={keyPath => this.jump(item.href, keyPath)}
            >
              {item.icon ? this.getIcon(item.icon) : <VideoCameraOutlined />}
              <span>
                <Link to={this.getRoutePath(item.href)}>{item.name}</Link>
              </span>
            </Menu.Item>
          )
        }
      })
    }
  }
  render() {
    const { selectedKeys, openedKey } = this.state
    return (
      <>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKeys]}
          selectedKeys={[selectedKeys]}
          defaultOpenKeys={[...openedKey]}
          openKeys={[...openedKey]}
          onClick={this.handleClick.bind(this)}
          onOpenChange={this.subChange.bind(this)}
        >
          {this.renderMenu(this.props.navLeftList)}
        </Menu>
      </>
    )
  }
}
export default withRouter(NavLeft)
