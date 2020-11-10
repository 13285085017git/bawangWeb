import api from './api.js'
import store from '../../store/index'

var cl = true
var sta = true
var time = true

export const soket = async (callback) => {
  const nulls = await api.chatList()

  if (nulls.code === 200) {
    const arrData = nulls.data
    //   .map((a, b) => {
    //   a.num = 0
    //   return a
    // })
    // console.log(a)
    store.dispatch('getMessageNum', arrData)
  }

  const sokets = new WebSocket('ws://ws.xi0021.com:8585/')
  let status = true
  let soketTimes
  sokets.onopen = () => {
    if (soketTimes) {
      clearInterval(soketTimes)
    }
    soketTimes = setInterval(() => {
      sokets.send('ping')
    }, 24000)
  }// 发送请求ping
  sokets.onmessage = async (e) => {
    const data = JSON.parse(e.data)
    store.dispatch('getMessage', data)
    if (time) {
      localStorage.setItem('time', Math.round(new Date().getTime() / 1000))
    }
    if (data.type === 'message') {
      const obj = store.state.messageNum
      let myId = 'member_'+ JSON.parse(sessionStorage.getItem('myInfo')).id
      if(data.group_type==='group') {
        for (let i = 0; i < obj['room'].length; i++) {
          if (parseInt(obj['room'][i].id) === parseInt(data.id)) {
            obj['room'][i].last_msg = data.content
            obj['room'][i].time = data.time
            obj['room'][i].msg_type = String(data.msg_type)
            if (myId!=data.from_id){
              if (obj['room'][i].num){
                obj['room'][i].num = obj['room'][i].num + 1
              }else{
                let count = 0
                obj['room'][i].num = count + 1
              }
            }
          }
        }
      }else{
        for (let i = 0; i < obj['helpers'].length; i++) {
          if (obj['helpers'][i].id === data.id) {
            obj['helpers'][i].last_msg = data.content
            obj['helpers'][i].time = data.time
            obj['helpers'][i].msg_type = String(data.msg_type)
            obj['helpers'][i].un_read_count++
          }
        }
      }
      store.dispatch('getMessageNum', obj)
    }
    if (data.type === 'cmd' && status) {
      status = false
      sokets.send(JSON.stringify({ type: 'init' }))
      const res = await api.bind({
        client_id: data.client_id
      })
      if (res.code === 200) {
        sta = true
        const ress =  await api.reconnect({
          disconnect_time: localStorage.getItem('time')
        })
        if (ress.code === 200) {
          time = true
        }
      }
    }
  }
  sokets.onerror = () => {
    time = false
    run()
  }// 链接失败重连
  sokets.onclose = () => {
    if (sta) {
      sta = false
      time = false
      run()
    }
  }// 链接关闭
}
const run = () => {
  if (cl) {
    setTimeout(() => {
      soket()
      cl = true
    }, 3000)
  }
  cl = false
}
