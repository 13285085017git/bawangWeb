import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/ico/iconfont.css'
import './assets/css/font.css'
import './assets/css/clern.css'
import store from './store'
import VEmojiPicker from 'v-emoji-picker';


Vue.config.productionTip = false


Vue.use(Lazyload, {
  lazyComponent: true
})
Vue.use(VEmojiPicker);
Vue.use(ElementUI);
Vue.use(vant)
window.addEventListener('popstate', function (e) {
  router.isBack = true
}, false)
router.beforeEach((to, from, next) => {

  const token = sessionStorage.getItem('token')
  if (to.meta.isLogin) {
    if (token) {
      next()
    } else {
      next({
        path: '/'
      })
    }
  } else {
    if (token) {
      next({
        path: '/index'
      })
    } else {
      next()
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
