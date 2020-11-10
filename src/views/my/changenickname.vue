<template>
    <div>
      <div class="chatTop">
        <span class="iconfont leftInput title" style="font-size: 36px;margin-right: 30px;height: 20px;width: 20px;color: white;line-height: 20px" @click="goBack">&#xe734;</span>
<!--        <div class="title" @click="goBack" style="margin-right: 30px;height: 20px;width: 20px;color: white"><</div>-->
        <div class="title">
          修改昵称
        </div>
      </div>
      <div class="filed">
        <van-form>
          <van-field
            v-model="nickname"
            name="昵称"
            placeholder="输入需修改的昵称"
            style="border-bottom: #ff7a21 1px solid"
          >
          <template style="margin: 16px;border: hidden;border-bottom: #ff7a21 1px solid" #button>
              <van-icon @click="changeNickname" name="success" color="#ff7a21" size="25px" />
          </template>
          </van-field>
        </van-form>
      </div>
    </div>
</template>

<script>
  import backImg from '../../assets/img/goback/back2.png';
  import api from "../../assets/js/api";
  import Vue from 'vue';
  import { Form, Icon, Toast } from 'vant';

  Vue.use(Form);
  Vue.use(Icon);
  Vue.use(Toast);
    export default {
      name: "changenickname",
      data(){
        return{
          backImg : backImg,
          nickname : '',
          myInfo : JSON.parse(sessionStorage.getItem('myInfo')),
        }
      },
      methods:{
        //返回
        goBack() {
          this.$router.back()
        },
        async changeNickname() {
          console.log(this.nickname)
          if (this.nickname != ''){
            let res = await api.edit_nickname({
              nickname : this.nickname
            })
            console.log(res)
            if (res.code === 200){
              Toast.success(res.data);
              this.myInfo.nickname = this.nickname
              sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
              this.$router.back()
            }else{
              Toast.fail(res.message);
            }
          }else{
            Toast.fail("昵称不能为空");
          }
        }
      }
    }
</script>

<style scoped>
  .chatTop {
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
    background-color: #ff7a21;
    float: left;
  }
  .title {
    float: left;
    font-size: 20px;
    font-weight: bold;
    color: white
  }
  .filed{
    box-sizing: border-box;
    margin-top: 60px;
    width: 90%;
  }
  /deep/.van-cell {
    padding: 0;
    margin: 20px;
    float: left;
    box-sizing: border-box;
  }

  /deep/html, body {
    box-sizing: border-box;
    width: 100%;
  }
</style>
