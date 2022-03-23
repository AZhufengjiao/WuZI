import { createStore } from 'vuex'
import  user from '@/store/user'
import  cart from '@/store/cart'
import  login from '@/store/login'
// 持久化数据 vuex-persistedstate 插件
import createPersistedState from 'vuex-persistedstate'

const store=createStore({
    plugins:[
        createPersistedState({
            // 数据存储在 localStorage 时的 key
            key: 'wz',
            // 指定将哪些模块中的数据同步到本地
            paths: ['user', 'cart','login']
        })
    ],
  modules:{
      user,
      cart,
      login
  }
})

export  default store;
