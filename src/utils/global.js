/**
 * @name 管理全局的变量和方法
 * @desc  添加到Window对象上
 * @author chendq
 * @Date 2019/10/24
 * @param
 * @return
 */
// 深拷贝或合并的工具类
const mergeUtils = {
  type: function (o) {
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
  },
  typeMap: {
    object: function () {
      return {}
    },
    array: function () {
      return []
    }
  },
  // 默认配置项
  defaults: {
    // 是否深合并
    isDeep: true,
    // 是否遍历合并源对象原型链上的属性
    includePrototype: true,
    // 用于对每个合并项进行自定义修正
    forEach: function (target, name, sourceItem) {
      target[name] = sourceItem
      return target
    }
  },
  // 将配置项合并到默认配置项
  init: function (options) {
    for (let name in options) {
      this.defaults[name] = options[name]
    }
    return this
  },
  merge: function () {
    let self = this
    let _default = self.defaults
    let i = 1
    let { length } = arguments
    let target = arguments[0] || {}
    let source
    let targetItem
    let sourceItem
    let tiType
    let siType
    let clone
    let name

    for (; i < length; i++) {
      // 判断源对象是否为空
      if ((source = arguments[i]) != null) {
        for (name in source) {
          // eslint-disable-next-line no-prototype-builtins
          const hasPro = source.hasOwnProperty(name)
          // 是否遍历源对象的原型链
          if (hasPro || _default.includePrototype) {
            targetItem = target[name]
            sourceItem = source[name]
            tiType = self.type(targetItem)
            siType = self.type(sourceItem)

            // 防止出现回环
            if (target === sourceItem) {
              continue
            }

            // 如果复制的是对象或者数组
            if (_default.isDeep && sourceItem != null && self.typeMap[siType]) {
              clone = targetItem != null && tiType === siType ? targetItem : self.typeMap[siType]()
              // 递归
              target[name] = self.merge(clone, sourceItem)
            } else {
              clone = hasPro ? target : Object.getPrototypeOf(target)
              // 处理每一个合并项
              clone = _default.forEach.call(self, clone, name, sourceItem)
            }
          }
        }
      }
    }
    return target
  }
}
const globalVar = {
  /**
   * @desc judge data type
   * value of type : String,Number,Undefined,Null,Object,Array,RegExp,Function,Date,Error
   * @param data, type
   */
  dataType: data => {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
  },
  /**
   * @description 快速获取对象深层属性的值
   * @author chendq
   * @date 2020-03-13
   * @example aa = { b: { c: [{d: 'au'}]}}  getProp(aa, 'b', 'c', '[0]', d) => 'au'
   */
  getProp: function () {
    // console.log('arguments:', arguments, Array.from(arguments))
    let paramsArr = Array.from(arguments)
    let objVal
    if (paramsArr.length > 0) {
      paramsArr.forEach((v, i) => {
        try {
          if (i === 0) {
            objVal = v
          } else if (/^\[\d+\]$/.test(v)) {
            const num = v.match(/^\[(\d+)\]$/)
            objVal = objVal[num[1]]
          } else {
            objVal = objVal[v]
          }
        } catch (err) {
          objVal = undefined
        }
      })
    }
    return objVal
  },
  hasClass: (element, cName) => {
    return !!element.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)')) // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
  },
  removeClass: (element, cName) => {
    if (globalVar.hasClass(element, cName)) {
      element.className = element.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' ') // replace方法是替换
    }
  },
  addClass: (element, cName) => {
    if (!globalVar.hasClass(element, cName)) {
      element.className += ' ' + cName
    }
  },
  convertByViewport(originValue) {
    // 以750px宽度为基准，根据viewport变化作自适应调整
    return Number(((window.innerWidth * originValue) / 1920).toFixed(0))
  },
  getRandomArr(len = 5, min = 10, max = 100) {
    let res = []
    let i = 0
    while (i < len) {
      res.push(Number((min + Math.random() * (max - min)).toFixed(0)))
      i++
    }
    return res
  }
}
let bindToGlobal = (obj, key = 'cdq') => {
  window[key] = {}
  for (let i in obj) {
    window[key][i] = obj[i]
  }
  window[key].deepMerge = mergeUtils.merge.bind(mergeUtils)
}
// 定义只在development模式下才打印日志的函数
window.log = (...params) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      throw new Error('below is call stack:')
    } catch (error) {
      console.log(...params, error.stack)
    }
  }
}
window.error = (...params) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      throw new Error('below is call stack:')
    } catch (error) {
      console.error(...params, error.stack)
    }
  }
}
bindToGlobal(globalVar)
export default globalVar
