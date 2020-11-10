// import api from './axios.config'
import val from './parameter'
import {api} from './MD5'
// import { Notify } from 'vant'
// import ""

// eslint-disable-next-line no-mixed-operators
// const configFile = sessionStorage.getItem('configFile') && JSON.parse(sessionStorage.getItem('configFile')).data.code === 200 && JSON.parse(sessionStorage.getItem('configFile')) || api.get('/api/v1/common/config\n', {
//   field: val.configList
// }) // 公共配置
const login = (obj) => {
  return api.post('/api/v1/site/login\n', obj)
}// 账号登录

const chatList = () => {
  return api.get('/api/v1/member/member/chat-list-init\n','' , sessionStorage.getItem('token'))
}// 聊天列表

const chatHistory = (obj) => {
  return api.post('/api/v1/chat/chat-history\n', obj , sessionStorage.getItem('token'))
}// 聊天历史记录

const roomInfo = (obj) => {
  return api.post('/api/v1/chat/room-info\n', obj , sessionStorage.getItem('token'))
}// //进入群聊时访问，返回群聊视频链接

const readMsg = (obj) => {
  return api.post('/api/v1/chat/read-private-msg\n', obj , sessionStorage.getItem('token'))
}// //进入聊天时，将未读消息改为已读

const sendMsg = (obj) => {
  // console.log(obj)
  return api.post('/api/v1/chat/send-msg\n', obj , sessionStorage.getItem('token'));
}//   发送消息

const sendImg = (obj) => {
  return api.post('/api/v1/chat/send-image\n', obj , sessionStorage.getItem('token') , true)
}//发送图片

const roomPlan = (obj) => {
  return api.post('/api/v1/chat/get-plan\n', obj , sessionStorage.getItem('token'))
}//房间计划

const roomLottery= (obj) => {
  return api.post('/api/v1/chat/room-lottery\n', obj , sessionStorage.getItem('token'))
}//房间开奖彩种

const getRedPackage = (obj) => {
  return api.post('/api/v1/chat/get-redpackage\n' , obj , sessionStorage.getItem('token'))
}//抢普通红包

const checkLucky = (obj) => {
  return api.post('/api/v1/chat/redpackage-got-list\n' , obj , sessionStorage.getItem('token'))
}//抢普通红包

const luckpackInfo = (obj) => {
  return api.post('/api/v1/chat/lucky-redpackage-detail\n' , obj , sessionStorage.getItem('token'))
}//运气红包详情

const getLuckpack = (obj) => {
  return api.post('/api/v1/chat/get-lucky-redpackage\n' , obj , sessionStorage.getItem('token'))
}//抢运气红包

const sendRedpack = (obj) => {
  return api.post('/api/v1/chat/send-redpackage\n' , obj , sessionStorage.getItem('token'))
}//发红包

const reward = (obj) => {
  return api.post('/api/v1/chat/reward\n' , obj , sessionStorage.getItem('token'))
}//打赏

const lotteryList = () => {
  return api.get('/api/v1/member/member/get-lottery\n' , '' , sessionStorage.getItem('token'))
}//展示彩种

const lotteryLog = (obj) => {
  return api.post('/api/v1/chat/lottery-log\n' , obj , sessionStorage.getItem('token'))
}//开奖历史

const bind = (obj) => {
  return api.post('/api/v1/member/member/bind\n' , obj , sessionStorage.getItem('token'))
}//绑定websocket

const revokeMsg = (obj) => {
  return api.post('/api/v1/chat/revoke-message\n' , obj , sessionStorage.getItem('token'))
}//撤销自己已发送的消息

const sign = (obj) => {
  return api.get('/api/v1/member/member/sign\n' , obj , sessionStorage.getItem('token'))
}//签到

const edit_avatar = (obj) => {
  return api.post('/api/v1/member/member/edit-avatar\n' , obj , sessionStorage.getItem('token'),true)
}//更换头像

const edit_nickname = (obj) => {
  return api.post('/api/v1/member/member/edit-nickname\n' , obj , sessionStorage.getItem('token'))
}//更换昵称

const memberReward = (obj) => {
  return api.post('/api/v1/chat/reward-rank-member\n' , obj , sessionStorage.getItem('token'))
}//打赏榜

const RewardRank = (obj) => {
  return api.post('/api/v1/chat/reward-rank\n' , obj , sessionStorage.getItem('token'))
}//获赏榜

const Rank = (obj) => {
  return api.get('/api/v1/member/member/rank\n' , obj , sessionStorage.getItem('token'))
}//排行榜

const tackCash = (obj) => {
  return api.post('/api/v1/member/member/withdrew\n' , obj , sessionStorage.getItem('token'))
}//提现申请

const cashLog = (obj) => {
  return api.post('/api/v1/member/member/withdrew-log\n' , obj , sessionStorage.getItem('token'))
}//提现记录

const integralList = () => {
  return api.get('/api/v1/member/member/integral-exchange-list\n' , '' , sessionStorage.getItem('token'))
}//积分兑换记录

const changeIntegral = (obj) => {
  return api.post('/api/v1/member/member/integral-exchange\n' , obj , sessionStorage.getItem('token'))
}//积分兑换

const integralLog = (obj) => {
  return api.post('/api/v1/member/member/integral-log\n' , obj , sessionStorage.getItem('token'))
}//积分记录

const balanceLog = (obj) => {
  return api.post('/api/v1/member/member/money-log\n' , obj , sessionStorage.getItem('token'))
}//积分记录

const lotteryInfo = (obj) => {
  return api.post('/api/v1/member/member/lottery-info\n' , obj , sessionStorage.getItem('token'))
}//抽奖信息

const lottery = (obj) => {
  return api.post('/api/v1/member/member/lottery\n' , obj , sessionStorage.getItem('token'))
}//抽奖信息

const checkLotLog = (obj) => {
  return api.post('/api/v1/member/member/turn-table-lottery-log\n' , obj , sessionStorage.getItem('token'))
}//我的抽奖记录

const settings = () => {
  return api.get('/api/v1/common/settings\n' , '' , sessionStorage.getItem('token'))
}//设置

const active = (obj) => {
  return api.post('/api/v1/common/settings/active\n' , obj , sessionStorage.getItem('token'))
}//活动与公告

const hotFunction = () => {
  return api.get('/api/v1/common/settings/hot-function\n' , '' , sessionStorage.getItem('token'))
}//热门功能

const switchMsg = (obj) => {
  return api.post('/api/v1/member/member/switch-msg\n' , obj , sessionStorage.getItem('token'))
}//消息提示开关

const reconnect = (obj) => {
  return api.post('/api/v1/chat/reconnect\n' , obj , sessionStorage.getItem('token'))
}//消息重连拉取


export default {
  // configFile,
  login,
  chatList,
  chatHistory,
  roomInfo,
  readMsg,
  sendMsg,
  sendImg,
  roomPlan,
  getRedPackage,
  checkLucky,
  bind,
  revokeMsg,
  sign,
  luckpackInfo,
  getLuckpack,
  sendRedpack,
  reward,
  roomLottery,
  lotteryLog,
  lotteryList,
  edit_avatar,
  edit_nickname,
  memberReward,
  RewardRank,
  Rank,
  tackCash,
  cashLog,
  integralLog,
  integralList,
  changeIntegral,
  balanceLog,
  lotteryInfo,
  lottery,
  checkLotLog,
  settings,
  active,
  hotFunction,
  switchMsg,
  reconnect,
}
