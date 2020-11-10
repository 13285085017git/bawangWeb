import Md5 from 'md5'
import axios from 'axios'
import store from '@/store/index'
import { Toast, Notify } from 'vant'
import Router from '@/router/index'
const qs = require('qs')
// const object = {}
export const Md5Keys = (key) => {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let newStr = ''// 生成8位随机字符串
  for (let i = 0; i < 8; i++) {
    newStr += str.substr(Math.floor(Math.random() * str.length), 1)
  }
  const obj = {
    ...key,
    appId: 'bwChatRoom',
    time: Math.round(new Date().getTime() / 1000).toString(),
    nonceStr: newStr
  }
  const newObj = {}
  Object.keys(obj).sort().map(key => {
    newObj[key] = obj[key]
  })
  let newStar = ''
  let num = parseInt(Object.keys(newObj).length)
  for (key in newObj) {
    num--
    newStar += key + '=' + newObj[key] + (num === 0 ? '' : '&')
  }
  return '?' + newStar + '&sign=' + Md5(newStar + 'e758624da9a')
}
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_ROOT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  timeout: 10000
})
// 添加响应拦截器
instance.interceptors.response.use((response) => {
  if (response.data.code === 401) {
    Notify({ type: 'warning', message: '登录已过期，请重新登录' })
    setTimeout(() => {
      sessionStorage.clear()
      Router.push({ path: '/' })
    }, 500)
    // 数据请求成功后
  }
  return response.data
}, (error) => {
  // 请求失败
  console.log(process.env.VUE_APP_API_ROOT + '地址错误')
  return Promise.reject(error)
})
// 添加响应拦截器
instance.interceptors.response.use((response) => {
  if (response.code === 401) {
    Notify({ type: 'warning', message: '登录已过期，请重新登录' })
    setTimeout(() => {
      sessionStorage.clear()
      Router.push({ path: '/' })
    }, 500)
    // 数据请求成功后
  }
  return response
}, (error) => {
  // 对响应错误做点什么
  console.log(process.env.VUE_APP_API_ROOT + '地址错误')
  return Promise.reject(error)
})
export const api = {
  async get (url, data, token, str) {
    // object[str] = true
    // store.dispatch('loadMove', object)
    let res = null
    if (token) {
      res = await instance.get(url + Md5Keys(data), {
        headers: {
          'access-token': sessionStorage.getItem('token')
        }
      })
    } else {
      res = await instance.get(url + Md5Keys(data))
    }
    if (res.code === 200) {
      if (str) {
        store.state.loading[str] = false
      }
    }
    return res
  },
  async post (url, data, token, isFormdata) {
    // Toast.loading({
    //   message: '加载中...',
    //   forbidClick: true
    // })
    if (token) {
      const config = {
        headers: {
          'access-token': sessionStorage.getItem('token')
        }
      }
      let datas;
      if (isFormdata){
        datas = data
      }else{
        datas = qs.stringify(data)
      }
      const res = await instance.post(url + Md5Keys(), datas, config)
      if (res) {
        setTimeout(() => {
          Toast.clear()
        }, 500)
      }
      return res
    } else {
      const res = await instance.post(url + Md5Keys(), qs.stringify(data))
      if (res) {
        setTimeout(() => {
          Toast.clear()
        }, 500)
      }
      return res
    }
  }
}
