/**
 * author: chendq
 * Date: 2018/12/29
 * Features: 基于node里event模块封装异步消息通信工具类
 */
import EventEmitter from 'events'
let eventEmitter = Object.assign({}, EventEmitter.prototype)
const asyncMessage = {
  emit: (eventName, data) => {
    eventEmitter.emit(eventName, data)
  },
  addEventListener: (eventName, callBack) => {
    eventEmitter.on(eventName, callBack)
  },
  removeEventListener: (eventName, callBack) => {
    eventEmitter.removeListener(eventName, callBack)
  }
}
export default asyncMessage
