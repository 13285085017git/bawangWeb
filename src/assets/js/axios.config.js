import axios from 'axios'
import { Toast, Notify } from 'vant'
import state from '@/store/state'
import router from '@/router'

const qs = require('qs')
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_ROOT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  timeout: 10000
})
instance.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  if (state.loadings) {
    state.loadings = false
    return config
  }
  // Toast.loading({
  //   message: '加载中...',
  //   forbidClick: true,
  //   loadingType: 'circular',
  //   duration: 500
  // })
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  if (response.status === 200) {
    if (response.data.code === 401) {
      Notify({
        type: 'warning',
        message: '登录已过期，请重新登录'
      })
      sessionStorage.clear()
      router.push({ path: '/' })
    }
    setTimeout(() => {
      Toast.clear()
    }, 2000)
  }
  return response
}, (error) => {
  // 对响应错误做点什么
  Toast.fail('服务器错误')
  console.log(process.env.VUE_APP_API_ROOT + '地址错误')
  return Promise.reject(error)
})
const api = {
  async get (url, data, token) {
    let res = null
    if (token) {
      res = await instance.get(url, {
        params: data,
        headers: {
          'access-token': token
        }
      })
    } else {
      res = await instance.get(url, { params: data })
    }
    // eslint-disable-next-line no-unused-expressions
    res.data.code !== 200 ? (Toast.fail(res.data.message), console.log('请检查接口' + url)) : ''
    return res
  },
  async post (url, data, token) {
    const res = await instance.post(url, qs.stringify(data), {
      headers: {
        'access-token': token
      }
    })
    // eslint-disable-next-line no-unused-expressions
    res.data.code !== 200 ? (Toast.fail(res.data.message), console.log('请检查接口' + url)) : ''
    return res
  }
}
export default api
