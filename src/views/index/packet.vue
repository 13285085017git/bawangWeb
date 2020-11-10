<template>
<div>
  <van-image style="position: relative;text-align: center" :src="packtop" class="packytop packyfont">
    <div style="position: absolute;left: 0;top: 0;width: 100%">
      <div style="width: 100%;text-align: left;">
        <van-image :src="back" @click="goBack" style="text-align: left;margin: 20px 0 0 15px;width: 10px"></van-image>
      </div>
      <div style="text-align: center">
        <div class="blessing" style="font-size: 16px">红包</div>
        <div class="blessing" style="font-weight: 600;font-size: 20px">恭喜发财，大吉大利</div>
      </div>
      <div style="height: 50px;margin-top: 50px">
        <div><span style="font-size: 50px">{{ myGet!=''?myGet:'0.00' }}</span>元</div>
        <div style="font-weight: 400;font-size: 16px">已存入余额，可直接提现</div>
      </div>
    </div>
  </van-image>
  <div class="packylist">
    <van-list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
    >
      <div>
        <van-cell v-for="(first,index) in list">
          <div style="width: 100%;float: left;box-sizing: border-box" :id="first.id" class="">
            <van-image round style="float: left;margin-right: 20px" width="40" height="40" :src="getImgUrl(first.avatar)" class="topinner" />
            <div class="namebox">
              <div>{{first.nickname}}</div>
              <div>{{first.get_time*1000 | formatDate}}</div>
            </div>
            <div style="float: right;line-height: 40px" class="">{{first.amount}}元</div>
          </div>
        </van-cell>
      </div>
    </van-list>
  </div>
</div>
</template>

<script>
  import api from "../../assets/js/api";
  import back from "../../assets/img/red_packet/back_action_yellow.png";
  import packtop from "../../assets/img/red_packet/red_packet_bg.png";
  import Vue from 'vue';
  import { List } from 'vant';
  import getTime from "../../assets/js/dateCompute";

  Vue.use(List);
  export default {
  name: "packet",
    data(){
      return{
        list: [],
        loading: false,
        finished: false,
        id: this.$route.query.id,
        packtop: packtop,
        back: back,
        myInfo: JSON.parse(sessionStorage.getItem('myInfo')),
        myGet : ''

      }
    },
    methods: {
      //返回
      goBack() {
        this.$router.back()
      },
      async onLoad() {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        let res = await api.checkLucky({
          id : this.id
        })
        if (res.code===200){
          let packList = res.data.list_info
          this.list = packList
          var values = [];
          if (this.list){
            for (var property in packList) {
              values.push(packList[property])
              if (packList[property].id === this.myInfo.id){
                this.myGet = parseFloat(packList[property].amount).toFixed(2)
              }
              // else{
              //     this.myGet = parseFloat(0.00).toFixed(2)
              //   }
            }
          }
        }
        // 加载状态结束
        this.loading = false;
        // this.finished = true;

        if(this.list.length < 15 && this.list.length >= 0){
          this.finished = true;
        }
      },

      //拼接图片url
      getImgUrl(icon) {
        let isImgArr = icon.indexOf('img[')
        if (isImgArr===0){
          const picture = icon.replace("img","").replace("[","").replace("]","");
          return process.env.VUE_APP_API_ROOT+picture;
        }else{
          return process.env.VUE_APP_API_ROOT+icon;
        }
      },
    },
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let year = date.getFullYear()
        let month = date.getMonth()+1
        month = month < 10 ? ('0' + month) : month;
        let day = date.getDate()
        day = day < 10 ? ('0' + day) : day;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
      }
    }
  }
</script>

<style scoped>
  .packytop {
    background-color: #ff684a;
    height: 240px;
    width: 100%;
    float: left;
    /*position: fixed;top: 0;left: 0;*/
    border-radius: 0px 0px 50% 50% / 10px 10px 30% 30%;
  }
  .blessing{
    margin-bottom: 10px;
  }
  .packyfont {
    color: #ffd264;
  }

  .packylist {
    text-align: left;
    width: 100%;
    height: 100%;
    float: left;
  }

  .namebox {
    float: left;
    font-size: 14px;
  }
</style>
