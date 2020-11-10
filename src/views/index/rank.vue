<template>
  <div>
    <div class="chatTop">
      <el-image class="title" @click="goBack" :src="backImg" style="margin-right: 30px;height: 20px;width: 20px"></el-image>
      <div class="title">
        排行榜
      </div>
    </div>
    <div class="rel_box">
      <div class="btn" style="background-color: #f65732;" @click="toNext('day','dama')">
        打码榜
      </div>
      <div class="btn" style="background-color: #2540ef;" @click="toNext('day','integral')">
        积分榜
      </div>
      <div class="btn" style="background-color: #b925ef;" @click="toNext('day','sign')">
        签到榜
      </div>
    </div>
  </div>
</template>

<script>
  import backImg from '../../assets/img/goback/back2.png';
    export default {
        name: "history",
      data() {
        return{
          backImg : backImg,
          visible : true
        }
      },
      methods:{
        //返回
        goBack() {
          this.$router.back()
        },
        toNext(type,rank_type) {
          this.$router.push({path:'/rankTop',query:{type:type,rank_type:rank_type}})
        }
      }
    }
</script>

<style scoped>
  .chatTop {
    text-align: left;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
    z-index: 999;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background-color: #FFFFFF;
    float: left;
  }
  .title {
    float: left;
    font-size: 20px;
    font-weight: bold;
  }

  .rel_box {
    width: 100%;
    float: left;
    margin-top: 60px;
    box-sizing: border-box;
  }
  .btn {
    height: 60px;
    line-height: 60px;
    margin: 20px 10px;
    border-radius: 0.4rem;
    color: #FFFFFF;
    font-size: 20px;
    font-weight: bolder;
  }
  .date {
    float: right;
    font-size: 12px;
    text-align: right;
    height: 18px;
    line-height: 18px;
  }
</style>
