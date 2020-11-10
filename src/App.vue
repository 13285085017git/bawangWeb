<template>
  <div id="app">
<!--    <navigation>-->
    <transition name="fade" mode="out-in">
<!--      <keep-alive>-->
<!--        <router-view v-if="IsRouterAlive || $route.meta.keepAlive" />-->
<!--      </keep-alive>-->
<!--      <router-view v-if="I sRouterAlive || !$route.meta.keepAlive"/>-->
      <router-view v-if="IsRouterAlive"/>
    </transition>
    <div v-if="$route.meta.topPage" class="btm_nav">
      <bottomNav></bottomNav>
    </div>
<!--    <audio controls="controls" hidden :src="msgBgm" ref="audio"></audio>-->
<!--    </navigation>-->
  </div>
</template>

<script>
import bottomNav from "./components/bottomNav";
import msgBgm from "./assets/img/mp3/msg.mp3";
import api from "./assets/js/api.js";
// import { mapGetters } from 'vuex'
import { soket } from "./assets/js/soket.js";
import { mapState } from 'vuex';

export default {
  name: 'app',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      style:'',
      IsRouterAlive:true,
      transitionName:'',
      websoket: null,
      status : true,
      list:[],
      disconnect_time:'',
      soketTimes: '',
      soketStatus: true,
      msgBgm: msgBgm
    }
  },
  computed: {
    ...mapState({
      chartMessage: 'chartMessage',
      getMessageNum: 'messageNum'
    })
  },
  methods:{
    reload(){
      this.IsRouterAlive=false;
      this.$nextTick(function () {
        this.IsRouterAlive=true;
      })
    },
    // playBgm() {
    //   // 返回一个promise以告诉调用者检测结果
    //   return new Promise(resolve => {
    //     let audio = document.createElement('audio');
    //     // require一个本地文件，会变成base64格式
    //     audio.src = require(msgBgm);
    //     document.body.appendChild(audio);
    //     let autoplay = true;
    //     // play返回的是一个promise
    //     audio.play().then(() => {
    //       // 支持自动播放
    //       autoplay = true;
    //     }).catch(err => {
    //       // 不支持自动播放
    //       autoplay = false;
    //     }).finally(() => {
    //       audio.remove();
    //       // 告诉调用者结果
    //       resolve(autoplay);
    //     });
    //   });
    // }

    // initWebSocket () {
    //   console.log('第一次进web')
    //   const url = 'ws://qq.pzgg668.com:8585/'
    //   this.websoket = new WebSocket(url)
    //   if (this.websoket) {
    //     this.websoket.onmessage = this.websocketonmessage
    //     this.websoket.onopen = this.websocketonopen
    //     this.websoket.onerror = this.websocketonerror
    //     this.websoket.onclose = this.websocketclose
    //   }
    // },
    // websocketonopen () { // 连接建立之后执行send方法发送数据
    //   console.log("WebSocket连接成功");
    //   if (this.soketTimes) {
    //     clearInterval(this.soketTimes)
    //   }
    //   this.soketTimes = setInterval(() => {
    //     this.websocketsend('ping')
    //   }, 24000)
    //   console.log(this.soketTimes);
    // },
    //
    // async websocketonmessage (e) { // 数据接收
    //   const redata = JSON.parse(e.data)
    //   console.log(redata)
    //   if (redata.type === 'message' && parseInt(redata.room_id) === parseInt(this.$route.query.id)) {
    //     console.log('消息')
    //     let newObj = {}
    //     // newObj = redata
    //     newObj.avatar = redata.avatar
    //     newObj.content = redata.content
    //     newObj.msg_id = redata.cid
    //     newObj.id = redata.from_id
    //     newObj.msg_type = redata.msg_type
    //     newObj.timestamp = redata.time
    //     newObj.username = redata.username
    //     this.list.push(newObj)
    //   }
    //   if (redata.type === 'cmd' && this.status) {
    //     console.log('2')
    //     this.status = false
    //     this.websocketsend(JSON.stringify({ type: 'init' }))
    //     let res = await api.bind({
    //       client_id: redata.client_id
    //     })
    //     if (res.code===200){
    //       if (this.disconnect_time!=''){
    //         await api.reconnect({
    //           disconnect_time: this.disconnect_time
    //         })
    //       }
    //     }
    //     console.log(res)
    //   } else {
    //     this.websocketsend(JSON.stringify({ type: 'cmd' }))
    //     let newObj = {}
    //     newObj.avatar = redata.avatar
    //     newObj.content = redata.content
    //     newObj.msg_id = redata.cid
    //     newObj.id = redata.from_id
    //     if (redata.msg_type===3){
    //       redata.msg_type = "3"
    //     }
    //     newObj.msg_type = redata.msg_type
    //     newObj.timestamp = redata.time
    //     newObj.username = redata.username
    //     this.list.push(newObj)
    //     console.log(this.list);
    //   }
    // },
    // websocketsend (Data) { // 数据发送
    //   this.websoket.send(Data)
    // },
    // websocketclose (e) { // 关闭
    //   console.log("WebSocket连接发生错误1");
    //   this.disconnect_time = Date.parse(new Date())/1000
    //   clearInterval(this.soketTimes)
    // },
    // websocketonerror () { // 连接建立失败重连
    //   console.log("WebSocket连接发生错误");
    //   this.disconnect_time = Date.parse(new Date())/1000
    //   // console.log('失败')
    //   // console.log(this.disconnect_time)
    //   if (this.close) {
    //     this.initWebSocket()
    //   }
    // },
  },
  components: {
    bottomNav : bottomNav,
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
      if (to.name !== 'login' && to.name !== 'register' && to.name !== 'forget') {
        if (this.soketStatus) {
          soket()
          this.soketStatus = false
        }
      } else {
        this.soketStatus = true
      }
      //如果to的索引值为0，不添加任何动画；如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if(to.meta.index > 0){
        if( to.meta.index < from.meta.index){
          this.transitionName = 'slide-up';
        }else{
          this.transitionName = 'slide-down';
        }
      }else if(to.meta.index == 0 && from.meta.index > 0){
        this.transitionName = 'slide-up';
      }
    },
    chartMessage (redata, vl) {
      let myInfo = JSON.parse(sessionStorage.getItem('myInfo'))

      // console.log(myInfo)
      // console.log(redata)
      // if (redata.from_id!=myInfo.id){
        // this.$refs.audio.currentTime = 0; //从头开始播放提示音
        // this.$refs.audio.play(); //播放
        // console.log(this.playBgm)
        // this.playBgm
      // }
    }
    // config (val, vl) {
    // }
  },
  // computed: {
  //   ...mapGetters(['config'])
  // },q
}
</script>

<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: transparent;
    color: #333;
    -webkit-user-select: none;
  }
  html {
    height: 100%;
  }
  body {
    overflow: hidden;
  }
#app {
  font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.btm_nav {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  //z-index: 999;
}
.body-bg{
  position: absolute;
  height: 100%;
  width: 100%;
  top:0;
  left: 0;
  overflow-y: auto;
  background-color: #fff;//背景色为白色
}
</style>
