<template>
  <div id="thisPage">
    <div class="chatTop" ref="chatTop">
      <!--              <span class="iconfont leftInput">&#xe734;</span>-->
      <el-image class="title" @click="goBack" :src="backImg" style="height: 20px;width: 20px"></el-image>
      <div class="title">
        {{room_name}}
      </div>
    </div>

    <div class="mscroll-container" :class="scrollSmooth?'scrollsmooth':''" ref="morePage">
      <!--    <div class="mscroll-container" style="position: absolute;top: 0;left: 0;bottom: 0;width: 100%" ref="morePage">-->
      <!--      <div class="chat_main" v-cloak :class="scrollSmooth?'scrollsmooth':''" ref="morePage" id="morePage" :style="this.type==='group'?'height: '+groupPageHight+'px;margin-bottom: 120px;':'height: '+pageHight+'px;margin-bottom: 60px;'">-->
      <!--    <div class="chat_main" v-cloak :class="scrollSmooth?'scrollsmooth':''" ref="morePage" id="morePage" :style="this.type==='group'?'height: '+groupPageHight+'px;':'height: '+pageHight+'px;'">-->
      <!--      <div class="chat_main" v-cloak :class="scrollSmooth?'scrollsmooth':''" ref="morePage" id="morePage" :style="{height: groupPageHight+'px'}">-->
      <div class="chat_main" v-cloak id="morePage">

        <div v-show="isShow" class="video_box">
          <iframe :src="this.video" frameborder="0" class="video" scrolling="no"></iframe>
        </div>
        <div v-show="isPlan" class="plan_box">
          <div>
            <div class="plan_list" v-for="plan in this.planList">
              <div class="plan_left">
                <div class="plan_tit" style="float: left">{{plan.nickname}}</div>
                <el-avatar class="avatar" size="large" :src="getImgUrl(plan.avatar)"></el-avatar>
              </div>
              <div class="plan_msg">
                <p v-html="plan.content" style="width: 100%;height: 100%;float: left;">
                  {{plan.content}}
                </p>
                <div v-if="plan.img!=''">
                  <van-image @click="checkImg(plan.img)" :src="getImgUrl(plan.img)"></van-image>
                </div>
              </div>
              <div class="plan_right" :id="plan.m_id" @click="popReward($event)">
                赏
              </div>
            </div>
          </div>
        </div>
        <div v-show="isLottery" v-if="isReloadData" class="lottery_box">
          <div style="height: 20px;width: 100%;float: left;text-align: center;box-sizing: border-box;margin-bottom: 15px">
            <div class="lottery">{{lotteryInfo.name}}</div>
            <div class="lottery">{{lotteryInfo.preTurnNum}}期</div>
            <div class="lottery">共{{lotteryInfo.day_count}}期</div>
            <div class="lottery">当前{{lotteryInfo.today_count}}期</div>
          </div>
          <div style="float: left;height: 30px;width: 100%;margin-bottom: 15px;margin-left: 15px">
            <div style="float: left;margin-right: 5px;color: white;background-color: #f33232;border-radius: 0.4rem;line-height: 30px;width: 30px;height: 30px;text-align: center" v-for="num in lotteryInfo.openNum">{{num}}</div>
          </div>
          <div style="float: right;width: 100%;text-align: right;font-size: 10px;margin-right: 5px">
            开奖倒计时：<span><van-count-down ref="countDown" :auto-start="true" :time="openlotteryTime(lotteryInfo.openTimestamp,lotteryInfo.openInterval)" style="color: #f33232" @finish="finish"/></span>
          </div>
        </div>
        <div style="float: left;width: 100%" >
          <van-loading color="#1989fa" v-show="reload" />
          <ul  class="msg_box" ref="mbox" id="m_box">
            <li class="chat_list van-clearfix"
                :class="isMine(myInfo1.id,chatinfo.id)?'isMine':'other'"
                style="padding-right:5px;"
                v-for="(chatinfo,index) in list"
                :key="index">
              <div v-if="chatinfo.msg_id!=undefined" :id="index">
                <el-avatar class="avatar"
                           :class="isMine(myInfo1.id,chatinfo.id)?'isMine':'other'"
                           size="medium"
                           :src="getImgUrl(chatinfo.avatar)">
                </el-avatar>
                <div class="text_box"
                     :class="isMine(myInfo1.id,chatinfo.id)===true?'mybox':''"
                     :id="index === list.length - 1 ? 'lastMsg':''">
                  <div class="msg_title" :class="isMine(myInfo1.id,chatinfo.id)?'isMine':'other'" :style="isMine(myInfo1.id,chatinfo.id)?`float:right`:`float:unset`">
                    <div class="msg_tit" v-show="myInfo1.id!=chatinfo.id.replace('member_','')">
                      {{chatinfo.username}}
                    </div>
                    <span class="iconfont" style="font-size: 16px;" v-show="isMine(myInfo1.id,chatinfo.id)===true" @click="removeMsg(type==='group'?id:'',chatinfo.msg_id,type,index)" :class="isMine(myInfo1.id,chatinfo.id)?'isMine':'other'">&#xe629;</span>
                    <div class="msg_tit" :class="isMine(myInfo1.id,chatinfo.id)?'isMine':'other'">{{chatinfo.timestamp * 1000 | formatDate}}</div>
                  </div>

                  <div class="msg" v-if="chatinfo.msg_type === '1'" v-html="emojiOn(chatinfo.content)" :style="isMine(myInfo1.id,chatinfo.id)?`float:right`:`float:unset`">
                  </div>

                  <div class="msg" v-else-if="chatinfo.msg_type === '2'">
                    <van-image @click="checkImg(chatinfo.content)" fit="contain" :src="getImgUrl(chatinfo.content)" class="msg" />
                  </div>
                  <div class="msg" v-else-if="chatinfo.msg_type === '3'">
                    <div class="redpack" :id="getRedpackInfo(chatinfo.content).shift()" @click="getRedpackInfo(chatinfo.content).pop()==='运气红包'?luckpackInfo(getRedpackInfo(chatinfo.content).shift()):bigRedpack(getRedpackInfo(chatinfo.content).shift())" data-type="1">
                      <div class="topcontent">
                        <p class="topcontent-content" v-if="getRedpackInfo(chatinfo.content).pop()==='0'">{{getRedpackInfo(chatinfo.content)[1]!='0'?getRedpackInfo(chatinfo.content)[1]:''}}</p>
                        <p class="topcontent-content" v-else>{{getRedpackInfo(chatinfo.content).pop()==='运气红包'?getRedpackInfo(chatinfo.content).pop():''}}</p>
                        <p class="topcontent-content2">{{getRedpackInfo(chatinfo.content)[2]!='0'?getRedpackInfo(chatinfo.content)[2]:''}}</p>
                        <p></p>
                      </div>
                      <div class="redpack-open">
                        <span class="redpack-font">開</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else style="width: auto;text-align: center">
                    <span class="removeMsg">
                      {{chatinfo.content}}
                    </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="TounderBtn" @click="scrollToBottom(true)" v-show="underShow">
          V
        </div>
      </div>
      <div class="chat_footer" ref="chat_footer">
        <div v-if="type==='group'" class="play_box">
          <span class="iconfont menuicon leftInput" @click="lottery">&#xe603;</span>
          <span class="iconfont menuicon leftInput" @click="getPlan()">&#xe7ff;</span>
          <span class="iconfont menuicon leftInput" @click="goVideo()">&#xe613;</span>
          <span class="iconfont menuicon leftInput" @click="popSendpack()">&#xe600;</span>
          <span class="iconfont menuicon leftInput" @click="rewardRank('1')">&#xe632;</span>
          <span class="iconfont menuicon leftInput" @click="rewardRank('')">&#xe665;</span>
        </div>
        <div class="input_box" ref="input_box">
          <div class="input_sub">
            <van-uploader
              :after-read="afterRead"
              v-model="fileList"
              :preview-image="false"
              accept="image/*"
              preview-size="60px"
            >
              <span class="iconfont menuicon leftInput">&#xe630;</span>
            </van-uploader>
            <!--          <div-->
            <!--            class="leftInput"-->
            <!--            ref="content"-->
            <!--            id="content"-->
            <!--            contenteditable="true"-->
            <!--            @input="handleInput"-->
            <!--            @keypress="checkSize"-->
            <!--            @paste="checkSize"-->
            <!--            @compositionStart="handleStart"-->
            <!--            @compositionend="handleEnd"-->
            <!--            style="overflow-y: auto;overflow-x: hidden;background-color: #FFFFFF;border-radius: 1rem"-->
            <!--          >-->
            <!--          </div>-->
            <div
              class="leftInput"
              style="
              float:left;
              width: 70%;
             ">
              <van-field
                v-model="message"
                ref="content"
                autosize
                type="textarea"
                maxlength="100"
                rows="1"
                style="
                background-color: #FFFFFF;
                border-radius: 1rem;
                overflow-y: auto;
                overflow-x: hidden;
                margin-left: 5px;
                max-height: 90px;
                position: relative;
                bottom: 0;
                display: flex;
                flex-direction: column-reverse;
               "
              />
            </div>
            <span @click.stop="vemoji" slot="input" class="iconfont menuicon emojiIcon leftInput">&#xec80;</span>
            <div class="iconfont menuicon" style="border: hidden;background-color: transparent;" @click="sendMsg('',1)">&#xe7d5;</div>
          </div>
          <div @click.stop="" v-show="emojiShow" ref="emojiBox" class="emojiBox">
            <div v-for="(emoji,index) in emojiList" :title="index">
              <div class="emoji" @click="addEmoji(index)" >
                <van-image width="22px" :src="emoji" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="show" round :style="{ height: '350px',width:'230px' }">
      <div class="redpack" data-type="1" style="height:350px;width:230px">
        <div class="topcontent">
          <p class="topcontent-content" style="color:#ffbb00;font-size:20px;font-weight: 1000;">红包</p>
          <p class="topcontent-content2">{{luckPackdata!=''?'累计金额：'+luckPackdata.total:''}}</p>
          <p class="topcontent-content2" :style="luckPackdata!=''?'':'color:#ffbb00;font-size:20px;font-weight: 1000;line-height: 60px;'">{{luckPackdata!=''?'起始金额：'+luckPackdata.start:'恭喜发财，大吉大利'}}</p>
          <p style="text-decoration:underline;" :id="thisRedpack" @click="checkLucky(thisRedpack)">看看别人手气</p>
        </div>
        <div class="redpack-open" :id="thisRedpack" @click="luckPack===false?openRedpack(thisRedpack):getLuckpack(thisRedpack)">
          <span class="redpack-font">開</span>
        </div>
      </div>
      <!--        <div v-else-if="isGet===false" class="redpack" data-type="1" style="height:350px;width:230px">-->
      <!--          <div class="topcontent">-->
      <!--            <p class="topcontent-content">红包已经被抢走啦</p>-->
      <!--            <p></p>-->
      <!--          </div>-->
      <!--        </div>-->
    </van-popup>
    <van-overlay :show="pushRedpack" @click="pushRedpack=false">
      <div class="wrapper" >
        <van-image :src="packBgi" width="80%" style="position:relative;float: left" @click.stop >
          <div style="float: left;position: absolute;top:30%;left: 10%;line-height: 50%;width: 80%">
            <!--            <div style="float: left;width: 100%;padding: 20px;box-sizing: border-box;text-align: left;background-color: #eeeeee;border-bottom: #e0e0e0 solid 1px">发红包</div>-->
            <van-form
              @submit="sendPack"
              style="margin-top: 15%;align-items: center;justify-content: center;"
              label-width="70px"
              label-align="center"
            >
              <!-- 允许输入数字，调起带符号的纯数字键盘 -->
              <van-field
                class="sendPack"
                v-model="amount"
                type="number"
                label="金额"
                :border="false"
              />
              <!-- 允许输入正整数，调起纯数字键盘 -->
              <van-field
                class="sendPack"
                v-model="count"
                type="digit"
                label="个数"
                :border="false"
              />
              <div style="
              padding: 20px 10% 0 10%;
              float: left;
              width: 80%;
              text-align: center;">
                <van-button round block type="info" native-type="submit">
                  发红包
                </van-button>
              </div>
            </van-form>
          </div>
        </van-image>
      </div>
    </van-overlay>
    <!--    <van-popup v-model="pushRedpack" closeable :style="{ height: '300px',width:'240px' }">-->
    <!--      <img :src="packBgi" >-->
    <!--        <div style="float: left;width: 100%;padding: 20px;box-sizing: border-box;text-align: left;background-color: #eeeeee;border-bottom: #e0e0e0 solid 1px">发红包</div>-->
    <!--        <van-form @submit="sendPack">-->
    <!--          &lt;!&ndash; 允许输入数字，调起带符号的纯数字键盘 &ndash;&gt;-->
    <!--          <van-field class="sendPack" v-model="amount" type="number" label="金额" />-->
    <!--          &lt;!&ndash; 允许输入正整数，调起纯数字键盘 &ndash;&gt;-->
    <!--          <van-field class="sendPack" v-model="count" type="digit" label="个数" />-->
    <!--          <div style="margin: 16px;">-->
    <!--            <van-button round block type="info" native-type="submit">-->
    <!--              发送-->
    <!--            </van-button>-->
    <!--          </div>-->
    <!--        </van-form>-->
    <!--    </van-popup>-->
    <van-popup v-model="pushReward" :style="{ height: 'auto',width:'70%',padding:'10px 0'}">
      <van-form @submit="reward">
        <!-- 允许输入数字，调起带符号的纯数字键盘 -->
        <van-field class="sendPack" v-model="rewardAmount" type="number" placeholder="请输入打赏金额"/>
        <div style="margin: 16px;">
          <van-button style="border-radius: 0.4rem;background-color: orangered;border: hidden" block type="info" native-type="submit">
            豪气打赏
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import backImg from '../../assets/img/goback/back2.png';
import packBgi from '../../assets/img/red_packet/yqhb_dialog_bg.png';
import api from "../../assets/js/api";
import {isHttp} from "../../assets/js/Encapsulation";
import getTime from "../../assets/js/dateCompute";
import { VEmojiPicker } from 'v-emoji-picker';
import { Overlay, ImagePreview, Field, Uploader, Toast, Dialog, CountDown, List, Collapse, CollapseItem, Image as VanImage } from "vant";
import { mapActions, mapState } from 'vuex';
import weixiao from '../../assets/img/emoji/face/weixiao.gif';

Vue.use(List);
Vue.use(Uploader);
Vue.use(CountDown);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(VanImage);
Vue.use(Field);
Vue.use(ImagePreview);
Vue.use(Overlay);

export default {
  name: "chat",
  components: {
    VEmojiPicker,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  inject:['reload'],
  props:{
    value: {
      default: undefined,
    }
  },
  computed: {
    myInfo1(){
      return this.myInfo;
    },
    ...mapState({
      chartMessage: 'chartMessage',
      getMessageNum: 'messageNum'
    })
  },
  watch: {
    chartMessage (redata, vl) {
      let newObj = {}
      if (redata.type === 'message' && redata.id === this.id) {
        newObj.avatar = redata.avatar
        newObj.content = redata.content
        newObj.msg_id = redata.cid
        newObj.id = redata.from_id
        if (redata.msg_type===3){
          redata.msg_type = "3"
        }
        newObj.msg_type = redata.msg_type
        newObj.timestamp = redata.time
        newObj.username = redata.username
        newObj.type = redata.type
        this.list.push(newObj)
        this.readMsg()
      }
      if (redata.type === 'cmd' && redata.order === 'redpackage' || redata.order === 'revoke_message'){
        // console.log('撤销')
        if (parseInt(redata.id)===parseInt(this.id)){
          newObj.content = redata.content
          this.list.push(newObj)
        }
      }
      if (this.$refs.morePage.scrollHeight-(this.$refs.morePage.scrollTop + this.$refs.morePage.clientHeight) < 10){
        this.scrollToBottom()
      }
    }
  },

  data () {
    return {
      list: [],
      groupPageHight: 0,
      pageHight: screen.availHeight-120,
      scrollSmooth: false,
      underShow: false,
      loading: false,
      finished: false,
      refreshing: false,
      maxPage: 0,
      maxLength: 10,
      contentText: '',
      inputOver: false,
      pageNum: 1,
      noMoreMsg: false,
      canReadNum: JSON.parse(sessionStorage.getItem('settings')).allow_chat_log_count,
      isHttp,
      api,
      getTime,
      id: this.$route.query.id,
      room_name: this.$route.query.name,
      type: this.$route.query.type,
      isShow: false,
      isPlan: false,
      isLottery : false,
      video: '',
      planList: [],
      backImg: backImg,
      packBgi: packBgi,
      contentLine: 0,
      upload_url: '../../assets/img/upload',
      imageData: [], // 准备保存的图片列表,
      fileList : [],
      show : false,
      Redpack : [],
      thisRedpack:'',
      myInfo : [],
      websoket: null,
      status : true,
      luckPack : false,
      luckPackdata : [],
      pushRedpack : false,
      isGet : true,
      amount : '',
      count : '',
      pushReward : false,
      rewardAmount : '',
      manager : '',
      lotteryInfo : [],
      // 刷新标识
      isReloadData: true,
      disconnect_time: '',
      revokeMsg: [],
      emojiShow: false,
      activeNames: '',
      scroll : '',
      message: '',
      firstHight: '',
      over : false,
      reload : false,
      scrollHeight : '',
      afterScroll : '',
      emojiList: {
        //小黄人表情
        "face[weixiao]": require('../../assets/img/emoji/face/weixiao.gif'),
        "face[xixi]": require('../../assets/img/emoji/face/xixi.gif'),
        "face[haha]": require('../../assets/img/emoji/face/haha.gif'),
        "face[keai]": require('../../assets/img/emoji/face/keai.gif'),
        "face[kelian]": require('../../assets/img/emoji/face/kelian.gif'),
        "face[wabi]": require('../../assets/img/emoji/face/wabi.gif'),
        "face[chijing]": require('../../assets/img/emoji/face/chijing.gif'),
        "face[haixiu]": require('../../assets/img/emoji/face/haixiu.gif'),
        "face[jiyan]": require('../../assets/img/emoji/face/jiyan.gif'),
        "face[bizui]": require('../../assets/img/emoji/face/bizui.gif'),
        "face[bishi]": require('../../assets/img/emoji/face/bishi.gif'),
        "face[aini]": require('../../assets/img/emoji/face/aini.gif'),
        "face[lei]": require('../../assets/img/emoji/face/lei.gif'),
        "face[touxiao]": require('../../assets/img/emoji/face/touxiao.gif'),
        "face[qinqin]": require('../../assets/img/emoji/face/qinqin.gif'),
        "face[shengbing]": require('../../assets/img/emoji/face/shengbing.gif'),
        "face[taikaixin]": require('../../assets/img/emoji/face/taikaixin.gif'),
        "face[baiyan]": require('../../assets/img/emoji/face/baiyan.gif'),
        "face[youhengheng]": require('../../assets/img/emoji/face/youhengheng.gif'),
        "face[zuohengheng]": require('../../assets/img/emoji/face/zuohengheng.gif'),
        "face[xu]": require('../../assets/img/emoji/face/xu.gif'),
        "face[shuai]": require('../../assets/img/emoji/face/shuai.gif'),
        "face[weiqu]": require('../../assets/img/emoji/face/weiqu.gif'),
        "face[tu]": require('../../assets/img/emoji/face/tu.gif'),
        "face[haqian]": require('../../assets/img/emoji/face/haqian.gif'),
        "face[baobao]": require('../../assets/img/emoji/face/baobao.gif'),
        "face[nu]": require('../../assets/img/emoji/face/nu.gif'),
        "face[yinwen]": require('../../assets/img/emoji/face/yinwen.gif'),
        "face[chanzui]": require('../../assets/img/emoji/face/chanzui.gif'),
        "face[baibai]": require('../../assets/img/emoji/face/baibai.gif'),
        "face[sikao]": require('../../assets/img/emoji/face/sikao.gif'),
        "face[han]": require('../../assets/img/emoji/face/han.gif'),
        "face[kun]": require('../../assets/img/emoji/face/kun.gif'),
        "face[shui]": require('../../assets/img/emoji/face/shui.gif'),
        "face[qian]": require('../../assets/img/emoji/face/qian.gif'),
        "face[shiwang]": require('../../assets/img/emoji/face/shiwang.gif'),
        "face[ku]": require('../../assets/img/emoji/face/ku.gif'),
        "face[se]": require('../../assets/img/emoji/face/se.gif'),
        "face[heng]": require('../../assets/img/emoji/face/heng.gif'),
        "face[guzhang]": require('../../assets/img/emoji/face/guzhang.gif'),
        "face[yun]": require('../../assets/img/emoji/face/yun.gif'),
        "face[beishang]": require('../../assets/img/emoji/face/beishang.gif'),
        "face[zhuakuang]": require('../../assets/img/emoji/face/zhuakuang.gif'),
        "face[heixian]": require('../../assets/img/emoji/face/heixian.gif'),
        "face[yinxian]": require('../../assets/img/emoji/face/yinxian.gif'),
        "face[numa]": require('../../assets/img/emoji/face/numa.gif'),
        "face[hufen]": require('../../assets/img/emoji/face/hufen.gif'),

        //非小黄人表情
        "face[xin]": require('../../assets/img/emoji/face/xin.gif'),
        "face[shangxin]": require('../../assets/img/emoji/face/shangxin.gif'),
        "face[zhutou]": require('../../assets/img/emoji/face/zhutou.gif'),
        "face[xiongmao]": require('../../assets/img/emoji/face/xiongmao.gif'),
        "face[tuzi]": require('../../assets/img/emoji/face/tuzi.gif'),
        "face[ok]": require('../../assets/img/emoji/face/ok.gif'),
        "face[ye]": require('../../assets/img/emoji/face/ye.gif'),
        "face[good]": require('../../assets/img/emoji/face/good.gif'),
        "face[NO]": require('../../assets/img/emoji/face/NO.gif'),
        "face[zan]": require('../../assets/img/emoji/face/zan.gif'),
        "face[lai]": require('../../assets/img/emoji/face/lai.gif'),
        "face[ruo]": require('../../assets/img/emoji/face/ruo.gif'),
        "face[caonima]": require('../../assets/img/emoji/face/caonima.gif'),
        "face[shenma]": require('../../assets/img/emoji/face/shenma.gif'),
        "face[jiong]": require('../../assets/img/emoji/face/jiong.gif'),
        "face[fuyun]": require('../../assets/img/emoji/face/fuyun.gif'),
        "face[geili]": require('../../assets/img/emoji/face/geili.gif'),
        "face[weiguan]": require('../../assets/img/emoji/face/weiguan.gif'),
        "face[weiwu]": require('../../assets/img/emoji/face/weiwu.gif'),
        "face[aoteman]": require('../../assets/img/emoji/face/aoteman.gif'),
        "face[liwu]": require('../../assets/img/emoji/face/liwu.gif'),
        "face[zhong]": require('../../assets/img/emoji/face/zhong.gif'),
        "face[huatong]": require('../../assets/img/emoji/face/huatong.gif'),
        "face[lazhu]": require('../../assets/img/emoji/face/lazhu.gif'),
        "face[dangao]": require('../../assets/img/emoji/face/dangao.gif'),
      },
    }
  },
  methods: {

    //返回
    goBack() {
      this.$router.back()
    },

    vemoji () {
      if (this.emojiShow) {
        console.log('111')
        console.log(this.$refs.emojiBox.clientHeight)
        // this.groupPageHight = document.documentElement.clientHeight-(this.$refs.chat_footer.clientHeight+this.$refs.chatTop.clientHeight)+167
        this.emojiShow = false
      } else {
        console.log('222')
        console.log(this.$refs.emojiBox.clientHeight)
        console.log(this.$refs.emojiBox.scrollHeight)
        console.log(this.$refs.chat_footer.clientHeight)
        // this.groupPageHight = document.documentElement.clientHeight-(this.$refs.chat_footer.clientHeight+this.$refs.chatTop.clientHeight)-167
        this.emojiShow = true
        // if (this.$refs.morePage.scrollHeight-(this.$refs.morePage.scrollTop + this.$refs.morePage.clientHeight) < 10){
        this.scrollToBottom()
        // }
      }
    },

    openEmojiList() {
      if (this.activeNames=''){
        this.activeNames = '1'
      }else{
        this.activeNames=''
      }
    },

    async onLoad () {
      this.loading = true
      // setTimeout(async () => {
      this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
      let data = await this.getMoreChat()
      // let data = await this.getchat()
      // console.log(this.$refs.morePage.scrollHeight)
      this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
      this.scroll = this.$refs.morePage.scrollHeight
    },

    async readMsg() {
      if (this.getMessageNum){
        if (this.type==='group') {
          this.getMessageNum.room.find((obj)=>{
            if (obj.id === this.$route.query.id){
              obj.num = 0
            }
          })
        }
        else{
          const res = await api.readMsg({
            id : this.$route.query.id
          })
          this.getMessageNum.helpers.find((obj)=>{
            if (obj.id === this.$route.query.id){
              obj.un_read_count = 0
            }
          })
        }
      }
    },

    //获取更多聊天记录
    async getMoreChat(id) {
      this.over = false;  //防止重复加载
      this.reload = true//加载组件显示
      /**
       * 记录每次加载之前滚动条位置
       * @type {Vue | Element | Vue[] | Element[]}
       */
      if(this.maxPage != 0){
        this.$nextTick(() => {
          let node = this.$refs.mbox;
          this.scrollHeight = node.scrollHeight;
          console.log("加载前滚动条高度: " + this.scrollHeight)
        })
      }
      let obj = {}
      obj.id = this.$route.query.id
      obj.type = this.$route.query.type
      if (id) {
        obj.top_id = id
      }
      //调用接口获取聊天记录
      const res = await api.chatHistory(obj)
      const data = res.data
      //聊天记录获取成功asd
      if(res.code===200) {
        this.maxPage += 1//加载页数
        this.list = data.reverse().concat(this.list)//将数据倒序且拼接
        this.reload = false//停止加载动画
        if(this.maxPage === 1){
          this.scrollToBottom()//列表置底
          this.$nextTick(() => {
            let node = this.$refs.mbox;
            this.scrollHeight = node.scrollHeight;
          })
        }else{
          //处理加载更多历史数据 滚动条位置
          this.$nextTick(() => {
            let newPageHNode = this.$refs.mbox;
            let newPageH = newPageHNode.scrollHeight;
            let newPageHNode1 = this.$refs.morePage;
            this.afterScroll = newPageH - this.scrollHeight - 30
            newPageHNode1.scrollTo(0,newPageH - this.scrollHeight - 30);
          })
        }
        if(this.maxPage >= this.canReadNum || res.data.length < 15){
          this.finished = true;
          let end = {};
          end.msg_type = 0
          end.content = '暂无更多聊天记录'
          this.list.unshift(end)
          this.over = true
          this.reload = false
          return;
        }
      }
    },

    checkImg(imgSrc) {
      ImagePreview([this.getImgUrl(imgSrc)]);
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

    //点击按钮弹框并播放视频
    async goVideo(){
      this.isPlan = false
      this.isLottery = false
      this.isShow = !this.isShow;
      this.pushRedpack = false
      let res = await api.roomInfo({
        room_id : this.id
      })
      this.video = process.env.VUE_APP_API_ROOT+res.data.lottery_video;
    },

    emojiOn (msg) {
      //消息进入
      //判断是否是表情
      let res
      //是表情,筛选过滤输出img
      let newMsg
      newMsg = msg.replace(/face\[(\w+)\]/g,(str)=>{
        // const newStr = str.replace(/face\[(\w+)\]/g,'$1')
        if (str in this.emojiList) {
          return '<img title="'+str+'" src="'+this.emojiList[str]+'"/>'
        }else{
          return str
        }
      })
      res = newMsg
      // newMsg = msg.replace(/face\[(\w+)\]/g,'&face[$1]&').split('&')
      // if(msg.includes("face[")){
      //   let newMsg
      //   // newMsg = msg.replace(/face\[(\w+)\]/g,'&face[$1]&').split('&')
      //   newMsg = msg.replace(/face\[(\w+)\]/g,(str)=>{
      //     const newStr=str.replace('face[','').replace(']','')
      //     console.log(newStr)
      //     return '<img src="'+this.emojiList[newStr]+'"/>'
      //   })
      //   console.log(newMsg)
      //     // .split('&')
      //   // for(var i = 0;i<newMsg.length;i++){
      //   //   if(newMsg[i]==''||newMsg[i]==null||typeof(newMsg[i])==undefined){
      //   //     newMsg.splice(i,1);
      //   //     i=i-1;
      //   //       if (newMsg[i] in this.emojiList){
      //   //         // console.log(newMsg[i])
      //   //         // console.log(this.emojiList[newMsg[i]])
      //   //         // newMsg[i] = '<van-image :src="`this.emojiList[newMsg[i]]`" />'
      //   //         newMsg[i] = this.emojiList[newMsg[i]]
      //   //       }
      //   //   }
      //     // else{
      //     //   if (newMsg[i] in this.emojiList){
      //     //     newMsg[i] = this.emojiList.newMsg[i]
      //     //     console.log(this.emojiList.newMsg[i])
      //     //   }
      //     //   // newMsg[i] = newMsg[i].replace(/face\[(\w+)\]/g,'$1')
      //     //   //     let asd = require(`../../assets/img/emoji/face/${newMsg[i]}.gif`)
      //     //   //     newMsg[i] = asd
      //     // }
      //   // }
      //   // console.log(newMsg);
      //   res = {type:1,data:newMsg}
      //   // res = newMsg
      // }
      // //不是表情直接输出
      // else{
      //   res = {type:2,data:msg}
      // }
      return res
    },

    // checkinput(e) {
    //   // console.log(screen.availHeight)
    //   // if (this.contentLine=0){
    //   //
    //   // }
    //   // this.contentLine = this.$refs.input_box.clientHeight;
    //   // console.log(this.$refs.input_box.clientHeight)
    //   // console.log(this.contentLine)
    //   // console.log(this.$refs.input_box.clientHeight>this.contentLine)
    //   // if (this.$refs.input_box.clientHeight>this.contentLine){
    //   //   console.log('q111')
    //   //   console.log(this.groupPageHight)
    //   //   this.groupPageHight = parseInt(this.groupPageHight) - parseInt(this.$refs.input_box.clientHeight)
    //   // }
    //   this.groupPageHight = document.documentElement.clientHeight-(this.$refs.chat_footer.clientHeight+this.$refs.chatTop.clientHeight)
    //   // console.log(this.$refs.content.clientHeight)
    //   // console.log(e)
    //
    //   // this.$nextTick(() => {
    //   //   this.$refs.content.scrollTop = this.$refs.content.scrollHeight - this.$refs.content.clientHeight
    //   // })
    //   // if (this.$refs.content.clientHeight){
    //   //
    //   // }
    // },

    //点击发送按钮发送信息给对方|房间
    async sendMsg(msg,msgType) {
      let isMsg
      if (msgType === 1){
        isMsg = this.message
      }else{
        isMsg = msg
      }
      if (isMsg!=""){
        let res = await api.sendMsg({
          type : this.type,
          to : this.id,
          content : isMsg,
          msgType : msgType,
        })
        if (res.code===200){
          let newObj = {}
          if (this.type==='friend'){
            newObj.avatar = this.myInfo.head_portrait
            newObj.content = isMsg
            newObj.msg_id = res.data
            newObj.msg_type = "" + msgType
            newObj.id = 'member_'+this.myInfo.id
            newObj.timestamp = "" + parseInt(new Date().getTime() /1000)
            newObj.nickname = this.myInfo.nickname
            let arr = this.getMessageNum
            if (this.type==='group'){
              arr['room'].forEach(item => {
                this.$set(item, 'num', 0)
              })
            }
            if (this.type==='friend'){
              for (var i=0;i<arr['helpers'].length;i++){
                if (arr['helpers'][i].id===this.id){
                  this.$set(arr['helpers'][i], 'last_msg', newObj.content)
                  this.$set(arr['helpers'][i], 'time', newObj.timestamp)
                  this.$set(arr['helpers'][i], 'un_read_count', '0')
                }
              }
            }
            this.list.push(newObj)
          }
          this.scrollToBottom()
          // this.emojiShow = false
          // document.getElementById('content').innerHTML = ""
          this.message = ""
        }else {
          Toast.fail('消息发送失败,稍后重试')
        }
      }else{
        Toast.fail('不能发送空消息!')
      }
    },

    addEmoji(emoji) {
      this.message = this.message + emoji
    },


    scrollToBottom (click) {
      if (click){
        this.scrollSmooth = true
      }
      this.$nextTick(() => {
        // const soTop = parseInt(this.$refs.morePage.scrollTop)
        this.$refs.morePage.scrollTop = this.$refs.morePage.scrollHeight - this.$refs.morePage.clientHeight
        this.scrollSmooth = false
      })
    },

    async removeMsg(isGroup,msgId,type,divKey) {
      await Dialog.confirm({
        title: '消息撤回',
        message: '撤回消息？',
      }).then(() => {
        // on confirm
        let removeRes = api.revokeMsg({
          room_id : isGroup,
          msg_id : msgId,
          type : type
        })
        removeRes.then(res => {
          if (res.code===200){
            this.list.splice(divKey,1)
          }
        })
      }).catch(() => {
        // on cancel
      });
    },

    async afterRead(file) {
      const data = new FormData()
      data.append('file', file.file)
      let ImgRes = await api.sendImg(data)
      if (ImgRes.code===200){
        let msgImg = 'img['+ImgRes.data+']'
        this.sendMsg(msgImg,'2')
        Toast.success('上传成功')
      }else {
        Toast.fail('上传失败,请稍后重试')
      }
    },

    async getPlan() {
      this.isShow = false;
      this.isLottery = false;
      this.isPlan = !this.isPlan;
      this.pushRedpack = false;
      let res = await api.roomPlan({
        room_id : this.id
      })
      // for (var i =0 ;i<res.data.length;i ++){
      //   console.log(res.data.i.content);
      // }
      if (res.code === 200){
        this.planList=res.data;
      }
    },

    lottery() {
      this.isShow = false;
      this.isPlan = false;
      this.isLottery = !this.isLottery;
      this.pushRedpack = false;
      this.lotteryData()
    },

    async lotteryData() {
      let res = await api.roomLottery({
        room_id : this.id
      })
      if (res.code===200){
        let result = await api.lotteryLog({
          code : res.data.code
        })
        var onther = result.data.shift()
        var lottery = res.data
        lottery.curTurnNum = onther.curTurnNum
        lottery.openNum = onther.openNum.split(',')
        lottery.openTimestamp = onther.openTimestamp
        lottery.openInterval = onther.openInterval
        lottery.preTurnNum = onther.preTurnNum
        this.lotteryInfo = lottery
      }else{
        // console.log('1221111111')
      }
    },

    openlotteryTime(openTimestamp,openInterval) {
      var nowtime = new Date();
      if ((Number(openTimestamp) + Number(openInterval))*1000 > nowtime.getTime()){
        var openTime = parseInt(((Number(openTimestamp) + Number(openInterval))*1000 - nowtime.getTime()));
      }else{
        var openTime = openInterval * 1000
      }
      return openTime
    },

    finish() {
      this.$nextTick(() => {
        this.lotteryData()
        this.reload()
      })
    },

    async bigRedpack(redPackId) {
      this.luckPack = false;
      this.luckPackdata = [];
      this.show = true;
      this.thisRedpack = redPackId
    },
    getRedpackInfo(packStr) {
      let Redpack = packStr.replace("redpackage[","").replace("]","").split("_")
      return Redpack
    },
    async openRedpack(redPackId) {
      let res = await api.getRedPackage({
        id: redPackId
      })
      if (res.code === 200){
        let money = res.data.replace("抢到了","").replace("元","")
        this.myInfo.account.user_money = (parseFloat(this.myInfo.account.user_money) + parseFloat(money)).toFixed(2)
        sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
        Toast.success(res.data);
        this.$router.push({path:'/packet',query:{id:redPackId}})
      }
      if (res.code === 400){
        Toast.fail(res.message);
      }
    },
    async luckpackInfo(redPackId) {
      this.luckPack = true;
      let res = await api.luckpackInfo({
        id: redPackId
      })
      if (res.data.data.is_get===0){
        this.isGet = true
      }else{
        this.isGet = false
      }
      if (res.code === 200){
        this.show = true;
        this.luckPackdata = res.data.data
        this.thisRedpack = redPackId
      }
    },
    async getLuckpack(redPackId) {
      let res = await api.getLuckpack({
        id: redPackId
      })
      this.myInfo.account.user_money = (parseFloat(this.myInfo.account.user_money) - parseFloat(this.luckPackdata.start)).toFixed(2)
      sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
      if (res.code === 200){
        this.myInfo.account.user_money = (parseFloat(this.myInfo.account.user_money) + parseFloat(res.data.amount)).toFixed(2)
        sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
        // this.isGet = false
        Toast.success(res.message);
      }else if(res.code === 402){
        this.luckPackdata.total = (parseFloat(this.luckPackdata.total) + parseFloat(this.luckPackdata.start)).toFixed(2)
        Toast.fail(res.message);
        this.$router.push({path:'/packet',query:{id:packyid}})
      }else{
        Toast.fail(res.message);
      }
    },

    checkLucky(packyid) {
      this.$router.push({path:'/packet',query:{id:packyid}})
    },

    popSendpack(){
      this.isShow = false;
      this.isLottery = false;
      this.isPlan = false;
      this.pushRedpack = true
    },
    async sendPack(){
      let amount = this.amount
      let count = this.count
      let room_id = this.id
      this.amount = ''
      this.count = ''
      if (amount===''){
        Toast.fail( '金额不能为空')
        return
      }else if (count===''){
        Toast.fail('数量不能为空')
        return
      }
      let res = await api.sendRedpack({
        amount : amount,
        count : count,
        room_id : room_id
      })
      if (res.code === 200){
        this.myInfo.account.user_money = this.myInfo.account.user_money - amount
        sessionStorage.setItem('myInfo', JSON.stringify(this.myInfo));
        this.pushRedpack = false
        Toast.success('发送成功!');
        this.scrollToBottom()
      }else{
        Toast.fail(res.message);
      }
    },

    // initWebSocket () {
    //   console.log('第一次进web')
    //   const url = 'ws://qq.pzgg668.com:8585/'
    //   this.websoket = new WebSocket(url)
    //   if (this.websoket) {
    //     this.websoket.onmessage = this.websocketonmessage
    //     this.websoket.onopen = this.websocketonopen
    //     this.websoket.onerror = this.websocketonerror
    //     this.websoket.onclose = this.websocketclose
    //   }
    // },
    // websocketonopen () { // 连接建立之后执行send方法发送数据
    //   console.log("WebSocket连接成功");
    //   if (this.soketTimes) {
    //     clearInterval(this.soketTimes)
    //   }
    //   this.soketTimes = setInterval(() => {
    //     this.websocketsend('ping')
    //   }, 24000)
    // },
    //
    // async websocketonmessage (e) { // 数据接收
    //   const redata = JSON.parse(e.data)
    //   if (redata.type === 'message' && parseInt(redata.room_id) === parseInt(this.$route.query.id)) {
    //     console.log('消息')
    //     let newObj = {}
    //     // newObj = redata
    //     newObj.avatar = redata.avatar
    //     newObj.content = redata.content
    //     newObj.msg_id = redata.cid
    //     newObj.id = redata.from_id
    //     newObj.msg_type = redata.msg_type
    //     newObj.timestamp = redata.time
    //     newObj.username = redata.username
    //     this.list.push(newObj)
    //   }
    //   if (redata.type === 'cmd' && this.status) {
    //     this.status = false
    //     this.websocketsend(JSON.stringify({ type: 'init' }))
    //     let res = await api.bind({
    //       client_id: redata.client_id
    //     })
    //     if (res.code===200){
    //       if (this.disconnect_time!=''){
    //         await api.reconnect({
    //           disconnect_time: this.disconnect_time
    //         })
    //       }
    //     }
    //     console.log(res)
    //   } else {
    //     this.websocketsend(JSON.stringify({ type: 'cmd' }))
    //     let newObj = {}
    //     newObj.avatar = redata.avatar
    //     newObj.content = redata.content
    //     newObj.msg_id = redata.cid
    //     newObj.id = redata.from_id
    //     if (redata.msg_type===3){
    //       redata.msg_type = "3"
    //     }
    //     newObj.msg_type = redata.msg_type
    //     newObj.timestamp = redata.time
    //     newObj.username = redata.username
    //     this.list.push(newObj)
    //     console.log(this.list);
    //   }
    // },
    // websocketsend (Data) { // 数据发送
    //   this.websoket.send(Data)
    // },
    // websocketclose (e) { // 关闭
    //   this.disconnect_time = Date.parse(new Date())/1000
    //   clearInterval(this.soketTimes)
    // },
    // websocketonerror () { // 连接建立失败重连
    //   this.disconnect_time = Date.parse(new Date())/1000
    //   // console.log(this.disconnect_time)
    //   if (this.close) {
    //     this.initWebSocket()
    //   }
    // },


    isMine (myId,other){
      let otherId
      if (other!=undefined){
        otherId = other.replace('member_','')
      }
      if (myId===otherId){
        return true
      }else{
        return false
      }
    },
    popReward (btn){
      this.pushReward = true
      this.manager = btn.currentTarget.id
    },
    async reward() {
      let amount = this.rewardAmount
      let res = await api.reward({
        mid: this.manager,
        reward : amount
      })
      if (res.code === 200){
        this.pushReward = false
        Toast.success(res.data);
      }else{
        Toast.fail(res.message);
      }
    },
    rewardRank(isMember) {
      this.$router.push({path:'/rewardRank',query:{isMember:isMember}})
    }
  },

  created() {
    this.onLoad()
    this.readMsg()
  },
  mounted() {
    let container = this.$refs.morePage
    container.addEventListener('scroll', (e) => {
      if(e.target.scrollTop  === 0 && this.finished != true){
        this.getMoreChat(this.list[0].msg_id)
      }
      if(e.target.scrollTop < (this.scrollHeight-this.afterScroll) && this.afterScroll!=''){
        this.underShow = true
      }else{
        this.underShow = false
      }
    })
    // this.groupPageHight = document.documentElement.clientHeight-(this.$refs.chat_footer.clientHeight+this.$refs.chatTop.clientHeight)

  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      return h + ':' + m;
    },
  },
}
</script>

<style scoped>
[v-cloak] {
  display: none !important;

}

/deep/body {
  width: 100%;
  height: 100%;
}

#thisPage {
  overflow: hidden;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.sendPack {
  float: left;
  margin-bottom: 20px;
  font-size: 18px;
}

#thisPage {
  width: 100%;
  height: 100%;
  position: inherit;
}

/deep/.van-cell{
  background-color: unset;
  width: unset;
  /*float: left;*/
  /*font-size: 25px;*/
  /*margin-top: 5px;*/
  /*padding: unset;*/
  /*width: 10%;*/
}

.scrollsmooth{
  scroll-behavior:smooth
}

.play_box {
  background-color: #ffffff;
  width: 100%;
  min-height: 60px;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
  margin-top: -0px; /* footer高度的负值 */
  height: 50px;
  clear: both;
  float: left;
}

.input_box {
  background-color: #e8e8e8;
  width: 100%;
  min-height: 60px;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
  margin-top: -0px; /* footer高度的负值 */
  height: auto;
  clear: both;
  float: left;
}

.input_sub{
  float: left;
  margin-bottom: 5px;
  width: 100%;
}

.emojiBox{
  float: left;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 165px;
  background-color: #f0f0f0;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
}

.emoji{
  float: left;
  margin: 10px;
}

/*.chatTop {*/
/*  text-align: left;*/
/*  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.2);*/
/*  padding: 20px 0 20px 0;*/
/*  box-sizing: border-box;*/
/*  z-index: 999;*/
/*  position: fixed;*/
/*  width: 100%;*/
/*  height: auto;*/
/*  top: 0;*/
/*  left: 0;*/
/*  background-color: #FFFFFF;*/
/*  float: left;*/
/*  display: block;*/
/*}*/

.chatTop {
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.2);
  padding: 20px 0 20px 0;
  box-sizing: border-box;
  z-index: 999;
  position: fixed;
  width: 100%;
  height: 60px;
  top: 0;
  left: 0;
  background-color: #FFFFFF;
  float: left;
  display: block;
}

.chat_main{
  font-size: 0.5rem;
  position: relative;
}

.mscroll-container {
  position: fixed;
  /*padding:0.24rem 0.24rem 0rem 0.24rem;*/
  top: 0;
  bottom: 0;
  height: auto;
  width:100%;
  background-color: #f5f5f5;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 60px;
  margin-bottom: 130px;
}

/*.chat_main{*/
/*  float: left;*/
/*  height: auto;*/
/*  width: 100%;*/
/*  margin-top: 60px;*/
/*  overflow-x: hidden;*/
/*  overflow-y: auto;*/
/*  !*position: fixed;*!*/
/*  background-color: #f5f5f5;*/
/*}*/

.chat_footer {
  max-height: 300px;
  line-height: 24px;
  font-size: 20px;
  position: fixed;
  width: 100%;
  bottom: 0;
  /*overflow-x: auto;*/
  vertical-align: middle;
}

/*.chat_footer {*/
/*  float: left;*/
/*  min-height: 60px;*/
/*  !*max-height: 277px;*!*/
/*  height: auto;*/
/*  !*position: fixed;*!*/
/*  !*bottom: 0;*!*/
/*  width: 100%;*/
/*}*/

.van-list{
  height: 100%;
}

.title {
  height: 20px;
  float: left;
  margin-left: 20px;
}

.avatar {
  float: left;
}

.chat_list {
  width: 100%;
  height: auto;
  margin: 15px 0;
  /*overflow: hidden;*/
  position: relative;
  line-height: 22px;
  word-break: break-all;
  box-sizing:border-box;
  display: block;
  /*font-size: 0;*/
}

.TounderBtn {
  position: fixed;
  bottom: 20%;
  right: 5%;
  width: 40px;
  height: 40px;
  box-shadow: 0px 2px 3px #b1b1b1;
  border-radius: 4rem;
  background-color: #6291bf;
  color: #FFFFFF;
  font-size: 16px;
  text-align: center;
  line-height: 40px;
}

.text_box {
  float: left;
  border-radius: 0.8rem;
  max-width: 60%;
  min-width: auto;
  background-color: #FFFFFF;
  word-break: break-all;
  /*overflow: hidden;*/
  padding: 10px;
  margin-left: 10px;
  display:block;
  text-overflow:ellipsis;
}

.msg_title {
  float: left;
  height: 24px;
  font-size: 12px;
  text-align: left;
  font-style: normal;
  width:100%;
  overflow:hidden;
  white-space:nowrap;
}

.msg_tit {
  float: left;
  margin-bottom: 10px;
  font-size: 10px;
  width: auto;
  margin-right: 10px;
}

.msg {
  /*position: relative;*/
  font-size: 12px;
  min-height: 26px;
  text-align: left;
  float: unset;
}

.removeMsg {
  text-align: center;
  font-size: 12px;
  border-radius: 0.2rem;
  background-color: #dcdcdc;
  line-height: 36px;
  padding: 5px  20px;
}

.isMine {
  float:right;
  text-align: right;
}

.other {
  float:left
}

.mybox {
  float:right;
  background-color:#64b754;color:#ffffff;margin-right:10px
}

#content {
  float: left;
  background-color: transparent;
  border: hidden;
  width: 60%;
  outline: 0;
  max-width: 60%;
  max-height: 105px;
  padding: 0 10px;
  margin: 0 10px;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: hidden;
  resize:none;
  text-align: left;
  min-height: 30px;
  padding-top: 10px;
}

.menuicon {
  float: left;
  font-size: 25px;
  margin-top: 5px;
  width: 10%;
}

>>>.van-uploader {
  float: left;
  font-size: 25px;
  margin-top: 5px;
}

/deep/.leftInput .van-field__control{
  /*margin-right: 20px;*/
  overflow: hidden;
}

/deep/.leftInput .van-field__control{
  /*margin-right: 20px;*/
  overflow: hidden;
}

/deep/.el-upload {
  display: block;
}

.msg_box {
  background-color: #f5f5f5;
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.clearfix {
  width: 100%;
  height: 100%;
}

/deep/.van-list__finished-text {
  background-color: #f5f5f5;
  color: #a7a7a7;
  position: absolute;
  width: 100%;
  /*height: 100%;*/
}

/deep/.van-list__loading {
  background-color: #f5f5f5;
  color: #a7a7a7;
  position: fixed;
  width: 100%;
  height: 100%;
}

.msg_box:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.video_box {
  position: fixed;
  width: 100%;
  height: 40%;
  float: left;
  z-index: 999;
  box-sizing:border-box;
}

.video {
  width: 100%;
  height: 90%;
  padding: 10px;
  box-sizing:border-box;
}

.plan_box {
  position: fixed;
  width: 100%;
  height: 40%;
  float: left;
  z-index: 900;
  box-sizing:border-box;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  text-align: left;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: 0 0 0.8rem 0.8rem;
}

.plan_msg{
  float: left;
  text-align: left;
  width: 65%;
  height: auto;
  background-color: #e5e5e5;
  padding: 10px;
  border-radius: 0.8rem;
}

.plan_list {
  width: 100%;
  height: auto;
  margin: 15px 0 15px 5px;
  overflow: hidden;
  position: relative;
  line-height: 22px;
  word-break: break-all;
  box-sizing:border-box;
}

.plan_tit {
  font-size: 8px;
}

.plan_left {
  width: 11%;
  height: auto;
  float: left;
  text-align: center;
  margin-right: 5px;
}

.plan_right {
  text-align: center;
  line-height: 40px;
  float: left;
  margin-left: 10px;
  width: 10%;
  height: auto;
  border-radius: 2rem;
  background-color: #f33c1c;
  color: white;
}

.lottery_box {
  position: fixed;
  width: auto;
  float: left;
  z-index: 900;
  box-sizing:border-box;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  text-align: left;
  overflow: hidden;
  overscroll-behavior: contain;
  margin: 5px;
  padding: 15px 0;
}

.lottery {
  float: left;
  width: 25%;
  color: #9e9e9e;
  font-size: 10px;
  line-height: 20px;
}

>>>#file-upload-button{
  width: 60px;
  height: 60px;
}

/*红包样式*/
.redpack{
  font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  pointer-events: auto;
  font-family: \5FAE\8F6F\96C5\9ED1;
  list-style: none;
  font-size: 14px;
  line-height: 22px;
  word-break: break-all;
  color: #fff;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  box-sizing: content-box;
  height: 210px;
  background: #A5423A;
  width: 160px;
  left: 0;
  top: 0;
  border-radius: 10px;
  margin: 0 auto;
  text-align: center;
  float: left;
  cursor: pointer;
}
.topcontent{
  font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  pointer-events: auto;
  font-family: \5FAE\8F6F\96C5\9ED1;
  list-style: none;
  font-size: 14px;
  line-height: 22px;
  word-break: break-all;
  color: #fff;
  text-align: center;
  cursor: pointer;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  box-sizing: content-box;
  height: 75%;
  border: 1px solid #BD503A;
  background-color: #BD503A;
  border-radius: 10px 10px 50% 50% / 10px 10px 15% 15%;
  box-shadow: 0px 4px 0px -1px rgba(0,0,0,0.2);
}
.topcontent-content{
  font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  pointer-events: auto;
  font-family: \5FAE\8F6F\96C5\9ED1;
  list-style: none;
  line-height: 22px;
  word-break: break-all;
  text-align: center;
  cursor: pointer;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  box-sizing: content-box;
  margin-top: 30%;
  font-size: 12px;
  color: #ffffff;
}
.topcontent-content2{
  font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  pointer-events: auto;
  font-family: \5FAE\8F6F\96C5\9ED1;
  list-style: none;
  line-height: 22px;
  word-break: break-all;
  text-align: center;
  cursor: pointer;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  box-sizing: content-box;
  font-size: 12px;
  color: #ffffff;
}
.redpack-open{
  font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  pointer-events: auto;
  font-family: \5FAE\8F6F\96C5\9ED1;
  list-style: none;
  line-height: 22px;
  word-break: break-all;
  text-align: center;
  cursor: pointer;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  box-sizing: content-box;
  width: 45px;
  height: 45px;
  border: 1px solid #FFA73A;
  background-color: #FFA73A;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  display: inline-block;
  position: relative;
  top: -25px;
  box-shadow: 0px 4px 0px 0px rgba(0, 0, 0, 0.2);
}
.redpack-font{
  font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  pointer-events: auto;
  font-family: \5FAE\8F6F\96C5\9ED1;
  list-style: none;
  line-height: 22px;
  word-break: break-all;
  text-align: center;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  color: #fff;
  box-sizing: content-box;
  font-size: 25px;
  position: relative;
  top: 10px;
}
</style>
