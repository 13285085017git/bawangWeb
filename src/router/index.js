import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login,
    meta: {
      isLogin: false,
      topPage: false
    }
  },
  {
    path: '/index',
    name: 'index',
	component: () => import('../views/index/index.vue'),
    meta: {
      isLogin: true,
      move: true,
      topPage: true,
      keepAlive: true ,// 需要被缓存
    }
  },
  {
    path: '/prize',
    name: 'prize',
    component: () => import('../views/prize/index.vue'),
    meta: {
      isLogin: true,
      move: true,
      topPage: true,
      keepAlive: true ,// 需要被缓存
    }
  },
  {
    path: '/activity',
    name: 'activity',
    component: () => import('../views/activity/index.vue'),
    meta: {
      isLogin: true,
      move: true,
      topPage: true,
      keepAlive: true ,// 需要被缓存
    }
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('../views/my/index.vue'),
    meta: {
      isLogin: true,
      move: true,
      topPage: true,
      keepAlive: true ,// 需要被缓存
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/index/chat.vue'),
    meta: {
      isLogin: true,
      move: true,
      chatNav: true,
      keepAlive: true,
    }
  },
  {
    path: '/packet',
    name: 'packet',
    component: () => import('../views/index/packet.vue'),
    meta: {
      isLogin: true,
      move: true,
      keepAlive: true ,// 需要被缓存
    }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/prize/history.vue'),
    meta: {
      isLogin: true,
      move: true,
      keepAlive: true ,// 需要被缓存
    }
  },
  {
    path: '/changenickname',
    name: 'changenickname',
    component: () => import('../views/my/changenickname.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  },
  {
    path: '/rewardRank',
    name: 'rewardRank',
    component: () => import('../views/index/rewardRank.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import('../views/index/rank.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  },
  {
    path: '/rankTop',
    name: 'rankTop',
    component: () => import('../views/index/rankTop.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  },
  {
    path: '/getCash',
    name: 'getCash',
    component: () => import('../views/my/getCash.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  },
  {
    path: '/useDetail',
    name: 'useDetail',
    component: () => import('../views/my/useDetail.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  },
  {
    path: '/lottery',
    name: 'lottery',
    component: () => import('../views/activity/lottery.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  },
  {
    path: '/active',
    name: 'active',
    component: () => import('../views/activity/active.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  },
  {
    path: '/testemoji',
    name: 'testemoji',
    component: () => import('../views/index/testemoji.vue'),
    meta: {
      isLogin: true,
      move: true
    }
  }
]


  const router = new VueRouter({
  mode: 'hash',
  scrollBehavior(to,from,savePosition) {
    if (savePosition){
      return savePosition
    }else{
      return {x: 0,y: 0}
    }
  },
  // router.beforeEach((to, from, next) => {
  //   iView.LoadingBar.start();//loadong 效果
  //
  //   //进入登录页面的时候清除 token
  //   if(to.path === '/login' ){
  //     sessionStorage.removeItem("token", '');
  //     sessionStorage.removeItem("user_Data", '');
  //   }
  //
  //
  //   store.state.token = sessionStorage.getItem('token');//获取本地存储的token
  //
  //   if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
  //     if (store.state.token !== "" && store.state.token !== null) {  // 通过vuex state获取当前的token是否存在
  //
  //       //判断是否需要缓存
  //       if(to.path === '/filelist' && from.path === '/fileview'){
  //         to.meta.keepAlive = true;  // 让 列表页 缓存，即不刷新
  //         next();
  //       }else {
  //         to.meta.keepAlive = false;  // 让 列表页 即不缓存，刷新
  //         next();
  //       }
  //
  //     }else {
  //       next({
  //         path: '/login',
  //         query: {redirect: from.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
  //       })
  //     }
  //
  //   }else {
  //     next();
  //   }
  // }),
  base: process.env.BASE_URL,
  routes
})

export default router

