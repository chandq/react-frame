/*
 * @created: Sunday, 2020-02-16 09:36:50
 * @author: chendq
 * ---------
 * @desc 将多语言（目前支持中英文）Excel文件(支持xls或xlsx)对照表转换为不同语言对应的资源文件(JSON格式)
 * @params Excel表格式，表头
 *  key | 简体中文 | 英文
 *  common.title	线索	Leads
 *  common.appCenter	应用列表	App List
 */

// 读取多语言对照表的excel文件，并转换为JSON对象
const excel2json = function (fileName = 'hello') {
  let jsonArr = []
  const xlsx = require('xlsx'),
    { utils } = xlsx
  const path = require('path')
  // 获取数据
  const workbook = xlsx.readFile(path.resolve(__dirname, `../${fileName}`))
  var sheet_name_list = workbook.SheetNames
  // console.time("sheet_to_json");
  // console.log(
  //   xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
  //     defval: ""
  //   })
  // );
  // console.timeEnd("sheet_to_json");

  console.time('customlize generate JSON')
  sheet_name_list.forEach(function (y) {
    var worksheet = workbook.Sheets[y]
    var headers = {}
    var data = []
    for (var z in worksheet) {
      if (z[0] === '!') continue
      //parse out the column, row, and value
      var tt = 0
      for (var i = 0; i < z.length; i++) {
        if (!isNaN(z[i])) {
          tt = i
          break
        }
      }
      var col = z.substring(0, tt)
      var row = parseInt(z.substring(tt))
      var value = worksheet[z].v

      //store header names
      if (row == 1 && value) {
        headers[col] = value
        continue
      }

      if (!data[row]) data[row] = {}
      data[row][headers[col]] = value
    }
    //drop those first two rows which are empty
    data.shift()
    data.shift()
    jsonArr.push(data)
    console.log(data)
  })
  console.timeEnd('customlize generate JSON')
  return jsonArr
}

// 将JSON对象格式化为不同语言的JSON对象
const json2FormatLangObj = function (arr) {
  let zh = {},
    en = {}
  const assignValue = function (originObj, zh_target_obj, en_target_obj, keysArr) {
    !zh_target_obj && (zh_target_obj = {})
    !en_target_obj && (en_target_obj = {})
    if (keysArr.length > 1) {
      !zh_target_obj[keysArr[0]] && (zh_target_obj[keysArr[0]] = {})
      !en_target_obj[keysArr[0]] && (en_target_obj[keysArr[0]] = {})
      let key = keysArr[0]
      keysArr.shift()
      assignValue(originObj, zh_target_obj[key], en_target_obj[key], keysArr)
    } else {
      zh_target_obj[keysArr[0]] = originObj['简体中文']
      en_target_obj[keysArr[0]] = originObj['英文']
    }
  }
  arr.forEach((v, i) => {
    // console.log("sd: ", i, v);
    !v.key && (v.key = 'xiaoyaozi-' + i)
    if (v.key.includes('.')) {
      assignValue(v, zh, en, v.key.split('.'))
    } else {
      zh[v.key] = v['简体中文']
      en[v.key] = v['英文']
    }
  })
  // console.log("zh:%o， en:%o", zh, en);
  return { zh, en }
}

// 将多语言JSON对象写入文件
const writeToFile = function (data, fileName = 'helloworld') {
  const path = require('path')
  const { writeFile } = require('fs').promises
  // zh语言对象写入文件
  writeFile(path.resolve(__dirname, `../${fileName}_zh.json`), JSON.stringify(data.zh, null, 2)).catch(error => {
    console.log(error)
  })
  // en语言对象写入文件
  writeFile(path.resolve(__dirname, `../${fileName}_en.json`), JSON.stringify(data.en, null, 2)).catch(error => {
    console.log(error)
  })
}
module.exports = {
  excel2json,
  json2FormatLangObj,
  writeToFile
}
