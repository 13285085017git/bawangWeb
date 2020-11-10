import Vue from 'vue'
import Vuex from 'vuex'
import createpersistate from 'vuex-persistedstate'
import state from '@/store/state'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import getters from '@/store/getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
  },
  plugins: [
    createpersistate({
      storage: window.sessionStorage,
      reducer (state) {
        return {
          // 需要储存的state值
          indexApp: state.indexApp,
          config: state.config,
          ycfl: state.ycfl,
          dstj: state.dstj,
          banner: state.banner
        }
      }
    })
  ]
})
