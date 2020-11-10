import {api} from "./MD5";
const url = 'ws://xi0021.com:8585/'
const websoket = new WebSocket(url)
let soketTimes = ''
let status = ''
let disconnect_time = ''

const initWebSocket = () => {
  // console.log(websoket)
  if (websoket) {
    websoket.onmessage = websocketonmessage
    websoket.onopen = websocketonopen
    websoket.onerror = websocketonerror
    websoket.onclose = websocketclose
  }
}
const websocketonopen = () => { // 连接建立之后执行send方法发送数据
  // console.log("WebSocket连接成功");
  if (soketTimes) {
    clearInterval(soketTimes)
  }
  soketTimes = setInterval(() => {
    this.websocketsend('ping')
  }, 24000)
}
const websocketonmessage = (e) => { // 数据接收
  const redata = JSON.parse(e.data)

  if (redata.type === 'message' && parseInt(redata.room_id) === parseInt(this.$route.query.id)) {
    // console.log('消息')
    let newObj = {}
    // newObj = redata
    newObj.avatar = redata.avatar
    newObj.content = redata.content
    newObj.msg_id = redata.cid
    newObj.id = redata.from_id
    newObj.msg_type = redata.msg_type
    newObj.timestamp = redata.time
    newObj.username = redata.username
    this.list.push(newObj)
  }
  if (redata.type === 'cmd' && status) {
    status = false
    websocketsend(JSON.stringify({type: 'init'}))
    let res = api.bind({
      client_id: redata.client_id
    })
    if (res.code === 200) {
      if (disconnect_time != '') {
        api.reconnect({
          disconnect_time: disconnect_time
        })
      }
    }
    // console.log(res)
  } else {
    websocketsend(JSON.stringify({type: 'cmd'}))
    let newObj = {}
    newObj.avatar = redata.avatar
    newObj.content = redata.content
    newObj.msg_id = redata.cid
    newObj.id = redata.from_id
    if (redata.msg_type === 3) {
      redata.msg_type = "3"
    }
    newObj.msg_type = redata.msg_type
    newObj.timestamp = redata.time
    newObj.username = redata.username
    this.list.push(newObj)
    // console.log(this.list);
  }
}
const websocketsend = (Data) => { // 数据发送
  websoket.send(Data)
}
const websocketclose = (e) => { // 关闭
  // console.log("WebSocket连接发生错误1");
  disconnect_time = Date.parse(new Date()) / 1000
  clearInterval(soketTimes)
}
const websocketonerror = () => { // 连接建立失败重连
  // console.log("WebSocket连接发生错误");
  disconnect_time = Date.parse(new Date()) / 1000
  // console.log('失败')
  // console.log(this.disconnect_time)
  if (close) {
    initWebSocket()
  }
}


export default {
  initWebSocket,
  websocketonopen,
  websocketsend,
  websocketonmessage,
  websocketclose,
  websocketonerror
}
