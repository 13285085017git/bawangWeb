<template>
  <div>
    <div style="padding: 20px;height: 20px;line-height: 20px;font-size: 20px">
      <div style="float: left;margin-right: 30px" @click="goBack"><</div>
      <div v-if="type==='cash'" style="float: left">提现明细</div>
      <div v-else-if="type==='integral' || type==='intDetail'" style="float: left">积分明细</div>
      <div v-else-if="type==='balance'" style="float: left">资金明细</div>
      <div v-else-if="type==='lottery'" style="float: left">抽奖记录</div>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list">
        <div v-if="type==='cash'">
          <van-image width="50" :src="cash" style="float: left;margin-right: 16px" />
          <div style="float: left;width: auto;color: #907b7b">
            <div style="font-size: 16px">{{item.status==='0'?'待处理':'已处理'}}</div>
            <div>{{item.created_at*1000 | formatDate}}</div>
          </div>
          <div style="float: right;width: auto;text-align: right">
            <div style="font-size: 20px">{{item.amount}}元</div>
            <div style="font-size: 12px;">平台账号：{{item.account}}</div>
          </div>
        </div>
        <div v-else-if="type==='integral' || type==='intDetail'">
          <van-image width="50" :src="integral" style="float: left;margin-right: 16px" />
          <div style="float: left;width: auto;color: #907b7b">
            <div style="font-size: 16px">{{item.remark}}</div>
            <div>{{item.created_at*1000 | formatDate}}</div>
          </div>
          <div style="float: right;width: auto;text-align: right">
            <div style="font-size: 20px">{{item.num}}</div>
            <div style="font-size: 12px">变动前{{item.old_num}},变动后{{item.new_num}}</div>
          </div>
        </div>
        <div v-else-if="type==='balance'">
          <van-image width="50" :src="integral" style="float: left;margin-right: 16px" />
          <div style="float: left;width: auto;color: #907b7b">
            <div style="font-size: 16px">{{item.remark}}</div>
            <div>{{item.created_at*1000 | formatDate}}</div>
          </div>
          <div style="float: right;width: auto;text-align: right">
            <div style="font-size: 20px">{{item.num}}</div>
            <div style="font-size: 12px">变动前{{item.old_num}},变动后{{item.new_num}}</div>
          </div>
        </div>
        <div v-if="type==='lottery'">
          <van-image width="50" :src="integral" style="float: left;margin-right: 16px" />
          <div style="float: left;width: auto;color: #907b7b">
            <div style="font-size: 16px">{{'抽奖-'+item.content}}</div>
            <div>{{item.created_at*1000 | formatDate}}</div>
          </div>
          <div style="float: right;width: auto;text-align: right">
            <div style="font-size: 20px">{{parseFloat(item.amount/100).toFixed(1)}}元</div>
            <div style="font-size: 12px;">{{item.status==='0'?'待处理':'已处理'}}</div>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import Vue from 'vue';
import { List, Image as VanImage } from 'vant';
import api from "../../assets/js/api";
import cash from "../../assets/img/icon/iocn_dh.png";
import integral from "../../assets/img/icon/iocn_tx.png";

Vue.use(List);
Vue.use(VanImage);
export default {
name: "useDetail",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      type: this.$route.query.type,
      integral: integral,
      cash: cash,
      page: 0,
    };
  },
  methods: {
    //返回
    goBack() {
      this.$router.back()
    },
    async onLoad() {
      // 异步更新数据
      this.page += 1
      let res
      if (this.type==='cash'){
        res = await api.cashLog({
          page : this.page
        })
      }else if (this.type==='integral' || this.type==='intDetail'){
        res = await api.integralLog({
          page : this.page
        })
      }else if (this.type==='balance'){
        res = await api.balanceLog({
          page : this.page
        })
      }else if (this.type==='lottery'){
        res = await api.checkLotLog({
          page : this.page
        })
      }
      let data = res.data
      // 加载状态结束
      this.loading = false;
      // 数据全部加载完成
      if(data.length == 0){
        this.finished = true;
      }
      if(this.maxPage >= 5){
        this.finished = true;
      }
      if(data.length < 10 && data.length > 0){
        this.finished = true;
      }
      this.list = this.list.concat(data)
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

</style>
