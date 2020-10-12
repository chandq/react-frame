// 请求成功拦截器
const responseSuccess = response => {
  const { data } = response
  if (response.status === 200) {
    return data?.data ?? data
  } else if (response.status === 601 || response.status === 401) {
    return Promise.reject(data)
  } else {
    return Promise.reject(data)
  }
}

// 请求失败拦截器
const responseError = error => {
  // console.log('rerror: ', error)
  if (error.request.status === 401) {
    return
  } else if (error.request.status === 403) {
    console.error('该请求无权限')
    return Promise.reject(error)
  } else if (error.request.status === 0) {
    if (error.message.includes('timeout')) {
      console.error('请求超时')
      return Promise.reject(error)
    }
  }
  console.error('请求失败: ', error)
  return Promise.reject(error)
}

export { responseSuccess, responseError }
