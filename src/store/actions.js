import api from '../assets/js/api'
// import router from '@/router'
const actions = {
  async getconfig (context) {
    const res = await api.configFile
    console.log(res)
    context.commit('GETCONFIG', res)
    if (typeof res === 'string') return
    sessionStorage.setItem('configFile', JSON.stringify(res))
  }, // 获取公共配置并储存

  // async getimgdata (context) {
  //   const res = await api.getImgDate
  //   context.commit('GETIMGDATA', res)
  //   if (typeof res === 'string') return
  //   sessionStorage.setItem('banner', JSON.stringify(res))
  // }, // 获取banner并储存
  // async lotteryOpen ({ commit }, obj) {
  //   const res = await api.lottery(obj)
  //   commit('LOTTERY', res.data.data)
  // }, // 首页开奖信息
  // async categories ({ commit }, obj) {
  //   const res = await api.category(obj)
  //   commit('CATEGORY', res)
  //   if (typeof res === 'string') return res
  //   sessionStorage.setItem('category', JSON.stringify(res))
  //   return res
  // }, // 发现帖子页
  // async getArticle ({ commit }, obj) {
  //   const res = await api.article(obj)
  //   commit('ARTICLE', res)
  //   if (typeof res === 'string') return res
  //   sessionStorage.setItem('article', JSON.stringify(res))
  //   return res
  // },
  // async articleDetails ({ commit }, obj) {
  //   const res = await api.articleDetails(obj)
  //   commit('ARTICDETA', res)
  //   if (typeof res === 'string') return res
  //   sessionStorage.setItem('articleDetails', JSON.stringify(res))
  //   return res
  // },
  // async getInfo ({ commit, state }) {
  //   if (state.userInfo) {
  //     commit('GETINFO', state.userInfo)
  //     return
  //   }
  //   const res = await api.getInfo()
  //   commit('GETINFO', res.data.data)
  // },
  // async getDetile ({ commit }, id) {
  //   const res = await api.toDetiles(id)
  //   commit('GETDETILE', res)
  // },
  // async getQs ({ commit }, obj) {
  //   const res = await api.getQs(obj)
  //   if (res.data.code !== 200) return
  //   const newArray = res.data.data.sort((a, b, c) => {
  //     return parseInt(b.period.slice(1)) - parseInt(a.period.slice(1))
  //   }) // 从大到小排序
  //   commit('QSDATA', newArray)
  // }, // 图库期数
  // async getTKdata ({ commit }, obj) {
  //   var type = null
  //   if (router.history.current.name === 'fxlist' || router.history.current.name === 'zlxq') {
  //     var res = await api.fxList(obj)
  //     if (router.history.current.name === 'fxlist') {
  //       type = 3
  //     } else if (router.history.current.name === 'zlxq') {
  //       type = 2
  //     }
  //   } else {
  //     // eslint-disable-next-line no-unused-vars,no-redeclare
  //     var res = await api.getTK(obj)
  //     type = 1
  //   }
  //
  //   const ress = await api.getNewPl({
  //     pid: obj.id,
  //     type: type,
  //     page: 1,
  //     // eslint-disable-next-line no-mixed-operators
  //     pages_size: sessionStorage.getItem('pageNum') && sessionStorage.getItem('pageNum') * 10 || 10
  //   })
  //   commit('NEWPLDATA', ress.data.data) // 详情评论接口
  //   !sessionStorage.getItem('pageNum') && commit('GETTKDATA', res)
  //   sessionStorage.removeItem('pageNum')
  // }, // 获取图库数据
  // async getZlData ({ commit }, obj) {
  //   if (obj) {
  //     const res = await api.articleDetile(obj)
  //     commit('ZLDATA', res.data.data)
  //     return res.data.data
  //   }
  //   const session = sessionStorage.getItem('ZLDATA')
  //   if (session) {
  //     commit('ZLDATA', JSON.parse(session))
  //     return JSON.parse(session)
  //   } else {
  //     const res = await api.articleDetile(obj)
  //     if (res.data.code === 200) {
  //       commit('ZLDATA', res.data.data)
  //       sessionStorage.setItem('ZLDATA', JSON.stringify(res.data.data))
  //       return res
  //     }
  //   }
  // }, // 资料关键词大全
  // async getZlXq ({ commit }, obj) {
  //   const res = await api.getzlData(obj)
  //   if (res.data.code === 200) {
  //     commit('ZLXQLB', res.data.data)
  //     return res
  //   }
  // },
  // async getTkList ({ commit }, obj) {
  //   if (obj) {
  //     const res = await api.getTkFl(obj)
  //     return res.data.data
  //   }
  //   const session = sessionStorage.getItem('TKFL')
  //   if (session) {
  //     commit('TKFL', JSON.parse(session))
  //     return JSON.parse(session)
  //   } else {
  //     const res = await api.getTkFl(obj)
  //     if (res.data.code === 200) {
  //       commit('TKFL', res.data.data)
  //       sessionStorage.setItem('TKFL', JSON.stringify(res.data.data))
  //       return res
  //     }
  //   }
  // },

  async getchat ({ commit }, obj) {
    const res = await api.chatList(obj)
    if (res.data.code === 200) {
      commit('CHATLIST', res.data.data)
    }
    return res.data.code
  },
  concatArr ({ commit, state }, res) {
    let newArray = state.concatData
    newArray = newArray.concat(state[res])
    commit('ADDARR', newArray)
  },
  clearData ({ commit, state }) {
    commit('CLEAR', 'concatData')
    console.log(state.concatData)
  },

  // async getBill ({ commit, state }, obj) {
  //   if (!obj && state.bill) {
  //     commit('BILL', state.bill)
  //     return 200
  //   }
  //   const res = await api.bill(obj)
  //   commit('BILL', res.data.data)
  //   return res.data.code
  // },
  // async getZd ({ commit }, obj) {
  //   const res = await api.zblist(obj)
  //   commit('ADDZDLB', res)
  //   return res.data.data.length
  // },

  getMessage ({ commit }, res) {
    commit('MESSAGE', res)
  },
  getMessageNum ({ commit }, res) {
    commit('MESSAGENUM', res)
  }

}
export default actions
