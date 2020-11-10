<template>
  <div>
    <div class="chatTop">
      <!--              <span class="iconfont leftInput">&#xe734;</span>-->
      <el-image class="title" @click="goBack" :src="backImg" style="margin-right: 30px;height: 20px;width: 20px"></el-image>
      <div class="title">
        开奖历史
      </div>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
      style="float: left;margin-top: 60px;width: 100%;"
    >
      <van-cell v-for="rel in list" style="padding: 5px 10px;">
        <div class="rel_box">
          <div class="tit_dat">
            <span style="float: left;font-size: 12px;height: 18px;line-height: 18px">{{name}}</span>
            <span class="date">第{{rel.preTurnNum}}期</span>
          </div>
          <div class="rel_num">
            <div class="num" v-for="num in rel.openNum.split(',')">
              {{ num }}
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
  import backImg from '../../assets/img/goback/back2.png';
  import api from "../../assets/js/api";
    export default {
        name: "history",
      data() {
        return{
          list: [],
          loading: false,
          finished: false,
          backImg : backImg,
          code : this.$route.query.code,
          name : this.$route.query.name,
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
            const res = await api.lotteryLog({
              code : this.code
            })
            let data = res.data
            if (data.length < 10) {
              this.finished = true
            }else{
              this.finished = true
              this.loading = false
            }
            this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
            this.list = this.list.concat(data)
            return {
              finished: true
            }
          }, 1000)
        },
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

  .rel_num {
    width: 100%;
    float: left;
    margin: 5px;
    box-sizing: border-box;
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
  .date {
    float: right;
    font-size: 12px;
    text-align: right;
    height: 18px;
    line-height: 18px;
  }
</style>
