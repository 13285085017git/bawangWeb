<template>
  <div>
    <div class="chatTop">
      <div style="width: 75%;float: left">
        <el-image class="title" @click="goBack" :src="backImg" style="margin-right: 30px;height: 20px;width: 20px;z-index: 999"></el-image>
        <div class="title">
          {{rank_type==="dama"?"打码榜":''}}
          {{rank_type==="sign"?"签到榜":''}}
          {{rank_type==="integral"?"积分榜":''}}
        </div>
      </div>
      <van-tabs @change="getChange" v-model="active" line-height="0" swipeable title-active-color="#ff851b" title-style="height:20px;width:100px;float: right;font-size: 20px;font-weight: bold;">
        <div class="rel_box">
          <div class="topbox">
            <van-tab name="day" title="日榜">
              <div style="height: 650px;">
                <div style="float: left;height: 35%;width: 100%;background-color: #96a7d0;border-radius: 0.4rem 0.4rem 10rem 10rem;text-align: center">
                  <div style="font-size: 22px;color: #FFFFFF;margin: 10px 0">日榜</div>
                  <div style="margin:0 auto;width: 90%;height: 125px;margin-top: 40px;text-align: center;float: none;border-radius: 0.4rem;background-color: #FFFFFF">
                    <div class="top3" v-for="(first,index) in top" :style="index | topStyle" >
                      <div class="topdiv">
                        <van-image round width="40" height="40" :src="first!=''?first.avart:defaultAvart" class="topinner" />
                        <div class="topinner">{{first.nickname}}</div>
                        <div class="topinner" style="color: #ff851b">{{first!=''?first.count:'暂无'}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <van-list
                    v-model="loading"
                    :finished="finished"
                    @load="onLoad"
                  >
                    <van-cell v-for="(item,index) in list" v-if="index >= 3">
                      <div style="height: 40px;width: 100%;;line-height: 40px;">
                        <div class="listLeft">{{index+1}}</div>
                        <van-image round width="40" height="40" :src="item.avart" class="listLeft" />
                        <div class="listLeft" style="min-width: 30%;max-width: 60%;">{{item.nickname}}</div>
                        <div style="float: right;text-align: right;margin: 0 20px 0 5px">{{item.count}}</div>
                      </div>
                    </van-cell>
                  </van-list>
                </div>
              </div>
            </van-tab>
            <van-tab name="month" title="月榜">
              <div style="height: 650px;">
                <div style="float: left;height: 35%;width: 100%;background-color: #96a7d0;border-radius: 0.4rem 0.4rem 10rem 10rem;text-align: center">
                  <div style="font-size: 22px;color: #FFFFFF;margin: 10px 0">月榜</div>
                  <div style="margin:0 auto;width: 90%;height: 125px;margin-top: 40px;text-align: center;float: none;border-radius: 0.4rem;background-color: #FFFFFF">
                    <div class="top3" v-for="(first,index) in top" :style="index | topStyle" >
                      <div class="topdiv">
                        <van-image round width="40" height="40" :src="first!=''?first.avart:defaultAvart" class="topinner" />
                        <div class="topinner">{{first.nickname}}</div>
                        <div class="topinner" style="color: #ff851b">{{first!=''?first.count:'暂无'}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <van-list
                    v-model="loading"
                    :finished="finished"
                    @load="onLoad"
                  >
                    <van-cell v-for="(item,index) in list" v-if="index >= 3">
                      <div style="height: 40px;width: 100%;;line-height: 40px;">
                        <div class="listLeft">{{index+1}}</div>
                        <van-image round width="40" height="40" :src="item.avart" class="listLeft" />
                        <div class="listLeft" style="min-width: 30%;max-width: 60%;">{{item.nickname}}</div>
                        <div style="float: right;text-align: right;margin: 0 20px 0 5px">{{item.count}}</div>
                      </div>
                    </van-cell>
                  </van-list>
                </div>
              </div>
            </van-tab>
          </div>
        </div>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import backImg from '../../assets/img/goback/back2.png';
  import defaultAvart from '../../assets/img/user/default_avatar.jpg';
  import api from "../../assets/js/api";
  import Vue from 'vue';
  import { Tab, Tabs, List, Image as VanImage } from 'vant';

  Vue.use(Tab);
  Vue.use(Tabs);
  Vue.use(List);
  Vue.use(VanImage);
    export default {
        name: "history",
      data() {
        return{
          list: [],
          day: [],
          month: [],
          loading: false,
          finished: false,
          backImg : backImg,
          defaultAvart : defaultAvart,
          type : this.$route.query.type,
          rank_type : this.$route.query.rank_type,
          active: 2,
          top : [],
          day_first : '',
          day_second : '',
          day_third : '',
          month_first : '',
          month_second : '',
          month_third : '',
        }
      },
      methods:{
        //返回
        goBack() {
          this.$router.back()
        },
        async onLoad () {
          this.loading = true
          setTimeout(async () => {
            if (this.refreshing) {
              this.list = []
              this.refreshing = false
            }
            const res = await this.getList('day',this.rank_type)
            // const month_res = await this.getList({
            //   type : 'month',
            //   rank_type : this.rank_type
            // })
            // console.log(month_res)
            // this.top = obj
            // let res
            // let top
            // if (day_res){
            //   res = day_res
            //   top = day_res.slice(0,3)
            //   this.day_first = top[0]
            //   this.day_second = top[1]
            //   this.day_third = top[2]
            // }else{
            //   res = month_res
            //   top = month_res.slice(0,3)
            //   this.month_first = top[0]
            //   this.month_second = top[1]
            //   this.month_third = top[2]
            //
            //   console.log(top)
            // }

            if (res.length < 10) {
              this.finished = true
            }else{
              this.finished = true
              this.loading = false
            }
            this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
            // this.day = this.day.concat(day_res)
            // this.month = this.month.concat(month_res)
            // this.list = this.list.concat(res)
            this.list = res
            return {
              finished: true
            }
          }, 100)
        },
        async getList(type,rank_type) {
          const res = await api.Rank({
            type : type,
            rank_type : rank_type
          })
          let data = res.data
          var i
          if (this.rank_type==='integral'){
            for (i=0;i<data.length;i++){
              data[i].count = data[i].integral_sum,
              data[i].avart = this.getImgUrl(data[i].member.head_portrait),
              data[i].id = data[i].member.id,
              data[i].nickname = data[i].member.nickname
            }
          }else if (this.rank_type==='sign'){
            for (i=0;i<data.length;i++) {
              data[i].count = data[i].sign_days,
              data[i].avart = this.getImgUrl(data[i].head_portrait),
              data[i].id = data[i].id,
              data[i].nickname = data[i].nickname
            }
          }
          let top3 = data.slice(0,3)
          let nullData = {}
          nullData.avart = defaultAvart
          nullData.nickname = '暂无'
          let first = top3.shift()
          let second = top3.shift()
          let third = top3.shift()
          let arr = new Array()

          if(first!=undefined) {
            arr[1] = first
          }else{
            arr[1] = ''
          }
          if(third!=undefined) {
            arr[0] = third
          }else{
            arr[0] = ''
          }
          if(second!=undefined) {
            arr[2] = second
          }else{
            arr[2] = ''
          }
          this.top = arr
          return data
        },
        async getChange(name) {
          const result = await this.getList(name,this.rank_type)
          this.list = result
        },
        //拼接图片url
        getImgUrl(icon) {
            return process.env.VUE_APP_API_ROOT+icon;
        },
      },
      filters: {
        topStyle: function (value) {
          if (value===0) {
            return 'float: right;position: relative;top: -10px;'
          }else if (value===1){
            return 'float: right;position: relative;top: -15px;box-shadow: 0px -18px 8px #96a7d0;z-index: 999'
          }else{
            return 'float: left;'
          }
        }
      }
    }
</script>

<style scoped>
  #app {
    width: 100%;
  }
  .chatTop {
    text-align: left;
    padding: 20px;
    box-sizing: border-box;
    /*position: fixed;*/
    width: 100%;
    background-color: #ffffff;
    float: left;
    height: 100%;
  }

  .title {
    float: left;
    font-size: 20px;
    font-weight: bold;
  }

  .rel_box {
    width: 100%;
    height: 80%;
    /*position: fixed;*/
    background-color: #ffffff;
    float: left;
    box-sizing: border-box;
    border-radius: 0.4rem;
    /*margin: 20px;*/
    box-shadow: 6px 20px 20px #b6a794;
  }
  /deep/.van-tabs--line .van-tabs__wrap {
    height: unset;
  }

  /deep/.van-tabs__content {
    height: 100%;
    width: 100%;
    float: left;
    box-sizing: border-box;
  }
  .top3 {
    padding-top: 30px;
    height: auto;
    width: 33.3%;
    border-radius: 0.4rem;
    background-color: #FFFFFF;
  }
  .topdiv {
    font-size: 12px;
    /*text-align: center;*/
    /*height: 100%;*/
    /*margin: 0 auto*/
  }
  .topinner {
    width: 100%;
    margin-bottom: 5px
  }
  .listLeft {
    float: left;
    margin: 0 5px
  }
  .date {
    float: right;
    font-size: 12px;
    text-align: right;
    height: 18px;
    line-height: 18px;
  }
</style>
