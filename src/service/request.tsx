import axios from 'axios'

import { message } from 'antd'

const instance = axios.create({
  // baseURL, 这里可以写baseUrl
  timeout: 5000,
})

instance.interceptors.request.use(
  (config) => {
    // 对请求做拦截
    return config
  },
  (err) => Promise.reject(err),
)

instance.interceptors.response.use(
  (response) => {
    //对响应做拦截
    return response.data
  },
  (err) => {
    // console.log('response err', err)
    return Promise.reject(err)
  },
)

type RequestOptions = {
  url: string
  method: 'get' | 'post'
  data?: {
    [propName: string]: any
  }
}

const request = (options: RequestOptions) => {
  return new Promise((resolve) => {
    const promise: Promise<any> = instance.request(options)
    promise
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        message.error(err.message)
      })
  })
}

export default request
