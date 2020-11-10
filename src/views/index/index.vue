<template>
  <div>
    <div class="head">
      <topNav></topNav>
    </div>
      <div class="line_btw">
        <div v-for="(test,key) in getMessageNum" :key="key">
          <div class="line"v-for="room in test" :key="room.id">
            <div v-if="key==='room'" @click="toChat(room.id,'group',room.name)" >
              <div>
                <el-badge type="danger" :value="room.num>0?room.num:''" class="item avatar" :max="99">
                  <el-avatar size="medium" :src="getImgUrl(room.avatar)"></el-avatar>
                </el-badge>
                <div class="line_content">
                  <div class="username">{{room.name}}</div>
                  <div v-if="room.msg_type == 2">
                    <div class="content">[图片]</div>
                  </div>
                  <div v-else-if="room.msg_type == 3">
                    <div class="content">[红包]</div>
                  </div>
                  <div v-else>
                    <div class="content">{{room.last_msg}}</div>
                  </div>
                </div>
                <div class="date">
                  {{HowWhen(room.time)}}
                </div>
              </div>
            </div>
            <div v-if="key==='helpers'" @click="toChat(room.id,'friend',room.nickname)">
             <div>
               <el-badge type="danger" :value="room.un_read_count>0?room.un_read_count:''" class="item avatar" :max="99">
                 <el-avatar size="medium" :src="getImgUrl(room.avatar)"></el-avatar>
               </el-badge>
               <div class="line_content">
                 <div class="username">{{room.nickname}}</div>
                 <div v-if="room.msg_type == '2'">
                   <div class="content">[图片]</div>
                 </div>
                 <div v-else>
                   <div class="content">{{room.last_msg}}</div>
                 </div>
               </div>
               <div class="date">
                 {{HowWhen(room.time)}}
               </div>
             </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rankBtn">
        <van-image
          width="60px"
          height="60px"
          :src="rankimg"
          @click="toRank"
          style="box-shadow: #848484"
        />
      </div>
  </div>
</template>

<script>
import { Table,Avatar,Badge } from 'element-ui'
import Vue from "vue"
import topNav from '../../components/topNav.vue'
import api from "../../assets/js/api";
import { isHttp } from '../../assets/js/Encapsulation';
import getTime from '../../assets/js/dateCompute'
import { Image as VanImage } from 'vant';
import rank from '../../assets/img/icon/home_phb_icon.png';

// import websocket from '../../assets/js/websocket'
import global from "../../assets/js/global";

import { mapState } from 'vuex'

// import { List,PullRefresh } from 'vant'
// Vue.use(List,PullRefresh)
Vue.component(Table.name, Table);
Vue.component(Avatar.name, Avatar);
Vue.component(Badge.name, Badge);
Vue.use(VanImage);
export default {
  inject:['reload'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      api,
      isHttp,
      getTime,
      rankimg : rank,
      // soketTimes : '',
      // test : global.ws,
      websoket: null,
      soketTimes: null,
      status: true,
      messages: null
    }
  },
  components: {
    topNav : topNav
  },
  computed: {
    ...mapState({
      chartMessage: 'chartMessage',
      getMessageNum: 'messageNum'
    })
  },
  watch: {
    chartMessage (redata, vl) {
      // 数据接收
      if (redata.type === 'cmd' && redata.order === 'revoke_message') {
      }
    }
  },
  methods: {
    toChat(userId,type,name) {
      let arr = this.getMessageNum
      if (type==='group'){
        arr['room'].forEach(item => {
          if (item.id===userId){
            this.$set(item, 'num', 0)
          }
        })
      }
      if (type==='friend'){
        arr['helpers'].forEach(item => {
          if (item.id===userId){
            this.$set(item, 'un_read_count', '0')
          }
        })
      }
      this.$router.push({path:'/chat',query:{id:userId,type:type,name:name}})
    },

    // async onLoad () {
    //   this.loading = true
    //   setTimeout(async () => {
    //     if (this.refreshing) {
    //       this.list = []
    //       this.refreshing = false
    //     }
    //     const res = await api.chatList()
    //     // let re = websocket.initWebSocket()
    //     // console.log(re)
    //     const data = res.data
    //     if (data.helpers.length + data.room.length < 10) {
    //       this.finished = true
    //     }
    //     this.loading = false
    //     this.list = data
    //     console.log(this.list)
    //     if(global.ws == null){
    //       this.webSocketOnOpen()
    //     }
    //     // console.log('1111111111111'+this.test)
    //   }, 1000)
    // },
    // async webSocketOnOpen (){ // 连接建立之后执行send方法发送数据
    //   console.log("WebSocket连接成功");
    //   const url = 'ws://qq.pzgg668.com:8585/'
    //   global.ws = new WebSocket(url)
    //   if (global.ws) {
    //     console.log(321333);
    //     global.ws.onmessage = this.socketOnMessage
    //     global.ws.onclose = this.websocketclose
    //   }
    // },
    // socketOnMessage(message){
    //   // console.log(JSON.stringify(message.data))
    //   const redata = JSON.parse(message.data)
    //   switch (redata.type){
    //     case "cmd":
    //       this.bindSocket(redata)
    //       break;
    //     case "message":
    //       this.processUpdateList(redata)
    //       break;
    //   }
    // },
    // processUpdateList(message){
    //   console.log(message)
    //   if(message.group_type == "group"){
    //     for(let i = 0; i < this.list.room.length; i++){
    //       if(this.list.room[i].id == message.id){
    //         let content;
    //         if(message.msg_type == 1){
    //           content = message.content
    //         }else if(message.msg_type == 2){
    //           content = '[图片]'
    //         }else if(message.msg_type == 3){
    //           content = '[红包]'
    //         }
    //         this.list.room[i].last_msg = content;
    //         break;
    //       }
    //     }
    //   }else{
    //     for(let i = 0; i < this.list.helpers.length; i++){
    //       if(this.list.helpers[i].id == message.id){
    //         let content;
    //         if(message.msg_type == 1){
    //           content = message.content
    //         }else if(message.msg_type == 2){
    //           content = '[图片]'
    //         }else if(message.msg_type == 3){
    //           content = '[红包]'
    //         }
    //         this.list.helpers[i].last_msg = content;
    //         this.list.helpers[i].un_read_count = parseInt(this.list.helpers[i].un_read_count) + parseInt(1);
    //         break;
    //       }
    //     }
    //   }
    // },
    // async bindSocket(socketMsg){
    //   let res = await api.bind({
    //     client_id: socketMsg.client_id
    //   })
    //   if (res.code === 200) {
    //     global.ws.send(JSON.stringify({type: 'init'}));
    //     ///开启心跳
    //     this.soketTimes = setInterval(() => {
    //       // console.log('心跳')
    //       global.ws.send("ping")
    //     }, 24000)
    //
    //   }
    // },
    // websocketclose (){ // 关闭
    //   console.log("WebSocket连接发生错误1");
    //   clearInterval(this.soketTimes)
    // },
    // onRefresh () {
    //   // 清空列表数据
    //   this.finished = false
    //   this.pageNum += 1
    //   // 重新加载数据
    //   // 将 loading 设置为 true，表示处于加载状态
    //   this.loading = true
    //   this.reload()
    // },

    getImgUrl(icon) {
      return process.env.VUE_APP_API_ROOT+icon;
    },

    HowWhen(date2) {
      if (date2 == ''){
        return '';
      }
      const time1 = getTime.getTimeDuration(date2);
      return time1;
    },

    async toRank() {
      this.$router.push({path:'/rank'})
    },

    // async getList() {
    //   const res = await api.chatList()
    //   this.list = res.data
    // }
  },
  // created () {
  //   this.getList()
  // }
}
</script>

<style>
.avatar {
  float: left;
}
.head {
  float: left;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.line_btw {
  margin-top: 60px;
  margin-bottom: 70px;
  float: left;
  width: 100%;
  padding: 0 15px 0 15px;
  box-sizing: border-box;
}
.line_content {
  float: left;
  text-align: left;
  height: 40px;
  width: 180px;
  padding-left: 15px;
}
.content {
  text-align: left;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /*文本不换行，这样超出一行的部分被截取，显示...*/
  font-size: 10px;
  padding-top: 5px;
}
.line {
  height: 40px;
  padding: 15px 0 15px 0;
  border-bottom: #ececec solid 1px;
}
.date {
  float: right;
  font-size: 8px;
}
.rankBtn {
  position: fixed;
  bottom: 12%;
  right: 5%;
}
</style>
