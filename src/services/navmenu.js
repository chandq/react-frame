import axios from 'axios'
import baseUrl from '@/request/base'

export default {
  reqNavLeft() {
    console.log('api=>navleft')
    return new Promise((resolve, reject) => {
      axios.get(baseUrl + '/navleft').then(data => {
        resolve(data.data)
      })
    })
  }
}
