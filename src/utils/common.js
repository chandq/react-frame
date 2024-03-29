// 设置 html title
export const setTitle = title => {
  document.title = title || 'Vue-App'
}
/**
 * @description: 判断数据类型的万能函数
 * @param {*} data
 * @return {string}
 */
export function dataType(data) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}
// 获取 url Pathname
export const getPathname = url => {
  if (!url) return ''
  // if (!url.includes('http')) return url
  let httpArr = url && url.split('//')
  let pathStr = httpArr[0].includes('http') ? httpArr[1] : httpArr[0]
  let startIndex = pathStr.indexOf('/')
  let endIndex = pathStr.indexOf('?') > 0 ? pathStr.indexOf('?') : pathStr.length
  return pathStr.substring(startIndex, endIndex)
}
/**
 * @description 获取纯净对象
 * @export
 * @param {Object} obj 源对象
 * @param {Array[String]} exclude 移除属性
 */
export function getPureObject(obj, exclude) {
  if (!Array.isArray(exclude)) {
    throw new Error(`getPureObject方法exclude参数必须为Array格式`)
  }
  let pureObject = Object.create(null)
  Object.keys(obj)
    .filter(key => !exclude.includes(key))
    .forEach(key => {
      pureObject[key] = obj[key]
    })
  return pureObject
}
/**
 * 查询地址栏参数
 * @param name 查询的name
 * @param search 查询的完整参数
 * @return string
 * */
export function getQueryValue(name, search) {
  const search2 = search || window.location.search
  const result = search2.match(new RegExp(`[?&]${name}=([^&]+)`, 'i'))
  if (result === null || result.length < 1 || result[1] === 'undefined') {
    return ''
  }
  return decodeURIComponent(result[1])
}
/**
 * @description: 解析URL查询参数为普通对象
 * @param {string} searchStr
 * @return {object}
 * 正则表达式参考资料：https://segmentfault.com/a/1190000023733064
 */
export function parseUrlParams(searchStr = location.search) {
  const queryObj = {}
  Array.from(searchStr.matchAll(/[&?]?([^=&]+)=?([^=&]*)/g)).forEach((item, i) => {
    if (!queryObj[item[1]]) {
      queryObj[item[1]] = item[2]
    } else if (typeof queryObj[item[1]] === 'string') {
      queryObj[item[1]] = [queryObj[item[1]], item[2]]
    } else {
      queryObj[item[1]].push(item[2])
    }
  })
  return queryObj
}
/**
 * @description: 请求url和查询参数对象转换为完整的请求URL
 * @param {string} url 请求url
 * @param {object} params 请求查询参数
 * @return {string}
 */
export function forGetParams(url, params) {
  const paramsString = getString(params)
  return paramsString ? url + '?' + paramsString : url
}

/**
 * @description: 将Query对象转换为Query string
 * @param {object} obj
 * @return {string}
 */
export function getString(obj) {
  let str = []
  let index = 0
  for (let key in obj) {
    if (obj[key]) {
      str[index] = `${key}=${obj[key]}`
      index++
    }
  }
  str = str.join('&')
  return str
}

// 正则表达式
export const regExp = {
  tel: () => {
    return /^1[3456789]\d{9}$/
  },
  phone: () => {
    return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  }
}
/**
 * @description: 按链接下载函数
 * @param {string} fileName
 * @param {string} href
 * @return {*}
 */
export function downloadFileByLink(fileName, href) {
  const link = document.createElement('a')
  const tmpEle = document.body.appendChild(link)
  link.download = fileName
  link.href = href
  link.click()
  tmpEle.remove()
}
/**
 * @description: 流下载函数
 * @param {string} method
 * @param {string} url
 * @param {string} data
 * @param {*} fileName
 * @return {*}
 */
export function downloadByStream({ method = 'GET', url, data = {}, fileName = '文件.xlsx' }) {
  const req = new XMLHttpRequest()
  req.open(method, url, true)
  req.responseType = 'blob'
  req.setRequestHeader('Content-Type', 'application/json')
  req.onload = function () {
    const data = req.response
    const blob = new Blob([data])
    const blobUrl = window.URL.createObjectURL(blob)
    download(blobUrl, fileName)
  }
  req.send(JSON.stringify(data))
}

function download(blobUrl, fileName) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = blobUrl
  a.click()
}
/**
 * @desc 根据当前往后推算的天数获得具体的日期时间 YYYY-MM-DD HH:mm:ss
 * new Date( 年 ，月 ，0 ).getDate() // 即获取当月最大天数
 * @param nextDays 往后推算的天数
 * @returns {string}
 */
export function getDate(nextDays) {
  var date = new Date()
  var separator1 = '-'
  var separator2 = ':'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate() + nextDays
  if (strDate > new Date(year, month, 0).getDate()) {
    month += 1
    strDate -= new Date(year, month, 0).getDate()
    if (month > 12) {
      year += 1
      month = 1
    }
  }
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return (
    year +
    separator1 +
    month +
    separator1 +
    strDate +
    ' ' +
    date.getHours() +
    separator2 +
    date.getMinutes() +
    separator2 +
    date.getSeconds()
  )
}

/**
 * @description 递归移除数组或对象内无效数值的元素（undefined, null, ''）
 * @author chendq
 * @date 2020-03-11
 * @export
 * @param {array|object} obj
 * @returns {array|object}
 */
export function removeInvalidVal(obj) {
  let retObj = dataType(obj) === 'object' ? {} : []
  const delInvalidVal = function (newObj, obj) {
    for (let key in obj) {
      if (['object', 'array'].includes(dataType(obj[key]))) {
        newObj[key] = dataType(obj[key]) === 'object' ? {} : []
        delInvalidVal(newObj[key], obj[key])
      } else {
        if ((obj[key] instanceof Array && obj[key].length !== 0) || ![undefined, null, ''].includes(obj[key])) {
          newObj[key] = obj[key]
        }
      }
    }
  }
  delInvalidVal(retObj, obj)
  return retObj
}

/**
 * @description 防抖函数
 * 应用场景：
 * 1. search搜索联想，用户在不断输入值时，用防抖来节约请求资源。
 * 2. window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次
 * @author chendq
 * @date 2020-03-20
 * @export function
 * @param {*} fun
 * @param {*} delay
 * @returns function
 */
export function debounce(fun, delay) {
  return function (args) {
    let that = this
    let _args = args
    clearTimeout(fun.id)
    fun.id = setTimeout(function () {
      fun.call(that, _args)
    }, delay)
  }
}

/**
 * @description 节流函数
 * 应用场景：
 * 1. 鼠标不断点击触发，mousedown(单位时间内只触发一次)
 * 2. 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断
 * @author chendq
 * @date 2020-03-20
 * @export function
 * @param {*} fun
 * @param {*} delay
 * @returns function
 */
export function throttle(fun, delay) {
  let last, deferTimer
  return function (args) {
    let that = this
    let _args = arguments
    let now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(that, _args)
      }, delay)
    } else {
      last = now
      fun.apply(that, _args)
    }
  }
}
/**
 * @desc JS设置图片等比例缩放，并水平垂直居中
 * @author chendq
 * @param event 内置事件对象
 *   父子元素设置示例：
 * span {
          width: 108px;
          height: 108px;
          img {
            max-width: 100%;
            max-height: 100%;
          }
        }
 */
export function setImgMiddle(event) {
  const getStyle = (ele, attr) => {
    return ~~getComputedStyle(ele).getPropertyValue(attr).split('px')[0]
  }
  var $img = event.path[0]
  var $panel = event.path[1] // 图片容器

  var imgWidth = getStyle($img, 'width')
  var imgHeight = getStyle($img, 'height')
  var // 图片宽高
    panelWidth = getStyle($panel, 'width')
  var panelHeight = getStyle($panel, 'height') // 图片容器宽高

  if (panelWidth / panelHeight < imgWidth / imgHeight) {
    $img.style.width = panelWidth + 'px'
    $img.style.marginTop = (panelHeight - imgHeight) * 0.5 + 'px'
  } else {
    $img.style.height = panelHeight + 'px'
    $img.style.marginLeft = (panelWidth - imgWidth) * 0.5 + 'px'
    $img.style.marginRight = (panelWidth - imgWidth) * 0.5 + 'px'
  }
}

// 判断浏览器内核、手机系统等，使用 browser.userAgent.mobile
export function browserCore() {
  var ua = navigator.userAgent
  var ualower = navigator.userAgent.toLocaleLowerCase()
  return {
    trident: ua.indexOf('Trident') > -1, // IE内核
    presto: ua.indexOf('Presto') > -1, // opera内核
    webKit: ua.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!ua.match(/AppleWebKit.*Mobile.*/) || !!ua.match(/AppleWebKit/), // 是否为移动终端
    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // IOS终端
    android: ua.indexOf('Android') > -1 || ua.indexOf('Mac') > -1, // 安卓终端
    iPhone: ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1, // 是否为iphone或QQHD浏览器
    iPad: ua.indexOf('iPad') > -1, // 是否为iPad
    webApp: ua.indexOf('Safari') === -1, // 是否web应用程序，没有头部与底部
    QQbrw: ua.indexOf('MQQBrowser') > -1, // QQ浏览器(手机上的)
    weiXin: ua.indexOf('MicroMessenger') > -1, // 微信
    QQ: ualower.match(/\sQQ/i) === ' qq', // QQ App内置浏览器（需要配合使用）
    weiBo: ualower.match(/WeiBo/i) === 'weibo', // 微博
    ucLowEnd: ua.indexOf('UCWEB7.') > -1, //
    ucSpecial: ua.indexOf('rv:1.2.3.4') > -1,
    webview:
      !(ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/)) &&
      ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
    ucweb: (function () {
      try {
        return (
          parseFloat(
            ua
              .match(/ucweb\d+\.\d+/gi)
              .toString()
              .match(/\d+\.\d+/)
              .toString()
          ) >= 8.2
        )
      } catch (e) {
        if (ua.indexOf('UC') > -1) {
          return true
        }
        return false
      }
    })(),
    Symbian: ua.indexOf('Symbian') > -1,
    ucSB: ua.indexOf('Firofox/1.') > -1
  }
}

/**
 * @description: 格式化时间日期
 * @param {string} fmt 时间日期字符串格式化模板
 * @param {date} date 时间日期Date
 * @returns {string}
 */
export function dateFormat(date = new Date(), fmt = 'YYYY-mm-dd') {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    'f+': date.getMilliseconds().toString(), // 毫秒
    'w+': ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'][date.getDay()] // 毫秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  // eslint-disable-next-line guard-for-in
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  }
  return fmt
}

/**
 * 计算日期
 * @param n 正数：向后推算；负数：向前推算
 * @returns {String}
 */
export function getBeforeDate(strDate, n) {
  //strDate 为字符串日期 如:'2019-01-01' n为你要传入的参数，当前为0，前一天为-1，后一天为1
  var datt = strDate.split('-') //这边给定一个特定时间
  var newDate = new Date(datt[0], datt[1] - 1, datt[2])
  var befminuts = newDate.getTime() + 1000 * 60 * 60 * 24 * parseInt(n) //计算前几天用减，计算后几天用加，最后一个就是多少天的数量
  var beforeDat = new Date()
  beforeDat.setTime(befminuts)
  var befMonth = beforeDat.getMonth() + 1
  var mon = befMonth >= 10 ? befMonth : '0' + befMonth
  var befDate = beforeDat.getDate()
  var da = befDate >= 10 ? befDate : '0' + befDate
  var finalNewDate = beforeDat.getFullYear() + '-' + mon + '-' + da
  return finalNewDate
}

/**
 * @description: 将数字格式化成千位分隔符显示的字符串
 * @param {number} val
 * @param {string} type 展示分段显示的类型 int:整型 | float:浮点型
 * @return {string}
 */
export function formatNumber(val, type = 'int') {
  return type === 'int' ? parseInt(val).toLocaleString() : Number(val).toLocaleString('en-US')
}

/**
 * 选择本地文件
 * @param {function} changeCb 选择文件回调
 * @return {*}
 */
export function chooseLocalFile({ accept }, changeCb) {
  var inputObj = document.createElement('input')
  inputObj.setAttribute('id', String(Date.now()))
  inputObj.setAttribute('type', 'file')
  inputObj.setAttribute('style', 'visibility:hidden')
  inputObj.setAttribute('accept', accept)
  document.body.appendChild(inputObj)
  inputObj.click()
  inputObj.onchange = e => {
    changeCb(e.target.files)
  }
  return inputObj
}

/**
 * @description: 自定义深度优先遍历函数(支持continue和break操作)
 * @param {array} deepList
 * @param {function} iterator
 * @param {array} children
 * @param {boolean} isReverse 是否反向遍历
 * @return {*}
 */
export function deepTraversal (deepList, iterator, children = 'children', isReverse = false) => {
  let level = 0
  const walk = (arr, parent) => {
    if (isReverse) {
      for (let i = arr.length - 1; i >= 0; i--) {
        const re = iterator(arr[i], i, deepList, parent, level)
        if (re === 'break') {
          break
        } else if (re === 'continue') {
          continue
        }
        if (Array.isArray(arr[i][children])) {
          ++level
          walk(arr[i][children], arr[i])
        }
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        const re = iterator(arr[i], i, deepList, parent, level)
        if (re === 'break') {
          break
        } else if (re === 'continue') {
          continue
        }
        if (Array.isArray(arr[i][children])) {
          ++level
          walk(arr[i][children], arr[i])
        }
      }
    }
  }
  walk(deepList, null)
}
/**
 * 深拷贝堪称完全体 即：任何类型的数据都会被深拷贝
 * @param {object|array} obj
 * @param {WeakMap} map
 * @return {object|array}
 */
export const deepClone = (obj, map = new WeakMap()) => {
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  if (map.has(obj)) {
    return map.get(obj)
  }

  const allDesc = Object.getOwnPropertyDescriptors(obj)
  const cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)

  map.set(obj, cloneObj)

  for (const key of Reflect.ownKeys(obj)) {
    const value = obj[key]

    cloneObj[key] = value instanceof Object && typeof value !== 'function' ? deepClone(value, map) : value
  }
  return cloneObj
}
/**
 * 在树中找到 id 为某个值的节点，并返回上游的所有父级节点
 * @param {array} tree
 * @param {string} nodeId
 * @param {object} config
 * @return {array}
 */
export const getTreeIds = (tree, nodeId, config) => {
  const { children = 'children', id = 'id' } = config || {};
  const toFlatArray = (tree, parentId, parent) => {
    return tree.reduce((t, _) => {
      const child = _[children];
      return [
        ...t,
        parentId ? { ..._, parentId, parent } : _,
        ...(child && child.length ? toFlatArray(child, _[id], _) : [])
      ];
    }, []);
  };
  const getIds = flatArray => {
    let child = flatArray.find(_ => _[id] === nodeId);
    const { parent, parentId, ...other } = child;
    let ids = [nodeId],
      nodes = [other];
    while (child && child.parentId) {
      ids = [child.parentId, ...ids];
      nodes = [child.parent, ...nodes];
      child = flatArray.find(_ => _[id] === child.parentId);
    }
    return [ids, nodes];
  };
  return getIds(toFlatArray(tree));
};
