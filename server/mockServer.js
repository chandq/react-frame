let express = require('express') //引入express
let fs = require('fs')
let path = require('path')
const chalk = require('chalk')

let app = express() //实例化express
const crossDomain = () => (req, res, next) => {
  // 设置withCredentials: true时,需设置以下两项
  // res.header('Access-Control-Allow-Credentials', true)
  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') res.status(200) // 让OPTIONS快速返回
  next()
}
app.use(crossDomain())

const parseMockFiles = function () {
  let files = fs.readdirSync(path.resolve(__dirname, '../mock'))
  files.forEach(file => {
    // 先删除require之前导入的缓存文件,否则获取到的文件内容还是旧内容
    delete require.cache[require.resolve(`../mock/${file}`)]
    let fileObject = require(path.resolve(__dirname, `../mock/${file}`))

    // console.log('mockfile: ', file, fileObject)
    Object.keys(fileObject).forEach(item => {
      // console.log('travesel file: ', item, typeof fileObject[item], fileObject[item])
      if (typeof fileObject[item] === 'function') {
        app.use(item, fileObject[item])
        // console.log('function proxy: ', item)
      } else if (typeof fileObject[item] === 'object') {
        app.use(item, function (req, res) {
          res.json(fileObject[item])
        })
        // console.log('plain object proxy: ', item)
      }
    })
  })
  console.log(chalk.hex('#ce5b34bd')(`${files.length} mock file parsed`))
}
parseMockFiles()
// app.use('/mock/login', function (req, res) {
//   console.log('enter into mock')
//   res.json(
//     Mock.mock({
//       status: 200,
//       'dataSource|1-9': [
//         {
//           'key|+1': 1,
//           'mockTitle|1': ['肆无忌惮'],
//           'mockContent|1': [
//             '角色精湛主题略荒诞',
//             '理由太短 是让人不安',
//             '疑信参半 却无比期盼',
//             '你的惯犯 圆满',
//             '别让纠缠 显得 孤单'
//           ],
//           'mockAction|1': ['下载', '试听', '喜欢']
//         }
//       ]
//     })
//   )
// })

app.listen('8090', () => {
  console.info(chalk.rgb(10, 100, 200)(`\n==> 🌍  Mock Server is running on port ${8090} \n`))
})
