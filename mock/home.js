module.exports = {
  '/mock/login': {
    status: 200,
    data: 1,
    msg: '登录成功'
  },
  '/mock/navleft': {
    status: 201,
    data: [
      { id: 1, name: '主页', href: '/home/portal', icon: 'DesktopOutlined' },
      {
        id: 2,
        name: 'demo示例',
        href: '/home/mydemo',
        icon: 'BarChartOutlined',
        children: [
          { id: 22, name: '云景', href: '/home/mydemo/yunapp' },
          { id: 23, name: '可视化', href: '/home/mydemo/visual' },
          { id: 23, name: 'Tools', href: '/home/mydemo/canvas' }
        ]
      },
      { id: 3, name: '404', href: '/home/portal2', icon: '' }
    ],
    msg: 'left menu list100100'
  }
}
