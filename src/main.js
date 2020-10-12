const path = require('path')
const json2excel = require('./lib/json2excel')
const { excel2json, json2FormatLangObj, writeToFile } = require('./lib/excel2json')
/**
 * @name
 * Read method 1:
 * Only support read json file by builtin require module in nodejs
 * @description
 * suport both relative path and absolute path
 * high performance
 */
// let zh = require('../after_zh-cn.json')
// let en = require('../after_en.json')
// json2excel(zh, en, '售后维保中英文对照表.xlsx')

// Test generate excel file by parse json
let zh = require(convertRelativePath(String.raw`./zh-cn.json`))
let en = require(convertRelativePath(String.raw`./en.json`))
json2excel(zh, en, 'HelloWorld.xlsx')

/**
 * @name
 * Read method 2:
 * support read any file by builtin fs module in nodejs
 * @description
 * low performance
 * Not achieve beause of not suported function of ES module import and export
 */
// let zh = ''
// let en = ''
// const zhPath = String.raw`D:\projects\supaur\fe-after-sale\src\lib\i18n\lang\zh-cn.js` // get raw string by String.raw``
// const enPath = String.raw`D:\projects\supaur\fe-after-sale\src\lib\i18n\lang\en.js`

// zh = readFile(convertRelativePath(zhPath))
// en = readFile(convertRelativePath(enPath))

// console.log('require: ', require('../../supaur/fe-after-sale/src/lib/i18n/lang/en.js'))
// Promise.all([zh, en]).then(data => {
//   console.log('read File complete: ', data)
//   json2excel(data[0], data[1], '售后维保中英文对照表7.xlsx')
// })
// .catch(err => {
//   console.error('Execute failed: ', err)
// })

// Test generate json file by read excel data
const jsonArr = excel2json('售后维保中英文对照表10.xlsx')
writeToFile(json2FormatLangObj(jsonArr[0]), 'after')

// return relative path
function convertRelativePath(pathname) {
  // console.log(__dirname, path.isAbsolute(pathname), path.relative(__dirname, pathname))
  if (path.isAbsolute(pathname)) {
    return path.relative(__dirname, pathname).split(path.sep).join('/')
  } else {
    return pathname.split(path.sep).join('/')
  }
}

function readFile(pathname) {
  // 异步读取
  return new Promise(async (resole, reject) => {
    if (pathname.endsWith('json')) {
      resole(require(pathname))
    } else if (pathname.endsWith('js')) {
      console.log('pathname:', pathname, typeof pathname)
      const com = await import(pathname)
      console.log('com: ', com)
      resole(com)
      // .then(data => {
      //   console.log(data)
      //   resole(data.default)
      // })
      // .catch(err => console.error('Import failed: ', err))
    } else {
      reject('仅支持读取扩展名为js或json的资源文件')
      // console.error('仅支持读取扩展名为js或json的资源文件')
    }
  })
}
