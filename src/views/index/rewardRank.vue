<template>
  <div id="index">
    <div class="header">
      <div style="float: left;width: 100%;" :style="isMember===true?'margin-bottom: 20px':''">
        <span class="iconfont leftInput title" style="font-size: 36px;margin-right: 30px;height: 20px;width: 20px;color: white;line-height: 20px" @click="goBack">&#xe734;</span>
        <!--        <div class="title" @click="goBack" style="margin-right: 30px;height: 20px;width: 20px;color: white"><</div>-->
        <div class="title">
          {{isMember==='1'?"获赏榜":"打赏榜"}}
        </div>
      </div>
      <div class="info" v-if="isMember==='1'">
        <div style="float: left;width: 60%">
          <span class="liltitle" :style="isMember==='1'?'margin-top:35px':''" style="font-weight: bold;font-size: 30px;">
            排行榜
          </span>
          <span class="liltitle">
            为你的倒是，疯狂打call~
          </span>
        </div>
        <van-image
          class="award"
          width="100px"
          :src="reward_icon"
        />
      </div>
    </div>
    <div :class="isMember==='1'?'rankList':'rankList2'">
      <van-tabs @click="onClick" color="#ff7a21" animated swipeable>
        <van-tab name="day" title="日榜">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
          >
            <van-cell v-for="(iteme,index) in this.rankList">
              <van-image
                round
                width="50px"
                height="50px"
                :src="getImgUrl(iteme.avatar)"
                style="float: left;margin-right: 10px"
              />
              <div class="tabtitle" style="font-size: 14px;width: 100px">{{iteme.nickname}}</div>
              <div class="tabtitle" style="font-size: 12px;color: #929292">赞赏获得:<span style="color: #ff2121">{{iteme.reward}}</span>元</div>
              <div style="font-weight: bolder;color: #665b54;font-size: 20px;float: right">{{index+1}}</div>
            </van-cell>
          </van-list>
        </van-tab>
        <van-tab name="week" title="周榜">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
          >
            <van-cell v-for="(iteme,index) in this.rankList">
              <van-image
                round
                width="50px"
                height="50px"
                :src="getImgUrl(iteme.avatar)"
                style="float: left;margin-right: 10px"
              />
              <div class="tabtitle" style="font-size: 14px;width: 100px">{{iteme.nickname}}</div>
              <div class="tabtitle" style="font-size: 12px;color: #929292">赞赏获得：<span style="color: #ff7a21">{{iteme.reward}}</span>元</div>
              <div style="font-weight: bolder;color: #39322c;font-size: 20px;float: right">{{index+1}}</div>
            </van-cell>
          </van-list>
        </van-tab>
        <van-tab name="month" title="月榜">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
          >
            <van-cell v-for="(iteme,index) in this.rankList">
              <van-image
                round
                width="50px"
                height="50px"
                :src="getImgUrl(iteme.avatar)"
                style="float: left;margin-right: 10px"
              />
              <div class="tabtitle" style="font-size: 14px;width: 100px">{{iteme.nickname}}</div>
              <div class="tabtitle" style="font-size: 12px;color: #929292">赞赏获得：<span style="color: #ff7a21">{{iteme.reward}}</span>元</div>
              <div style="font-weight: bolder;color: #39322c;font-size: 20px;float: right">{{index+1}}</div>
            </van-cell>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import api from "../../assets/js/api";
  import reward_icon from "../../assets/img/top/reward_icon.png";
  import Vue from 'vue';
  import { Form, Toast, Tab, Tabs, Image as VanImage  } from 'vant';

  Vue.use(Form);
  Vue.use(Toast);
  Vue.use(Tab);
  Vue.use(Tabs);
  Vue.use(VanImage);
    export default {
        name: "rewardRank",
      data() {
          return{
            rankList : [],
            loading: false,
            finished: false,
            isMember : this.$route.query.isMember,
            reward_icon : reward_icon,
          }
      },
      methods: {
        //聊天页面加载
        //   async onLoad () {
        //     // let thisScl = event.target.scrollTop
        //     // console.log(thisScl)
        //       setTimeout(async () => {
        //         // let ele = document.getElementById('m_box');
        //         // let pageHight = ele.scrollHeight
        //         this.loading = true
        //         let newList = this.list
        //         console.log(newList)
        //         let res
        //         let data
        //         if (Object.keys(newList).length==0){
        //           res = await api.chatHistory({
        //             id : this.$route.query.id,
        //             type : this.$route.query.type,
        //           })
        //           data = res.data.reverse()
        //           this.list = data.concat(this.list)
        //         }
        //         // }else{
        //         //   let lastMsg = newList[0]
        //         //   console.log(lastMsg)
        //         //   res = await api.chatHistory({
        //         //     id : this.$route.query.id,
        //         //     type : this.$route.query.type,
        //         //     top_id : lastMsg.msg_id
        //         //   })
        //         // }
        //         await api.readMsg({
        //           id : this.$route.query.id
        //         })
        //
        //           // this.finished = true
        //           this.loading = true
        //           if (this.list.length >= 75) {
        //             this.finished = true
        //           }
        //           this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
        //         //
        //         // console.log(this.list);
        //       }, 1000)
        //   },
        async onLoad () {
          this.loading = true
          setTimeout(async () => {
            if (this.refreshing) {
              this.rankList = []
              this.refreshing = false
            }
            let result
            if (this.isMember==='1'){
              result = await api.RewardRank({
                type : 'day'
              })
            }else{
              result = await api.memberReward({
                type : 'day'
              })
            }
            if (result.length < 10) {
              this.finished = true
            }else{
              this.finished = true
              this.loading = false
            }
            this.rankList = result.data
            return {
              finished: true
            }
          }, 1000)
        },
        //返回
        goBack() {
          this.$router.back()
        },
        async onClick(name) {
          let res
          if (this.isMember==='1'){
            res =  await api.RewardRank({
              type : name
            })
          }else{
            res =  await api.memberReward({
              type : name
            })
          }
          if (res.code === 200){
            this.rankList = res.data
          }
        },
        //拼接图片url
        getImgUrl(icon) {
          return process.env.VUE_APP_API_ROOT+icon;
        },
      },
    }
</script>

<style scoped>
  .header {
    text-align: left;
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.2);*/
    padding: 20px 10px 20px 10px;
    box-sizing: border-box;
    z-index: 999;
    position: fixed;
    width: 100%;
    height: auto;
    top: 0;
    left: 0;
    background-color: #ff7d27;
    float: left;
  }
  .title {
    float: left;
    font-size: 20px;
    font-weight: bold;
    color: white
  }
  .info {
    float: left;
    width: 100%;
    color: white;
  }
  .liltitle {
    width: 100%;
    float: left;
    margin-top: 15px;
  }
  .rankList {
    float: left;
    width: 100%;
    height: 100%;
    margin-top: 160px;
  }
  .rankList2 {
    float: left;
    width: 100%;
    height: 100%;
    margin-top: 60px;
  }
  /deep/.van-cell {
    line-height: 60px;
    height: 100%
  }
  .tabtitle {
    float: left;
    /*margin-right: 35px;*/
  }
  #index {
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
    position: fixed;
    /*padding: 20px 8px 20px 8px;*/
    box-sizing: border-box;
  }

  .award {
    float: right;
  }
</style>
