<template>
    <div id="index">
        <div>
            <div id="member">
                <div class="info">
                  <div style="width: 70px;float: left">
                    <van-uploader
                      :after-read="afterRead"
                      v-model="fileList"
                      :preview-image="false"
                      accept="image/*"
                      preview-size="70px"
                      style="width: 70px"
                    >
                      <el-avatar id="avatar" style="float: left;box-sizing: border-box" :size="70" :src="getImgUrl(myInfo.head_portrait)"></el-avatar>
                    </van-uploader>
                  </div>
                  <div id="memDetail">
                        <div class="detail" style="font-size: 20px;font-weight: bold">
                          {{myInfo.nickname}}
                        </div>
                        <div class="detail">
                            账号：{{myInfo.username}}
                        </div>
                    </div>
                    <div @click="editNickname" style="height:70px;line-height: 70px;text-align: center;font-size: 20px;color: #ff8119;border: hidden;font-weight: bold">></div>
                </div>
                <div class="info level">
                    <div class="lev">
                        等级:{{myInfo.level!=''?myInfo.level:'无'}}
                    </div>
                    <div class="lev">
                        头衔：<span style="color: #e92828">即将上线</span>
                    </div>
                </div>
                <div class="info">
                    <div class="mydata" @click="check('balance')">
                        <span class="infoNum">{{myInfo.account.user_money}}</span>
                        <span class="infoTil">余额</span>
                    </div>
                    <div class="mydata integral" @click="check('intDetail')">
                        <span class="infoNum">{{myInfo.account.user_integral}}</span>
                        <span class="infoTil">积分</span>
                    </div>
                </div>
            </div>
            <div id="cash">
                <div class="cashBtn tackCash" @click="getCash('cash')">
                  <van-image class="bck_img" width="50px" :src="tx" />
                  <div style="float: left;margin-left: 10%">
                    提现
                  </div>

                </div>
                <div class="cashBtn exchange" @click="getCash('integral')">
                  <van-image class="bck_img" width="50px" :src="dh" />
                  <div style="float: left;margin-left: 10%">
                    兑换
                  </div>
                </div>
            </div>
            <div id="other">
<!--                <div class="setting">-->
<!--                    <div class="setTil">系统设置</div>-->
<!--                    <div class="settinBtn" @click="showPopup('shock')">-->
<!--                        <el-image :src="msgzd" class="img"></el-image>-->
<!--                        <span>震动</span>-->
<!--                    </div>-->
<!--                    <div class="settinBtn" @click="showPopup('sound')">-->
<!--                        <el-image :src="msgbgm" class="img"></el-image>-->
<!--                        <span>提示音</span>-->
<!--                    </div>-->
<!--                </div>-->
                <div class="setting">
                    <div class="setTil">安全中心</div>
<!--                    <div class="settinBtn">-->
<!--                        <el-image :src="btn" class="img"></el-image>-->
<!--                        <span>修改密码</span>-->
<!--                    </div>-->
                    <div class="settinBtn" @click="Logout">
                        <el-image :src="btn" class="img"></el-image>
                        <span>安全退出</span>
                    </div>
                </div>
            </div>
          <van-popup v-model="show" round :style="{ height: '280px',width:'180px' }">

          </van-popup>
          <van-popup v-model="showPop" style="width: 70%;border-radius: 0.4rem">
            <div style="text-align: left;padding: 30px 20px;height: 20px;line-height: 20px">
              <div style="float: left;font-size: 14px">
                {{type==="shock"?"震动提醒":"提示音提醒"}}
              </div>
              <van-switch style="float: right;" :value="checked" @input="onInput(type)" size="20px" active-color="#2b669a" inactive-color="#A0A0A0" />
            </div>
          </van-popup>
        </div>
    </div>
</template>

<script>
    // import avatar from '../../assets/img/user/avater.jpg'
    import btn from '../../assets/img/my/tuichu.png'
    import api from "../../assets/js/api";
    import tx from "../../assets/img/my/tx.png";
    import dh from "../../assets/img/my/dh.png";
    import msgbgm from "../../assets/img/my/mdr.png";
    import msgzd from "../../assets/img/my/zhendong.png";
    import { Uploader, Toast, Popup, Switch, Dialog } from "vant";
    import Vue from "vue";

    Vue.use(Uploader);
    Vue.use(Toast);
    Vue.use(Popup);
    Vue.use(Switch);

    export default {
        name: "index",
        data() {
            return {
              myInfo : JSON.parse(sessionStorage.getItem('myInfo')),
              btn : btn,
              tx : tx,
              dh : dh,
              msgbgm : msgbgm,
              msgzd : msgzd,
              fileList : [],
              show : false,
              showPop: false,
              checked: '',
              type: ''
            }
        },
        methods: {
          //拼接图片url
          getImgUrl(icon) {
              return process.env.VUE_APP_API_ROOT+icon;
          },
          async afterRead(file) {
            const data = new FormData()
            data.append('file', file.file)
            let ImgRes = await api.edit_avatar(data)
            if (ImgRes.code===200){
              this.myInfo.head_portrait = ImgRes.data
              sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
              Toast.success('头像更换成功')
            }
          },
          editNickname() {
            this.$router.push({path:'/changenickname'})
          },
            Logout (){
              Dialog.confirm({
                title: '退出当前账号',
                message: '确认退出？',
              })
                .then(() => {
                  // on confirm
                  sessionStorage.clear();
                  Toast.success('退出成功!');
                  this.$router.go(0)
                })
                .catch(() => {
                  // on cancel
                });
            },
          getCash(type) {
            console.log(type)
            this.$router.push({path:'/getCash',query:{type:type}})
          },
          check(type) {
            this.$router.push({path:'/useDetail',query:{type:type}})
          },
          showPopup(type) {
            this.type = type
            if (type==="shock"){
              if (this.myInfo.msg_shock==1){
                this.checked = true
              }else{
                this.checked = false
              }
            }
            if (type==="sound"){
              if (this.myInfo.msg_sound==1){
                this.checked = true
              }else{
                this.checked = false
              }
            }
            this.showPop = true;
          },
          async onInput(checked) {
            console.log(this.checked)
            let res
            res = await api.switchMsg({
              type: checked
            })
            console.log(checked)
            console.log(res)
            if(res.code===200){
              Toast({
                message: res.message,
                position: 'bottom'
              })
              if (checked==="shock"){
                this.myInfo.msg_shock = res.data.msg_shock
              }
              if (checked==="sound"){
                this.myInfo.msg_sound = res.data.msg_sound
              }
              sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
              this.checked = !this.checked
            }
          },
        }
    }
</script>

<style>
    #index {
        height: 100%;
        width: 100%;
        background-color: #e7e3e3;
        position: fixed;
        padding: 20px 8px 20px 8px;
        box-sizing: border-box;
    }
    #member {
        border-radius: 0.8rem;
        height: 220px;
        width: 100%;
        background-color: #FFFFFF;
        /*margin: 20px 8px 20px 8px;*/
        padding: 0 10px 0 10px;
        position: relative;
        box-sizing: border-box;
    }
    .info {
        float: left;
        padding : 15px 0 15px 0;
        height: auto;
        width: 100%;
        position: relative;
    }
    .level {
        border-bottom: #e5e5e5 1px solid;
        border-top: #e5e5e5 1px solid;
    }
    #avatar {
        float: left;
    }
    #memDetail {
        float: left;
        margin-left: 20px;
        text-align: left;
        width: 60%;
      padding: 15px 0 20px 0;
    }
    .detail {
        color: #766f6f;
        font-size: 13px;
      margin-top: 5px;
    }
    .lev {
        font-size: 15px;
        color: #9c9c9c;
        float: left;
        width: 50%;
    }
    .mydata {
        font-size: 15px;
        float: left;
        width: 49%;
        text-align: center;
    }
    .infoTil {
        width: 100%;
        color: #9c9c9c;
        float: left;
    }
    .infoNum {
        width: 100%;
        float: left;
    }
    .integral {
        border-left: #e5e5e5 1px solid;
    }
    #cash {
        float: left;
        width: 100%;
        /*padding: 0 8px 0 8px;*/
        text-align: center;
        margin-top: 20px;
        box-sizing: border-box;
    }
    .cashBtn {
        background-color: #FFFFFF;
        border-radius: 0.6rem;
        height: 50px;
        width: 48%;
        line-height: 50px;
        position: center;
        box-sizing: border-box;
        /*padding: 10px 0 10px 0;*/
        text-align: left;
    }
    .tackCash {
        float: left;
        margin-right: 10px;
    }
    .exchange {
        float: right;
    }
    #other {
        position: center;
        float: left;
        width: 100%;
        height: auto;
        border-radius: 0.6rem;
        text-align: center;
        margin-top: 20px;
        background-color: #FFFFFF;
        padding: 10px;
        box-sizing: border-box;
    }
    .setting {
        float: left;
        padding-bottom: 10px;
        width: 100%;
        height: auto;
        text-align: left;
    }
    .setTil {
        float: left;
        width: 100%;
        height: auto;
        position: center;
    }
    .settinBtn {
        position: center;
        font-size: 12px;
        color: #797070;
        height: 60px;
        width: 50px;
        float: left;
        margin: 10px 40px 0 40px;
        text-align: center;
    }
    .settinBtn span {
        width: 100%;
        float: left;
    }
    .img  {
        width: 40px;
    }
    .msg_box {
        width: 300px;
    }
    .bck_img {
      line-height: 50px;
      float: left;
      margin-left: 20%;
    }
</style>
