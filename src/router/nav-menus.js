/*
 * @Description:
 * @Date: 2022-09-05 20:31:14
 * @LastEditors: chendq
 * @LastEditTime: 2022-09-09 17:01:52
 * @Author      : chendq
 */
export default [
  { id: 0, name: '主页', href: '/home/portal', icon: 'DesktopOutlined' },
  {
    id: 2,
    name: 'demo示例',
    href: '/home/mydemo',
    icon: 'BarChartOutlined',
    children: [{ id: 22, name: 'test1', href: '/home/mydemo/test1' }]
  }
]
