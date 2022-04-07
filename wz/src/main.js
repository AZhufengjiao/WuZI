import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import  './assets/fonts/home-headers-logo/iconfont.css'
import './assets/fonts/home-headers-logo/iconfont.js'
import  store from '@/store'
// import 'normalize.css'
// import '@/assets/styles/common.less'
 import 'default-passive-events'

createApp(App).use(router).use(store).use(ElementPlus).mount('#app')

// 路由守卫
router.beforeEach((to,from,next)=>{
  let token=store.state.login.token
  if(token){  // 如果有token值，并且要退回到登录页面，通过next 跳回到/
   if(to.path==='/login'){
    next({
     path:'/'
    })
   }else{  // 要到其他得页面就直接通过
     next()
   }
  }else{  // 如果没有token值，并且在login页就直接放行到login页面
    if(to.path==='/login'){
     next()
    }else{
     next('/login')  // 直接跳回到login
    }
  }
})
