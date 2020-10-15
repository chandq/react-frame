// import moment from 'moment'
// 设置 html title
export const setTitle = title => {
  document.title = title || 'Vue-App'
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
export function forGetParams(url, params) {
  const paramsString = getString(params)
  return paramsString ? url + '?' + paramsString : url
}

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
 * @desc judge data type
 * value of type : String,Number,Undefined,Null,Object,Array,RegExp,Function,Date,Error
 * @param data, type
 */
// eslint-disable-next-line no-extend-native
// Object.prototype.dataType = (data, type) => {
//   return Object.prototype.toString.call(data) === `[object ${type}]`
// }

/* export const convertTime = {
  getDateTime: function (dateTime) {
    return moment(dateTime, 'YYYY-MM-DD HH:mm:ss')
  },
  getTime: function (dateTime) {
    return moment(dateTime, 'HH:mm:ss')
  },
  parseDateTime: function (dateTime) {
    return moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
  },
  parseTime: function (dateTime) {
    return moment(dateTime).format('HH:mm:ss')
  },
  getCustomTime: function (formatStr, dateTime) {
    return moment(dateTime, formatStr)
  },
  parseCustomTime: function (formatStr, dateTime) {
    return moment(dateTime).format(formatStr)
  }
} */
export function downloadFileByLink(fileName, href) {
  const link = document.createElement('a')
  const tmpEle = document.body.appendChild(link)
  link.download = fileName
  link.href = href
  link.click()
  tmpEle.remove()
}
export function downloadByStream({ method = 'GET', url, data = {}, fileName = '文件.xlsx' }) {
  const req = new XMLHttpRequest();
  req.open(method, url, true);
  req.responseType = 'blob';
  req.setRequestHeader('Content-Type', 'application/json');
  req.onload = function() {
    const data = req.response;
    const blob = new Blob([data]);
    const blobUrl = window.URL.createObjectURL(blob);
    download(blobUrl, fileName);
  };
  req.send(JSON.stringify(data));
}

function download(blobUrl, fileName) {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = blobUrl;
  a.click();
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
 * @description 移除对象内无效的键值对
 * @author chendq
 * @date 2020-03-11
 * @export
 * @param {*} obj
 * @returns Object
 */
export function removeInvalidVal(obj) {
  let newObj = {}
  for (let key in obj) {
    if ((obj[key] instanceof Array && obj[key].length !== 0) || ![undefined, null, ''].includes(obj[key])) {
      newObj[key] = obj[key]
    }
  }
  return newObj
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

export const formateDate = (dateObj = new Date(), seprator = '/') => {
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const week = dateObj.getDay()
  return `${year + seprator + (month > 9 ? month : `0${month}`) + seprator + (day > 9 ? day : `0${day}`)} ${
    ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'][week]
  }`
}
