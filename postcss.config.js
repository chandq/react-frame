module.exports = {
  // 自动添加css厂商前缀
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'chrome >= 5',
        'ie >= 9',
        'firefox >= 5',
        'opera >= 10',
        'safari >= 5'
      ]
    }),
    require('postcss-px2rem-exclude')({
      remUnit: 100, // 基准大小 baseSize，需要和setrem.js中相同
      remPrecision: 3, // rem的小数点后位数
      exclude: /node_modules/i
    })
  ]
  // 下面设置方式与上面等效
  // plugins: {
  //   "autoprefixer":{
  //   overrideBrowserslist: ['last 2 versions', '> 1%', 'chrome >= 5', 'ie >= 8', 'firefox >= 5', 'opera >= 10']
  // },
  //   "postcss-px2rem-exclude": {
  //     remUnit: 100, // 100px = 1rem
  //     remPrecision: 2 // rem的小数点后位数
  //   }
  // }
}
