<template>
    <div id="thispage">
      <div class="chatTop">
        <div style="width: 100%;float: left">
          <span class="title" @click="goBack" style="margin-right: 30px;height: 20px;width: 20px;z-index: 999"><</span>
          <div class="title">
            {{type==='cash'?'提现':'积分兑换'}}
          </div>
          <div style="color: #FFFFFF;float: right;line-height: 20px" @click="details(type)">
            明细
          </div>
        </div>
      </div>
      <div class="info">
        <div class="balanceCard">
          <van-image width="100%" :src="txbg">
          </van-image>
          <div class="count">
            <div style="font-size: 50px;font-weight: bolder;color: #9c550a;margin-bottom: 20px">{{type==='cash'?myInfo.account.user_money:myInfo.account.user_integral}}</div>
            <div style="color: #9c550a;font-size: 20px">{{type==='cash'?'账户余额':'积分'}}</div>
          </div>
        </div>
        <div class="getCashForm">
          <van-form @submit="onSubmit" v-if="type==='cash'">
            <van-field
              v-model="number"
              type="number"
              placeholder="提现金额"
            />
            <van-field
              v-model="account"
              placeholder="平台账号"
            />
            <div style="margin: 30px 15px 0 15px;">
              <van-button block color="#ff7d27" type="info" native-type="submit">
                确定提现
              </van-button>
            </div>
          </van-form>
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            v-else
          >
            <div style="float: left;width: 25%;margin: 0 3px" @click="showPopup(intgrail.id,intgrail.amount,intgrail.integral)" :id="intgrail.id" v-for="intgrail in list">
              <van-image style="position: relative;" width="" :src="jf">
                <div style="position: absolute;top: 0;left: 0;line-height: 180px;color: #9c550a;text-align: center;width: 100%">{{intgrail.amount}}</div>
              </van-image>
              <van-image style="position: relative;" width="" :src="jfan">
                <div style="position: absolute;top: 0;left: 0;line-height: 31px;color: #9c550a;text-align: center;width: 100%">{{intgrail.integral}}</div>
              </van-image>
            </div>
          </van-list>
          <van-popup v-model="show" :style="{ width: '70%',borderRadius:'0.4rem' }">
            <div class="changeCard">
              奖励兑换
            </div>
            <div style="text-align: left;" class="changeCard">
              消耗{{ thisAmount }}积分，兑换{{ thisCount }}余额
            </div>
            <div class="changeCard">
              <div style="float: left;" class="changeButtom" @click="change">
                <div style="color: #FFFFFF;background-color: #ff6a25;" class="buttomText">
                  确定兑换
                </div>
              </div>
              <div style="float: right;" class="changeButtom" @click="close">
                <div style="background-color: #bdbdbd;" class="buttomText">
                  我犹豫了
                </div>
              </div>
            </div>
          </van-popup>
        </div>
      </div>
    </div>
</template>

<script>
  import api from '../../assets/js/api'
  import txbg from '../../assets/img/my/txbj.png'
  import jf from '../../assets/img/icon/jf.png'
  import jfan from '../../assets/img/icon/jfan.png'
  import Vue from 'vue';
  import { Form, Field, Toast, Image as VanImage, List, Popup, Dialog } from 'vant';

  Vue.use(Form);
  Vue.use(Field);
  Vue.use(VanImage);
  Vue.use(List);
  Vue.use(Popup);
    export default {
      name: "getCash",
      inject:['reload'],
      data() {
        return{
          myInfo : JSON.parse(sessionStorage.getItem('myInfo')),
          number: '',
          account : '',
          txbg : txbg,
          jf : jf,
          jfan : jfan,
          type : this.$route.query.type,
          list: [],
          loading: false,
          finished: false,
          show: false,
          thisId: '',
          thisAmount: '',
          thisCount: '',
        }
      },
      methods:{
        //返回
        goBack() {
          this.$router.back()
        },
        async onSubmit() {
          if (this.number===''){
            Toast({
              message: '提现金额不能为空',
              position: 'bottom',
              duration : 3000
            });
          }else if(this.account===''){
            Toast({
              message: '平台账号不能为空',
              position: 'bottom',
              duration : 3000
            });
          }else{
            let res = await api.tackCash({
              amount : this.number,
              account : this.account
            })
            console.log(res)
            if (res.code===200){
              this.myInfo.account.user_money = this.myInfo.account.user_money - this.number
              sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
              Toast({
                message: res.data,
                position: 'bottom',
                duration : 5000
              });
              this.reload();
            }else{
              Toast({
                message: res.message,
                position: 'bottom',
                duration : 5000
              });
            }
          }
        },
        details(type) {
          this.$router.push({path:'/useDetail',query:{type:type}})
        },
        async onLoad() {
          // 异步更新数据
          // setTimeout 仅做示例，真实场景中一般为 ajax 请求
          let res = await api.integralList()
          console.log(res)
          this.list = res.data
          // 加载状态结束
          this.loading = false;
          this.finished = true;
          // 数据全部加载完成
          // if (this.list.length <= 40 && this.list>=0) {
          //   this.finished = true;
          // }

        },
        async chageIntegral(id) {
          let res = await api.changeIntegral({
            id: id
          })
          console.log(res)
        },
        showPopup(id,amount,integral) {
          this.thisId = id
          this.thisAmount = integral
          this.thisCount = amount
          this.show = true;
        },
        async change() {
          let res = await api.changeIntegral({
            id: this.thisId
          })
          if (res.code===200){
            Toast({
              message : res.data,
              position: 'bottom'
            })
            this.myInfo.account.user_integral = this.myInfo.account.user_integral - this.thisAmount
            sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
            this.show = false
          }else{
            Toast({
              message: res.message,
              position: 'bottom'
            })
          }
        },
        close() {
          this.show = false
        },
      }
    }
</script>

<style scoped>
  #thispage {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
  }
  .chatTop {
    text-align: left;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    background-color: #ff7d27;
    float: left;
    height: auto;
  }
  .title {
    float: left;
    font-size: 20px;
    font-weight: bold;
    color: white
  }
  .info{
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    float: left;
    padding: 15px;
  }
  .balanceCard{
    width: 100%;
    height: auto;
    border-radius: 0.4rem;
    /*background-color: #ffbf00;*/
    position: relative;
    text-align: left;
    float: left;
  }
  .count {
    box-sizing: border-box;
    margin: 40px 30px;
    float: left;
    /*width: auto;*/
    /*height: auto;*/
    position: absolute;
    top: 0;
    left: 0;
  }
  .getCashForm {
    float: left;
    width: 100%;
    /*height: 100%;*/
    margin-top: 40px;
  }
  /*.van-field {*/
  /*  margin-bottom: 20px;*/
  /*}*/

  .changeCard {
    float: left;
    width: 100%;
    padding: 20px 15px;
    box-sizing: border-box
  }
  .changeButtom {
    text-align: center;
    box-sizing: border-box
  }
  .buttomText {
    border-radius: 0.2rem;
    width: auto;
    padding: 15px 20px;
    box-sizing: border-box;
    box-shadow: 2px 2px 4px #a3a3a3;
  }
</style>
