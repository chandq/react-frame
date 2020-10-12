import axios from 'axios'
import requestSuccess from './request'
import { responseSuccess, responseError } from './response'
import baseUrl from '@/request/base'

const axiosBase = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
  // withCredentials: true
})

axiosBase.interceptors.request.use(requestSuccess, error => {
  console.log('rej err: ', error)
  return Promise.reject(error)
})

axiosBase.interceptors.response.use(responseSuccess, responseError)

const request = config => {
  return new Promise((resolve, reject) => {
    // api config拓展
    axiosBase(
      Object.assign(
        {
          method: 'get',
          baseURL: config.domain || baseUrl
        },
        config
      )
    )
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        console.log('conf: ', error)
        reject(error)
      })
  })
}

export default request
