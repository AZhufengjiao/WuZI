<template>
  <div class="left">
    <div class="rescue-logo">
      <svg class="icon rescue-logo-icon" aria-hidden="true">
        <use xlink:href="#icon-a-yiliaoxiangjijiuxiang"></use>
      </svg>
    </div>
    <span>疫情捐赠物资后台管理系统</span>
  </div>
  <div class="right">
    <img src="" style="margin-right: 10px" />
    <span style="margin-right: 20px">您好！{{username}}</span>
    <el-button type="danger" @click="userExit">退出</el-button>
  </div>
</template>

<script >
import {useStore} from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: "index",
  setup(){
    const store=useStore()
    const router=useRouter()
    const username=store.state.login.username
    // 退出用户登录
    const userExit=()=>{
      store.commit('login/setUser','')
      store.commit('login/setFlag',false)
      store.commit('login/setToken','')
      router.push('/')
    }
    return {userExit,username}
  }
}
</script>

<style scoped lang="less">
.left {
  float: left;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: white;    font-size: 20px;
  i {
    font-size: 25px;
    margin-right: 22px;
  }
  img {
    margin-right: 11px;
    width: 31px;
    height: 31px;    border-radius: 50%;
  }
  .rescue-logo{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: white;
    border: 2px solid white;
    padding-top: 2px;
    color: #ff7878;
    box-sizing: border-box;
    margin-right: 10px;
    .rescue-logo-icon{
      position: absolute;
      top: 18px;
      left: 20px;
      z-index: 66;

      width: 1.6em;
      height: 1.2em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}

.right {  color: white;
  float: right;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
img {
  max-width: 43px;
}
}


</style>
