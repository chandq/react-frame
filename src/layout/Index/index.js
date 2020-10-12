import React, { Component } from 'react'
import { connect } from 'dva'
import Icon, { LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import { withRouter, routerRedux } from 'dva/router'
import NavLeft from '../../components/NavLeft'
// import Userbar from '../../components/Userbar';
import './index.less'
import ErrorBoundary from '@/components/errorBoundary/ErrorBoundary'
import { getRoutesMap } from '@/router/routes'
import cavasVM from '@/utils/watermark'

const { Header, Sider, Content } = Layout

@connect(state => ({
  index: state.index,
  login: state.login
}))
class Home extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    //请求左侧导航数据
    this.props.dispatch({ type: 'index/getNavLeft' })

    // 监听dva路由的变化,如果路由发生变化则进行相应操作
    this.props.history.listen(router => {
      // console.log('route listen: ', router, getRoutesMap)
      // 最新路由的 location 对象，可以通过比较 pathname 是否相同来判断路由的变化情况
      let location = router.location ? router.location : router
      // 若未匹配到正确的路由路径,则重定向404页面
      if (this.props.location.pathname !== location.pathname) {
        // 路由发生了变化
        if (!getRoutesMap.get(location.pathname.replace(basename, ''))) {
          this.props.dispatch(routerRedux.push(`${basename}/404`))
          return
        }
      }

      if (!getRoutesMap.get(location.pathname.replace(basename, ''))) {
        this.props.dispatch(routerRedux.push(`${basename}/404`))
        return
      }
    })
    cavasVM({ content: '似水年华', width: '280px', height: '150px', zIndex: 1000, rotate: -30 })
  }
  toggle = () => {
    this.props.dispatch({ type: 'index/changeCollapsed', data: !this.props.index.collapsed })
  }
  render() {
    const { index } = this.props
    const { collapsed } = index
    return (
      <Layout className="home-layout">
        <Sider
          //去掉trigger显示下方trigger
          trigger={null}
          collapsible
          breakpoint="lg"
          collapsibleWidth={80}
          onBreakpoint={broken => {
            this.props.dispatch({ type: 'index/changeCollapsed', data: broken })
          }}
          // onCollapse={this.toggle}
          collapsed={collapsed}
          width={256}
        >
          <div className="logo" style={{ textAlign: collapsed ? 'center' : 'inherit', transition: '0.5s' }}>
            <a>
              <PandaIcon style={{ fontSize: '22px', verticalAlign: 'middle' }} />
              <h1 style={collapsed ? { opacity: '0', transition: '0s' } : { opacity: '1', transition: '0.5s' }}>
                React Webpack Dva
              </h1>
            </a>
          </div>
          <NavLeft
            navLeftList={this.props.index.navLeftList}
            nowhistory={this.props.location}
            siderCollapse={collapsed}
          ></NavLeft>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            {/* <LegacyIcon
              className="trigger"
              style={{ fontSize: '20px', marginLeft: '20px' }}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            /> */}
            {collapsed ? (
              <MenuUnfoldOutlined className="ignore-trigger" onClick={this.toggle} />
            ) : (
              <MenuFoldOutlined onClick={this.toggle} className="ignore-trigger" />
            )}
            <div className="headerinfo">
              <LogoutOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.props.history.push(`${basename}/login`)
                  // this.props.dispatch(routerRedux.push(`${basename}/login`))
                }}
              />
              {/* <Userbar userbar={JSON.parse(localStorage.getItem('userinfo'))}/> */}
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280
            }}
          >
            <ErrorBoundary>{this.props.children}</ErrorBoundary>
          </Content>
        </Layout>
      </Layout>
    )
  }
}
const PandaSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path
      d="M99.096 315.634s-82.58-64.032-82.58-132.13c0-66.064 33.032-165.162 148.646-148.646 83.37 11.91 99.096 165.162 99.096 165.162l-165.162 115.614zM924.906 315.634s82.58-64.032 82.58-132.13c0-66.064-33.032-165.162-148.646-148.646-83.37 11.91-99.096 165.162-99.096 165.162l165.162 115.614z"
      fill="#6B676E"
      p-id="1143"
    />
    <path
      d="M1024 561.548c0 264.526-229.23 429.42-512.002 429.42S0 826.076 0 561.548 283.96 66.064 512.002 66.064 1024 297.022 1024 561.548z"
      fill="#FFEBD2"
      p-id="1144"
    />
    <path
      d="M330.324 842.126c0 82.096 81.34 148.646 181.678 148.646s181.678-66.55 181.678-148.646H330.324z"
      fill="#E9D7C3"
      p-id="1145"
    />
    <path
      d="M644.13 611.098C594.582 528.516 561.55 512 512.002 512c-49.548 0-82.58 16.516-132.13 99.096-42.488 70.814-78.73 211.264-49.548 247.742 66.064 82.58 165.162 33.032 181.678 33.032 16.516 0 115.614 49.548 181.678-33.032 29.18-36.476-7.064-176.93-49.55-247.74z"
      fill="#FFFFFF"
      p-id="1146"
    />
    <path
      d="M611.098 495.484c0-45.608 36.974-82.58 82.58-82.58 49.548 0 198.194 99.098 198.194 165.162s-79.934 144.904-148.646 99.096c-49.548-33.032-132.128-148.646-132.128-181.678zM412.904 495.484c0-45.608-36.974-82.58-82.58-82.58-49.548 0-198.194 99.098-198.194 165.162s79.934 144.904 148.646 99.096c49.548-33.032 132.128-148.646 132.128-181.678z"
      fill="#6B676E"
      p-id="1147"
    />
    <path
      d="M512.002 726.622c-30.06 0-115.614 5.668-115.614 33.032 0 49.638 105.484 85.24 115.614 82.58 10.128 2.66 115.614-32.944 115.614-82.58-0.002-27.366-85.556-33.032-115.614-33.032z"
      fill="#464655"
      p-id="1148"
    />
    <path
      d="M330.324 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z"
      fill="#464655"
      p-id="1149"
    />
    <path
      d="M693.678 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z"
      fill="#464655"
      p-id="1150"
    />
  </svg>
)
const PandaIcon = props => <Icon component={PandaSvg} {...props} />
export default withRouter(Home)
