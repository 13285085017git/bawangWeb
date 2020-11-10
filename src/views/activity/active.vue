<template>
<div>
  <div class="topnav">
    <div style="float: left;margin-right: 30px;font-size: 20px;" @click="goBack"><</div>
    <div style="float: left;font-size: 20px;">{{type==='1'?'官方公告':'官方活动'}}</div>
  </div>
  <div class="list">
    <van-list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
    >
      <div v-for="item in list" style="margin: 0 10px 15px;">
        <div style="font-size: 14px;box-shadow: 1px 3px 8px #adaa9a;padding: 10px;border-radius: 0.2rem">
          <div style="text-align: left;margin: 20px 0;font-size: 18px;font-weight: bolder">
            {{item.title}}
          </div>
          <div style="text-align: left;margin: 20px 0;line-height: 18px">{{item.content}}</div>
          <van-image
            v-if="item.img!=''"
            style="margin: 0 0 20px;"
            width="100%"
            fit="contain"
            :src="getImgUrl(item.img)"
          />
          <div style="text-align: right">{{item.created_at*1000 | formatDate}}</div>
        </div>
      </div>
    </van-list>
  </div>
</div>
</template>

<script>
import api from '../../assets/js/api.js'

import Vue from 'vue';
import { List, Image as VanImage } from 'vant';

Vue.use(List);
Vue.use(VanImage);

export default {
name: "active",
  data(){
    return{
      type: this.$route.query.type,
      list: [],
      loading: false,
      finished: false,
    }
  },
  methods:{
    //返回
    goBack() {
      this.$router.back()
    },
    async onLoad() {
      let res = await api.active({
        type: this.type
      })
      this.list = res.data
      // console.log(res)
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1);
      //   }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
       if (this.list.length < 40 && this.list.length >= 0) {
        this.finished = true;
      }
      // }, 1000);
    },
    //拼接图片url
    getImgUrl(icon) {
      return process.env.VUE_APP_API_ROOT+icon;
    },
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      let day = date.getDate();
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      return year + '/' + month + '/' + day + ' ' + h + ':' + m;
    }
  }
}
</script>

<style scoped>
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
  box-shadow: 0px 2px 10px #a5a5a5;
}
.list {
  margin-top: 60px;
  width: 100%;
  float: left;
}
</style>
