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

