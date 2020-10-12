const packageInfo = require('../../package.json')

const getNow = () => new Date().getTime()

class Storage {
  constructor(storageType) {
    this.root = packageInfo.name || 'app'
    this.storage = window[storageType || 'localStorage']
  }
  set(key, value, time) {
    let storage = JSON.parse(this.storage[this.root] || '{}')
    if (time) {
      storage[key] = {
        value: value,
        keyActiveTime: getNow(), // 创建时间
        keyEffectiveTime: time // 有效持续时间
      }
    } else {
      storage[key] = value
    }
    this.storage[this.root] = JSON.stringify(storage)
  }
  get(key) {
    let storage = JSON.parse(this.storage[this.root] || '{}')
    let val = storage[key]
    if (val && val.keyActiveTime) {
      if (getNow() - val.keyActiveTime > val.keyEffectiveTime) {
        this.remove(key)
        return
      } else {
        return val.value
      }
    }
    return val
  }
  remove(key) {
    if (!this.storage[this.root]) {
      return
    }
    let storage = JSON.parse(this.storage[this.root])
    storage && delete storage[key]
    this.storage[this.root] = JSON.stringify(storage)
  }
}

const storage = new Storage('localStorage')

export const sstorage = new Storage('sessionStorage')

export default storage
