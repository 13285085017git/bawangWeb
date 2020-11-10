<template>
    <div class="nav">
      <div id="title" class="nav_in">消息</div>
      <div id="sign"  @click="sign">
        <van-image width="35" height="35" :src="signimg" />
      </div>
    </div>
</template>

<script>
  import api from "../assets/js/api";
  import signimg from "../assets/img/icon/sign.png";
  import Vue from 'vue';
  import { Image as VanImage, Toast } from 'vant';

  Vue.use(VanImage);
  Vue.use(Toast);
    export default {
        name: "topNav",
      data() {
          return {
            signimg : signimg
          }
      },
        methods:{
          async sign() {
            let res = await api.sign()
            console.log(res)
            if (res.code === 200){
              Toast({
                message: res.data,
                position: 'bottom',
              });
            }
            else{
              Toast({
                message: res.message,
                position: 'bottom',
              });
            }
          }
        }
    }
</script>

<style scoped>
    .nav {
        width: 100%;
        height: 100%;
        float: left;
        background-color: #ff851b;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }
    .nav_in {
        padding: 20px 15px 15px 15px;
    }
    #title {
        float: left;
        color: #ffffff;
        font-size: 20px;
    }
    #sign {
        float: right;
        color: #ffffff;
        margin: 10px;
     }
</style>
