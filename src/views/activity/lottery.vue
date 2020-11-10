<template>
  <div>
    <div class="topnav">
      <div style="float: left;margin-right: 30px;font-size: 20px;" @click="goBack"><</div>
      <div style="float: left;font-size: 20px;">{{type==='1'?'积分抽奖':'活动抽奖'}}</div>
      <div style="float: right;font-size: 14px" @click="checkLog">抽奖记录</div>
    </div>
    <van-image
      width="100%"
      fit="contain"
      :src="bgI"
      style="position: fixed;top: 0;left: 0;"
      class="turntable"
    >
      <div style="position: absolute;top: 22%;left: 0;">
        <van-image
          width="90%"
          fit="contain"
          :src="zhuanpan"
          style="position: relative;top: 0;left: 0;"
          id="turnBox"
          :style="{transform:rotateAngle,transition:rotateTransition == ''?'transform 4s ease-in-out':rotateTransition }"
         >
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            class="line"
          >
            <div class="center-point"></div>
            <div class="surround-box">
              <div v-for="(reward,index) in list"
                   class="circle"
                   :style="{transform: 'rotateZ(' + 360/list.length*index + 'deg) translateY(-100px)'}">
                <div class="turntable-center">
                  <div style="font-size: 13px">{{ reward.content }}</div>
                  <van-image
                    width="40px"
                    fit="contain"
                    :src="getImgUrl(reward.img)"
                    :id="reward.id"
                    class=""
                  />
                </div>
              </div>
            </div>
          </van-list>
        </van-image>
      </div>
      <van-image
        width="10%"
        fit="contain"
        :src="zhizhen"
        style="position: absolute;top: 20%;left: 45%;"
        class="turntable-top"
      >
      </van-image>
      <van-image
        width="30%"
        fit="contain"
        :src="startButtom"
        style="position: absolute;top: 39%;left: 34%;"
        class="turntable-top turnBtn"
        @click="luckflag===true ? pointer():''"
      >
        <div style="position: inherit;left: 15%;top: 40%;color: #FFFFFF;font-weight: bolder;font-size: 18px">开始抽奖</div>
      </van-image>
      <div style="position: absolute;top: 75%;left: 0;width: 100%;text-align: center;box-sizing: border-box">
        <div style="float: left;width: 100%;font-size: 18px;font-weight: bold">抽奖规则</div>
        <div style="width: 100%;text-align: left;padding: 8% 15% 0;box-sizing: border-box;">
          <div style="border: #6076ad 2px solid;border-radius: 0.4rem;padding: 10px 15px;background-color: rgba(255,255,255,0.6)">
            {{lotteryRule}}
          </div>
        </div>
      </div>
    </van-image>
  </div>
</template>

<script>
import Vue from 'vue';
import { Image as VanImage, List, Toast } from 'vant';

Vue.use(VanImage);
Vue.use(List);
Vue.use(Toast);

import bgI from '../../assets/img/lottery/lottery_bg.png'
import startButtom from '../../assets/img/lottery/startLottery.png'
import zhuanpan from '../../assets/img/lottery/zhuanpan.png'
import zhongjiang from '../../assets/img/lottery/jinguang.png'
import zhizhen from '../../assets/img/lottery/zhizhen.png'
import fudai from '../../assets/img/lottery/fudai.png'
import api from '../../assets/js/api'


export default {
name: "lottery",
  data(){
    return{
      luckflag: true,
      rotateAngle: 0, //将要旋转的角度
      startRotatingDegree: 0, //初始旋转角度
      rotateTransition:'',//控制过渡效果
      click_flag: true, //是否可以旋转抽奖
      bgI : bgI,
      startButtom : startButtom,
      zhuanpan : zhuanpan,
      zhongjiang : zhongjiang,
      zhizhen : zhizhen,
      fudai : fudai,
      list: [],
      loading: false,
      finished: false,
      api: api,
      type: this.$route.query.type,
      turnHow: 0,
      lotteryRule: '',
    }
  },
  methods:{
    //返回
    goBack() {
      this.$router.back()
    },

    async onLoad() {
      let res = await api.lotteryInfo({
        type : this.type
      })
      this.lotteryRule = JSON.parse(sessionStorage.getItem('settings')).turn_table_explain
      setTimeout(() => {
        if (res.code === 200){
          this.list = res.data
        }
        // 加载状态结束
        this.loading = false;
        this.turnHow = "rotate(" + 360/this.list.length + "deg)";
        // console.log(this.turnHow)
        // 数据全部加载完成
        // if (this.list.length >= 40) {
        //   this.finished = true;
        // }
        if (this.list.length < 40 && this.list.length >= 0) {
          this.finished = true;
        }
      }, 1000);
    },

    //拼接图片url
    getImgUrl(icon) {
      return process.env.VUE_APP_API_ROOT+icon;
    },

    checkLog() {
      let type = 'lottery'
      this.$router.push({path:'/useDetail',query:{type:type}})
    },

    // 点击指针
    pointer(){
      this.rotate()
    },
    // 转动
    async rotate(){//目前是只转动转盘
      if (!this.click_flag) return;
      var type = 0; // 默认为 0  转盘转动
      var randCircle = 10; // 附加多转几圈，2-3
      var duringTime = 5; // 默认为 5s
      var rotateAngle = '';

      let res = await api.lottery({
        type : this.type
      })
      if (res.code===200){
        let prize = res.data
        rotateAngle = randCircle*360+(360-((360/this.list.length)*(parseInt(prize)-1)));

        this.click_flag = false; // 旋转结束前，不允许再次触发
        if (type == 0) {
          // 转动盘子
          var rotateAngle = this.startRotatingDegree + rotateAngle - this.startRotatingDegree % 360;//将要旋转的角度
          this.startRotatingDegree = rotateAngle;//改变初始旋转的角度
          this.rotateAngle = "rotate(" + rotateAngle + "deg)";//真正控制转动角度
          // 旋转结束后允许再次触发
          setTimeout(()=>{
            this.click_flag = true;
            this.gameOver(prize)
          }, duringTime * 1000+200)
        }
      }else{
        Toast({
          message: res.message,
          type: "fail",
        })
      }
    },
    // 游戏结束
    gameOver (prize) {
      // 游戏结束,重置旋转初始位置
      var msg = this.list.find(function (obj) {
        return obj.id == prize;//取出this.studentL里的id为1的那条数据所有的信息
      })
      Toast({
        message: '恭喜您抽中'+msg.amount+'元现金',
        position: 'bottom',
        duration: 5000,
        onOpened: this.onOpen(),
        onClose: this.onOpen(),
      });
      // 中奖弹窗提示
      // this.isShowMask = true
      // this.winAward = true
      // 更新抽奖次数
      // this.getActcivityFancy()
    },
    onOpen() {
      this.rotateAngle = "rotate(" + 0 + "deg)";//真正控制转动角度的,为0,回到初始位置
      this.rotateTransition = 'transform 0.05s ease-in-out' //控制转动过渡效果的
      setTimeout(()=>{
        this.rotateTransition = ''
      },100)
    },
    //请求点击抽奖数据,中奖操作
    // async getlotteryPrizeFun(){
    //   let res = await api.lottery({
    //     type : this.type
    //   })
    //   console.log(res)
    //   this.rotate(res.data)
    // },
  }

}
</script>

<style scoped>
    .line {
      position: absolute;
      box-sizing: border-box;
      top: 0;
      left: 0;
      /*transform-origin: 50% 50%;*/
      display: flex;
      width: 100%;
      height: 100%;
    }
    .turntable-center {
      /*width: 50%;*/
      /*transform: rotate(0deg) translateY(80px);*/
    }
    .surround-box,
    .center-point{
      position: absolute;
      top:  50%;
      left: 47%;
      width:  100%;
      height:  100%;
      /*margin-left: -10px;*/
      /*margin-top: -10px;*/
      /*border-radius: 50%;*/
      /*background-color: #000;*/
    }
    .circle{
      /* 这里一定要绝对定位，这样位置才能铺开来 */
      position: absolute;
      top:  -25px;
      left: -25px;
      /*width: 40px;*/
      /*height:  40px;*/
      /*line-height: 40px;*/
      /*border-radius:  50%;*/
      /*text-align: center;*/
      /*font-size: 12px;*/
    }
  /*}*/

    .topnav {
      z-index: 999;
      position: fixed;
      width: 100%;
      background-color: white;
      float:left;
      padding: 15px 10px 15px 20px;
      height: auto;
      line-height: 20px;
      box-sizing: border-box;
    }
</style>
