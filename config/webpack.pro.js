//强调：初次运行项目，需要首先yarn dll剥离出dll文件，为了在整个开发周期中提高打包速度，推荐隔段时间就yarn dll 剥离第三方库dll。
const { merge } = require('webpack-merge')
const webpackConfigBase = require('./webpack.base')
const env = require('./process.env.config')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 向dist文件中自动添加模版html,不生成dist目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 打包后先清除dist文件，先于HtmlWebpackPlugin运行
//但是这个插件目前还不支持HMR,为了不影响开发效率，因此就在生成环境下使用该插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //这个插件可以帮助我们把相同的样式合并。
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin') //将打包生产的dll.js文件自动引入html
const fs = require('fs') //fs文件读取
const WorkboxPlugin = require('workbox-webpack-plugin') //PWA全称progressive Web Application,PWA实现的功能是即便服务器挂掉，还是可以通过在本地的缓存来访问到页面。
//运行命令打包后会多出两个文件precache-manifest.js和service-worker.js, service-worker这个文件就可以让我们的页面被缓存住
//关于PWA介绍https://lavas.baidu.com/pwa/README
const WebpackBar = require('webpackbar') // webpack打包进度条
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //想要分开打包我们的css文件，需要使用mini-css-extract-plugin这个插件，
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
process.env.PUBLIC_URL = env.publicPath

let plugins = [
  new CleanWebpackPlugin(), // 打包后先清除dist文件，先于HtmlWebpackPlugin运行
  //插件
  new HtmlWebpackPlugin({
    // 向dist文件中自动添加模版html,不生成dist目录
    template: 'public/index.html',
    favicon: 'public/favicon.ico'
  }),
  new MiniCssExtractPlugin({
    filename: 'static/css/[name].css',
    chunkFilename: 'static/css/[name].chunk.css'
  }),
  new PreloadWebpackPlugin({
    rel: 'preload',
    as(entry) {
      if (/\.css$/.test(entry)) return 'style'
      if (/\.woff$/.test(entry)) return 'font'
      if (/\.png$/.test(entry)) return 'image'
      return 'script'
    },
    include: ['react', 'main']
  }),
  new PreloadWebpackPlugin({
    rel: 'prefetch',
    include: 'asyncChunks',
    // include: 'allChunks',
    // fileBlacklist: ["index.css"]
    fileBlacklist: [/index.css|index.js/, /main.*/, /react/]
  }),
  new webpack.DefinePlugin({
    'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL)
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.join(__dirname, '../mock'),
        to: path.join(__dirname, '../dist/mock')
      },
      {
        from: path.join(__dirname, '../server/mockServer.js'),
        to: path.join(__dirname, '../dist/server')
      }
    ]
  }),
  //为了解决浏览器文件缓存问题，例如：代码更新后，文件名称未改变，浏览器非强制刷新后，浏览器去请求文件时认为文件名称未改变而直接从缓存中读取不去重新请求。
  //我们可以在webpack.production.js输出文件名称中添加hash值.
  new WorkboxPlugin.GenerateSW({
    //PWA优化
    clientsClaim: true,
    skipWaiting: true
  }),
  new WebpackBar() // webpack打包进度条
]

const files = fs.readdirSync(path.resolve(__dirname, '../dll'))

files.forEach(file => {
  if (/.*\.dll.js/.test(file)) {
    plugins.push(
      new AddAssetHtmlWebpackPlugin({
        // 将dll.js文件自动引入html
        // 文件输出目录
        outputPath: 'static/dll',
        // 脚本或链接标记的公共路径
        publicPath: `${process.env.PUBLIC_URL}static/dll`,
        filepath: path.resolve(__dirname, '../dll', file)
      })
    )
  }
  if (/.*\.manifest.json/.test(file)) {
    plugins.push(
      new webpack.DllReferencePlugin({
        //当打包第三方库时，会去manifest.json文件中寻找映射关系，
        //如果找到了那么就直接从全局变量(即打包文件)中拿过来用就行，不用再进行第三方库的分析，以此优化打包速度
        manifest: path.resolve(__dirname, '../dll', file)
      })
    )
  }
})

if (process.env.NODE_ENV === 'ana') {
  plugins.push(new BundleAnalyzerPlugin())
}

function getModulePackageName(module) {
  if (!module.context) return null
  const nodeModulesPath = path.join(__dirname, '../node_modules/')
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null
  }
  const moduleRelativePath = module.context.substring(nodeModulesPath.length)
  const [packageOrgName, packageName] = moduleRelativePath.split(path.sep)
  // console.log('get: ', `npm.${`${packageOrgName}-${packageName}`.replace('@', '')}`)
  if (packageName && packageName !== 'dist') {
    return `${packageOrgName}~${packageName}`.replace('@', '')
  }
  return packageOrgName.replace('@', '')
}

const webpackConfigPro = {
  mode: 'production', // 只要在生产模式下， 代码就会自动压缩，自动启用 tree shaking
  //注意：Tree Shaking可以剔除掉一个文件中未被引用掉部分，如果在项目中使用类似 css-loader 并 import 一个 CSS 文件
  //，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除，用scss或less编译也必须添加
  devtool: false, // 生产配置最佳实践 'cheap-module-source-map'
  entry: {
    // 入口文件
    main: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/, //寻找css文件
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] //使用MiniCssExtractPlugin.loader,css-loader,postcss-loader
      }
    ]
  },
  optimization: {
    runtimeChunk: { name: 'manifest' },
    minimizer: [
      // css代码分割与合并
      new OptimizeCSSAssetsPlugin({}),
      // 压缩JS
      new TerserPlugin({
        // cache: true,
        parallel: true,
        // sourceMap: false,
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            // 是否注释掉console
            drop_console: true,
            dead_code: true,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        },
        extractComments: false
        // 等等详细配置见官网
      })
    ],
    splitChunks: {
      //代码分割SplitChunksPlugin配置
      chunks: 'all', // 只对异步引入代码起作用，设置all时并同时配置vendors才对两者起作用
      minSize: { javascript: 30000, style: 50000 }, // 引入的库大于30kb时才会做代码分割
      minChunks: 1, // 一个模块至少被用了1次才会被分割
      maxAsyncRequests: 6, // 同时异步加载的模块数最多是5个，如果超过5个则不做代码分割
      maxInitialRequests: 3, // 入口文件进行加载时，引入的库最多分割出3个js文件
      automaticNameDelimiter: '~', // 生成文件名的文件链接符
      name: 'cdq', // 开启自定义名称效果
      cacheGroups: {
        defaultVendors: {
          name: 'vendors',
          priority: -10
        }
      }
    }
  },
  plugins, //plugins被DellPlugin后
  output: {
    publicPath: process.env.PUBLIC_URL,
    filename: 'static/js/[name]-[contenthash:8].js', //打包后输出的文件名称 //entry对应的key值
    chunkFilename: 'static/js/[name]-[contenthash:8].js', // 间接引用的文件会走这个配置
    path: path.resolve(__dirname, '../dist')
  }
}

//打包时若用了history路由模式，服务器上线后，用户刷新页面404的问题，其实是服务器当收到路由跳转时当成了真的URL去解析，而服务器目录下又没有此目录，
//所以需要在服务端做一些配置，用hash路由模式不会有此问题。
//配置方式
//1、写node服务 (publicPath：'/')   开发时，应该为/,否则在browserHistory下二级目录刷新异常。
//  在服务器目录下挂载一个node express服务
//  监听所有路径，若匹配不到重定向到index.html,具体代码在/server/server.js
//2、利用nginx配置(publicPath:'/服务器此项目文件夹目录/')
//  nginx配置：
//  #reactwebpackdva
//  location /reactwebpackdva {
//      alias /home/reactwebpackdva/;
//      index  index.html;
//      try_files $uri  /reactwebpackdva/index.html;
//  }
module.exports = merge(webpackConfigBase, webpackConfigPro)
