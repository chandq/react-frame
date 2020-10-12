/*
 * @created: Saturday, 2020-02-15 10:45:06
 * @author: chendq
 * ---------
 * @description 根据多语言文件输出多语言对照的Excel表(支持xls或xlsx)，当前支持中英文
 * @depedence Node环境，安装xlsx模块
 */

const json2Excel = function (zh, en, fileName) {
  let zh_arr = [],
    en_arr = [],
    zhen_xlsxArr = []
  let ObjKeys = ''
  /**
   * @description 资源文件JSON对象转换为对应的数组
   * @param {*} obj 中文或英文语言JSON对象en
   * @param {*} arr 保存中文或英文语言JSON数据的对象数组，格式为[{key: zh}]或[{key: en}]，key包含对象层级
   */
  let obj2Arr = function (obj, arr) {
    for (let k in obj) {
      if (!['number', 'string'].includes(typeof obj[k])) {
        ObjKeys += ObjKeys ? '.' + k.toString() : '' + k.toString()
        obj2Arr(obj[k], arr)
      } else {
        arr.push({ [ObjKeys ? `${ObjKeys}.${k}` : k.toString()]: obj[k] })
      }
    }
    if (ObjKeys) {
      if (ObjKeys.includes('.')) {
        let a = ObjKeys.split('.')
        a.length = a.length - 1
        ObjKeys = a.join('.')
      } else {
        ObjKeys = ''
      }
    }
  }
  obj2Arr(zh, zh_arr)
  obj2Arr(en, en_arr)
  for (let i = 0; i < zh_arr.length; i++) {
    let key = Object.keys(zh_arr[i])[0]
    let enValue = ''
    for (let j = 0; j < en_arr.length; j++) {
      let vkey = Object.keys(en_arr[j])[0]
      if (key === vkey) {
        enValue = en_arr[j][vkey]
        break
      }
    }
    zhen_xlsxArr.push({
      ['key']: key,
      ['简体中文']: zh_arr[i][key],
      ['英文']: enValue || ''
    })
  }
  console.log('em: ', zh_arr, en_arr, zhen_xlsxArr)
  const path = require('path')
  const xlsx = require('xlsx'),
    { utils } = xlsx
  const { writeFile } = require('fs').promises
  const workBook = utils.book_new()
  const workSheet = utils.json_to_sheet(zhen_xlsxArr, {
    origin: 'A1', // 从A1开始增加内容
    header: ['key', '简体中文', '英文'],
    skipHeader: false // 跳过上面的标题行
  })

  // 向工作簿中追加工作表
  utils.book_append_sheet(workBook, workSheet, 'helloWorld')
  // 浏览器端和node共有的API,实际上node可以直接使用xlsx.writeFile来写入文件,但是浏览器没有该API
  const result = xlsx.write(workBook, {
    bookType: 'xlsx', // 输出的文件类型
    type: 'buffer', // 输出的数据类型
    compression: true // 开启zip压缩
  })
  // 写入文件
  writeFile(path.resolve(__dirname, `../${fileName}`), result).catch(error => {
    console.log(error)
  })
  console.log('workSheet: ', workSheet)
}
module.exports = json2Excel
