const path = require('path')
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css'], // 当通过import child from './child/child'形式引入文件时，会先去寻找.js为后缀当文件，再去寻找.jsx为后缀的文件
    mainFiles: ['index', 'view'], // 如果是直接引用一个文件夹，那么回去直接找index开头的文件，如果不存在再去找view开头的文件
    alias: {
      // 配置别名可以加快webpack查找模块的速度
      '@': path.resolve(__dirname, '../src')
    }
  },
  target: ['web', 'es2020'],
  module: {
    //加载模块规则,让 webpack 能够去处理那些非 JavaScript 文件,当然也能处理js文件
    /**我们在 webpack 中定义的一个个 loader，本质上只是一个函数，在定义 loader 同时还会定义一个 test 属性，
     * webpack 会遍历所有的模块名，当匹配 test 属性定义的正则时，会将这个模块作为 source 参数传入 loader 中执行，
     * webpack loader的执行顺序是从右到左，即从后向前执行。 */
    rules: [
      {
        /**js的配置 */
        test: /\.(js|jsx)$/, // 注意这里要写正确，不然useBuiltIns不起作用,useBuiltIns被抽离在.babelrc文件
        include: path.resolve(__dirname, '../src'), // 表示只解析以下目录，减少loader处理范围
        exclude: /node_modules/, // 排除node_modules中的代码module: {
        use: [
          {
            loader: 'babel-loader', // 只是babel和webpack之间的桥梁，并不会将代码转译
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        /**图标和图片的处理的配置 */
        test: /\.(png|jpe?g|svg|gif|webp)$/i,
        include: path.resolve(__dirname, '../src'), // 表示只解析以下目录，减少loader处理范围
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]', // placeholder 占位符
              outputPath: 'assets/', // 打包文件名
              limit: 1024 * 5, // 小于5KB则打包到js文件里，大于则使用file-loader的打包方式打包到assets里
              esModule: false // 支持img标签使用require动态指定图片
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      /**字体的处理的配置 */
      {
        test: /\.(eot|woff2?|ttf|otf)$/,
        include: path.resolve(__dirname, '../src'), // 表示只解析以下目录，减少loader处理范围
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:8].min.[ext]', // 和上面同理
            outputPath: 'fonts/',
            limit: 5000
          }
        }
      }
    ]
  },
  output: {
    publicPath: process.env.PUBLIC_URL,
    filename: 'static/js/[name]-[contenthash:8].js', //打包后输出的文件名称 //entry对应的key值
    chunkFilename: 'static/js/[name]-[contenthash:8].js', // 间接引用的文件会走这个配置
    path: path.resolve(__dirname, '../dist')
  }
}
