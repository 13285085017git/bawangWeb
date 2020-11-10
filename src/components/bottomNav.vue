<template>
    <div id="nav">
      <van-tabbar style="height: 70px" v-model="active">
        <van-tabbar-item @click="actives(0)">
          <span>消息</span>
          <template #icon="props">
            <img class="icon" :src="props.active ? xx.active : xx.inactive" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item @click="actives(1)">
          <span>开奖</span>
          <template #icon="props">
            <img class="icon" :src="props.active ? kj.active : kj.inactive" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item @click="actives(2)">
          <span>活动</span>
          <template #icon="props">
            <img class="icon" :src="props.active ? hd.active : hd.inactive" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item @click="actives(3)">
          <span>我的</span>
          <template #icon="props">
            <img class="icon" :src="props.active ? wd.active : wd.inactive" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
</template>

<script>
  import Vue from 'vue';
  import { Tabbar, TabbarItem } from 'vant';

  Vue.use(Tabbar);
  Vue.use(TabbarItem);
  import hd from '../assets/img/nav/hd.png'
  import hd_tap from '../assets/img/nav/hd_tap.png'
  import kj_tap from '../assets/img/nav/kj_tap.png'
  import kj from '../assets/img/nav/kj.png'
  import wd from '../assets/img/nav/wd.png'
  import wd_tap from '../assets/img/nav/wd_tap.png'
  import xx from '../assets/img/nav/xx.png'
  import xx_tap from '../assets/img/nav/xx_tap.png'

    export default {
        name: "bottomNav",
        data() {
            return {
              active: 0,
              // active: parseInt(sessionStorage.getItem('names')) || 0,
              xx : {
                active : xx_tap,
                inactive : xx,
              },
              kj : {
                active : kj_tap,
                inactive : kj,
              },
              hd : {
                active : hd_tap,
                inactive : hd,
              },
              wd : {
                active : wd_tap,
                inactive : wd,
              },
            }
        },
        methods: {
            actives (e){
                var name = this.$router.history.current.name
                if (e === 0 && name != 'index'){
                    document.documentElement.scrollTop = document.body.scrollTop =0;
                    this.$router.push({ path: '/index' });
                } else if (e === 1 && name != 'prize') {
                    document.documentElement.scrollTop = document.body.scrollTop =0;
                    this.$router.push({path: '/prize'});
                } else if (e === 2 && name != 'activity') {
                    this.$router.push({path: '/activity'});
                }else if (e === 3 && name != 'my'){
                    this.$router.push({ path: '/my' });
                }
            },
            act () {
                var name = this.$route.name
                if (name === 'index') {
                    this.active = 0
                } else if (name === 'prize') {
                    this.active = 1
                } else if (name === 'activity') {
                    this.active = 2
                } else if (name === 'my') {
                    this.active = 3
                }
            }
        },
      created () {
          this.act()
      },
      watch: {
          $route (to, from) {
              this.act()
          }
      }
    }
</script>

<style scoped lang="scss">

    #nav {
        width: 100%;
        height: 70px;
        background-color: #ffffff;
        box-shadow: 0 -5px 15px rgba(0, 0, 0, .10), 0 0 6px rgba(0, 0, 0, .04);
        .nav_btn{
            float: left;
            width: 25%;
            height: 60px;
            padding-top: 10px;
            i{
                width: 100%;
                height: 30px;
                font-size: 25px;
            }
            span{
                font-size: 13px;
                color: #666666;
            }
            &:nth-child(1) i{
                background-size: 120%;
                background-position: 50% 50%;
            }
            &:nth-child(2) i{
                background-size: 120%;
                background-position: 50% 50%;
            }
            &:nth-child(3) i{
                 background-size: 120%;
                 background-position: 50% 50%;
             }
            img{
                width: 50px;
                margin-top: -46%;
            }
        }
        div .active{
            position: relative;
            &:before{
                 content: '';
                 width: 50px;
                 height: 50px;
                 border-radius: 50%;
                 z-index: -1;
             }
            span{
                width: 100%;
                transition: all .2s;
                transform: scale(1.1);
            }
            &:nth-child(1) span{
                 background-size: 120%;
                 background-position: 50% 50%;
             }
            &:nth-child(2) span{
                 background-size: 120%;
                 background-position: 50% 50%;
             }
            &:nth-child(4) span{
                 background-size: 120%;
                 background-position: 50% 50%;
             }
        }
    }

    .nav_btn {
        float: left;
        width: 25%;
        height: 60px;
        padding-top: 10px;
    }
    .icon {
        //width: 100%;
        height: 30px;
        font-size: 25px;
    }

</style>
