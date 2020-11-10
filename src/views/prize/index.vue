<template>
    <div id="app">
        <div class="fuc">
            <span class="title">
                热门功能
            </span>
            <div class="function" style="overflow:auto">
              <a class="fun_btn" :href="fuc.jump_url!=''?fuc.jump_url:''" v-for="fuc in func">
                <van-image
                  width="50px"
                  fit="contain"
                  :src="fuc.icon"
                />
                <div class="btn_title">{{fuc.title}}</div>
              </a>
            </div>
        </div>

      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
      >
        <div class="showList">
            <div class="title">
                展示彩种
            </div>
            <van-cell @click="lotteryHistory(rel.code,rel.name)" class="res" v-for="rel in list" v-if="isReloadData">
                <van-image
                  round
                  width="55px"
                  :src="getImgUrl(rel.logo)"
                  class="logo" />
                <div class="rel_box">
                    <div class="tit_dat">
                        <span class="rel_title">{{ rel.name }}</span>
                        <span class="date">第{{rel.preTurnNum}}期</span>
                    </div>
                    <div class="rel_num">
                        <div class="num" v-for="num in rel.openNum">
                            {{ num }}
                        </div>
                    </div>
                    <div class="box_right">
                        开奖倒计时：
                      <span class="box_right">
                        <van-count-down ref="countDown" :auto-start="true" :time="Countdown(rel.openTimestamp,rel.open_interval)" style="color: #f33232;font-size: 10px;" @finish="finish()" />
                        <span style="color: #f33232;font-size: 10px;">
                          开奖中...
                        </span>
                      </span>
                    </div>
                </div>
            </van-cell>
        </div>
      </van-list>
    </div>
</template>

<script>
  import api from "../../assets/js/api";
  import { List, CountDown, Image as VanImage } from 'vant';
  import Vue from "vue";

  Vue.use(List);
  Vue.use(CountDown);
  Vue.use(VanImage);

    export default {
        name: "index",
        inject:['reload'],
        data () {
            return {
              list: [],
              loading: false,
              finished: false,
              // 刷新标识
              isReloadData: true,
              func: [],
            }
        },
      methods:{
        async onLoad () {
          this.loading = true
          const hot = await api.hotFunction()
          this.func = hot.data
            if (this.refreshing) {
              this.list = []
              this.refreshing = false
            }
            const result = await this.lotteryList()

            if (result.length < 10) {
              this.finished = true
            }else{
              this.finished = true
              this.loading = false
            }
            this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
            return {
              finished: true
            }
        },
        async lotteryList() {
          const result = await api.lotteryList()
          var lottery = result.data
          for (var i=0;i<lottery.length;i++){
            const res = await this.lotteryLog(lottery[i].code)
            lottery[i].openNum = res.openNum.split(',')
            lottery[i].preTurnNum = res.preTurnNum
            lottery[i].openTimestamp = res.openTimestamp
          }
          this.list = lottery.reverse()
          return lottery
        },
        //拼接图片url
        getImgUrl(icon) {
            return process.env.VUE_APP_API_ROOT+icon;
        },

        async lotteryLog(code){
          const res = await api.lotteryLog({
            code : code
          })
          return res.data.shift()
        },

        Countdown(openTimestamp,openInterval) {
          var nowtime = new Date();
          if ((Number(openTimestamp)+Number(openInterval))*1000 > nowtime.getTime()){
            var openTime = parseInt(((Number(openTimestamp)+Number(openInterval))*1000 - nowtime.getTime()));
            // if (openTime!=0){
            //   this.countTime = true
            // }else{
            //   this.overTime = false
            // }
          }else{
            var openTime = openInterval * 1000
          }
          return openTime
        },

        async finish() {
          this.lotteryList()
          // const result = await api.lotteryList()

          // console.log(result)
          // this.lotteryList()
          // var list = this.list
          // for (var i=0;i<list.length;i++){
          //   setTimeout(() => {
          //     var tess = this.lotteryList()
          //     console.log(list[i].openNum.toString()===tess[i].openNum.toString())
          //     if (list[i].openNum.toString()===tess[i].openNum.toString()){
          //       console.log('11111')
          //     }else{
          //       this.lotteryList()
          //     }
          //   },8000)
          // }
          // setTimeout(function(){
          // //   this.overTime = true
          // //   this.countTime = false
          // //   this.lotteryList()
          // },5000)
          // this.$nextTick(() => {
          //   this.lotteryList()
          //   // this.reload()
          // })
        },

        // 刷新当前页面，在修改数据之后 this.reload 一下就可以完成刷新当前这个指定标签的刷新
        // reload () {
        //   this.isReloadData = false;
        //   this.$nextTick(() => {
        //     this.isReloadData = true;
        //   })
        // },

        lotteryHistory(code,name) {
          this.$router.push({path:'/history',query:{code:code,name:name}})
        }
      }
    }
</script>

<style scoped lang="scss">
    #app {
        padding: 15px 15px 15px 15px;
    }
    .title {
        float: left;
        width: 100%;
        text-align: left;
        font-weight: bolder;
    }
    .function {
        padding: 10px 0 10px 0;
        float: left;
        /*width: 100%;*/
        height: 80px;
        overflow: auto;
    }
    .fun_btn {
        height: 70px;
        width: 50px;
        float: left;
        margin-right: 20px;
    }
    i{
        font-size: 50px;
    }
    .btn_title {
        width: 100%;
        float: left;
        font-size: 10px;
        margin-top: 5px;
    }
    .fuc {
        float: left;
        height: 100%;
    }
    .showList {
        padding-top: 15px;
        margin-bottom: 70px;
        float: left;
        width: 100%;
        height: 100%;
        border-top: solid 1px #cbcbcb;
    }
    .logo {
        height: 55px;
        width: 55px;
        float: left;
        line-height: 95px;
        border-radius: 50%;
    }
    .rel_box {
        float: left;
        text-align: left;
        width: 80%;
        height: 80px;
        border-bottom: solid 1px #dbdbdb;
    }
    .rel_title {
        font-size: 10px;
    }
    .rel_num {
        width: 100%;
        float: left;
        margin: 5px;
    }
    .num {
        font-size: 15px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: #ff5772;
        color: #FFFFFF;
        text-align: center;
        float: left;
        margin-right: 4px;
        line-height: 22px; /*设置line-height与父级元素的height相等*/
        overflow: hidden; /*防止内容超出容器或者产生自动换行*/
    }
    .res {
        width: 100%;
        float: left;
        height: 80px;
        margin-top: 15px;
        padding: unset;
    }
    .box_right {
        float: right;
        font-size: 10px;
        height: 20px;
    }
    .tit_dat {
        font-size: 10px;
        float: left;
        width: 100%;
    }
    .date {
        float: right;
    }
</style>
