<template>
    <div class="index">
    <div style="position:relative;">
      <van-image width="100%" height="100%" :src="back_img">
        <van-image style="position:absolute; left:15%; top:5%;" width="70%" :src="top_text" />
      </van-image>
    </div>
      <div class="top_index">
<!--          <div class="oftenGame">-->
<!--              <span style="float: left;font-weight: bolder;">常玩游戏</span>-->
<!--              <div class="game">-->
<!--                  <div class="ga">-->
<!--                      <el-image class="game_logo" :src="game_logo"></el-image>-->
<!--                      <span class="game_title">霸王牛牛</span>-->
<!--                  </div>-->
<!--                  <div class="ga">-->
<!--                      <el-image class="game_logo" :src="game_logo"></el-image>-->
<!--                      <span class="game_title">霸王牛牛</span>-->
<!--                  </div>-->
<!--              </div>-->
<!--          </div>-->
          <div class="post">
              <div class="cube">
                <van-image width="100%" :src="notice_bg" @click="active(1)">
                  <div class="card" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;">
                      <div class="postTitle">
                          官方公告
                      </div>
                      <div class="lilTitle" style="color: #ff443d">及时掌握最新动态</div>
                  </div>
                </van-image>
              </div>
              <div class="cube">
                <van-image width="100%" height="100%" :src="activity_bg" @click="active(2)">
                  <div style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;">
                      <div class="postTitle">
                          官方活动
                      </div>
                      <div class="lilTitle" style="color: #633afc">福利与机遇并存</div>
                  </div>
                </van-image>
              </div>
              <div class="cube">
                <van-image width="100%" height="100%" :src="draw_bg" @click="lottery(1)">
                  <div style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;">
                      <div class="postTitle">
                          积分抽奖
                      </div>
                      <div class="lilTitle" style="color: #3e86e5">你只管努力</div>
                  </div>
                </van-image>
              </div>
              <div class="cube">
                <van-image width="100%" height="100%" :src="actdraw_bg" @click="lottery(2)">
                  <div style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;">
                      <div class="postTitle">
                          活动抽奖
                      </div>
                      <div class="lilTitle" style="color: #f2923d">剩下的交给天意</div>
                  </div>
                </van-image>
              </div>
          </div>
<!--          <div class="promote">-->
<!--              <div style="float: left">推广</div>-->
<!--              <span>彩民自己的朋友圈</span>-->
<!--              <el-button style="float: right;background-color: #f88425;color: #FFFFFF" round>-->
<!--                  立即前往-->
<!--              </el-button>-->
<!--          </div>-->
      </div>
    </div>
</template>

<script>
    import back_img from '../../assets/img/active/active_bg.png'
    import top_text from '../../assets/img/active/active_text.png'
    import game_logo from '../../assets/img/active/niuniu.png'
    import notice_bg from '../../assets/img/active/gonggao.png'
    import activity_bg from '../../assets/img/active/gfhd.png'
    import draw_bg from '../../assets/img/active/jfcj.png'
    import actdraw_bg from '../../assets/img/active/hdcj.png'
    import Vue from 'vue';
    import { Image as VanImage } from 'vant';

    Vue.use(VanImage);
    export default {
        name: "index",
        data() {
            return {
                back_img : back_img,
                top_text : top_text,
                game_logo : game_logo,
                notice_bg : notice_bg,
                activity_bg : activity_bg,
                draw_bg : draw_bg,
                actdraw_bg : actdraw_bg,
            }
        },
      methods: {
        lottery(type) {
          this.$router.push({path:'/lottery',query:{type:type}})
        },
        active(type) {
          this.$router.push({path:'/active',query:{type:type}})
        }
      }
    }
</script>

<style scoped>
  /deep/#index {
    width: 100%;
    box-sizing: border-box;
  }

    /*.bck_img {*/
    /*    width: 100%;*/
    /*    !*display: flex;*!*/
    /*    !*position: relative;*!*/
    /*}*/

    .top_index {
        background-color: #f1ede4;
        position: fixed;
        top: 20%;
        width: 100%;
        height: 100%;
        border-radius: 0.8rem 0.8rem 0 0;
    }
    .post {
        background-color: #FFFFFF;
        height: 40%;
        margin-bottom: 10px;
        box-sizing: border-box;
        border-radius: 0.8rem 0.8rem 0 0;
    }
    .promote {
        background-color: #FFFFFF;
        border-radius: 0.8rem;
        height: 45px;
        line-height: 45px;
    }
    .oftenGame {
        background-color: #FFFFFF;
        border-radius: 0.8rem 0.8rem 0 0;
        height: 15%;
        margin-bottom: 10px;
        padding: 10px;
    }
    .game {
        float: left;
        height: 80px;
        width: 100%;
    }
    .game_logo {
        height: 65px;
        width: 65px;
        border-radius: 0.5rem;
    }
    .ga {
        float: left;
        width: 65px;
        margin: 15px 20px 15px 0;
    }
    .game_title {
        font-size: 12px;
        margin-top: 2px;
    }
    .cube {
        border-radius: 0.6rem;
        /*background-color: #0d9445;*/
        /*height: 90px;*/
        width: 45%;
        margin: 15px 2% 5px 2%;
        text-align: center;
        float: left;
    }
    .postTitle {
        font-size: 25px;
        width: 100%;
        color: #FFFFFF;
        padding-top: 5%;
        /*margin-top: 15%;*/
        position: relative;
        top: 25%;
    }
    .lilTitle {
        /*width: 70%;*/
        /*border-radius: 1rem;*/
        font-size: 13px;
        /*background-color: rgba(255,255,255,0.5);*/
        padding: 2px 10px 2px 10px;
        /*color: #0d9445;*/
        /*margin-top: 12%;*/
        position: relative;
        top: 40%;
    }

    .card {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
</style>
