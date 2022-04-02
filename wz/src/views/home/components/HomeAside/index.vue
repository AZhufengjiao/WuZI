<template>
  <div class="fold">
    <span class="iconfont" v-if="isCollapse==true" @click="handleCli" >&#xe643;</span>
    <span class="iconfont" v-if="isCollapse==false"  @click="handleCli"  > &#xe646;</span>
  </div>

<!--  :unique-opened="true"  只允许有一个下拉菜单打开 -->
  <el-menu @select="menuHandle"
           :unique-opened="true"
          :default-active="active"
           :collapse="isCollapse"
           class="menu"
           :default-openeds="['1']">
    <router-link to="/home/main"  class="toggle">
<!--   首页   -->
    <el-menu-item index="1">
      <el-icon><home-filled /></el-icon>
      <span>首页</span>
    </el-menu-item>
    </router-link>

<!--  用户管理  -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><user-filled /></el-icon>
        <span>用户管理</span>
      </template>

      <router-link  class="toggle" to="/home/user/userList">
       <el-menu-item index="2-1">
         用户列表
       </el-menu-item>
      </router-link>

      <router-link class="toggle" to="/home/user/userDonate">
      <el-menu-item index="2-2">用户捐赠</el-menu-item>
      </router-link>
    </el-sub-menu>

<!--  物资管理  -->
    <el-sub-menu index="3">
      <template #title>
        <el-icon><setting /></el-icon>
        <span>物资管理</span>
      </template>

      <router-link   to="/home/materials/together">
        <el-menu-item index="3-1">相伴管理</el-menu-item>
      </router-link>
      <router-link   to="/home/material/count">
      <el-menu-item index="3-2">总物资</el-menu-item>
      </router-link>

      <router-link to="/home/material/scarcity">
        <el-menu-item index="3-3">稀缺物资</el-menu-item>
      </router-link>

      <router-link to="/home/material/storage">
      <el-menu-item index="3-4">现有库存</el-menu-item>
      </router-link>

      <router-link to="/home/material/chuku">
      <el-menu-item index="3-5">出库物资</el-menu-item>
      </router-link>
    </el-sub-menu>

<!--   物资分配   -->
    <el-sub-menu index="4">
      <template #title>
        <el-icon><setting /></el-icon>
        <span>物资分配</span>
      </template>
      <router-link to="/home/distribute/provide">
        <el-menu-item index="4-1">专人发放</el-menu-item>
      </router-link>
    </el-sub-menu>
  </el-menu>

</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import { HomeFilled ,UserFilled ,Setting } from '@element-plus/icons-vue'
export default {
  name: "index",
  components:{
    HomeFilled,UserFilled,Setting
  },
  setup(props,{emit}){
    const store=useStore()
    const isCollapse = ref(false)
    // const active=ref('')
    // active.value=store.state.user.index
    const active=computed(()=>{
      return store.state.user.index
    })
    const handleCli=()=>{
    isCollapse.value=!isCollapse.value
     emit('toData',isCollapse.value)
   }

   // 侧边栏选中菜单项
   const menuHandle=(index)=>{
    let active=String(index)
    store.commit('user/setIndex',active)
   }
    return {
      isCollapse,handleCli,menuHandle,active
    }
  }
}
</script>

<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width:200px;
  min-height: 400px;
}

.menu{
  overflow: hidden;
  a{
    text-decoration:none
  }
}
.fold{
  width: 100%;
  background-color: #64769a;
  text-align: center;
  height:30px;
  line-height: 1.5;
}
.iconfont{
  color: white;font-size: 18px;
}
.menubar .el-sub-menu__title{
  margin-right: 100px !important;
}
</style>
