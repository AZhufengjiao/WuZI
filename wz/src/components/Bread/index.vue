<template>
  <el-breadcrumb :separator-icon="ArrowRight">
<!--    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
    <el-breadcrumb-item v-for="item in levelList.value" :key="item.path" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
import {reactive, watch} from "vue";
import {useRoute} from "vue-router";
export default {
  setup() {
    const levelList=reactive([])
    const route=useRoute()

    const getBreadCrumb=()=>{
      let matched= route.matched.filter(item=>item.name)
      const first=matched[0]
      if(first&& first.name.trim().toLocaleLowerCase()!=='home'.toLocaleLowerCase()){
        matched=[{path:'/home',meta:{title:'首页'}}].concat(matched)
      }
      levelList.value=matched
      console.log( levelList.value)
    }
    getBreadCrumb()

    watch(route,()=>{
     getBreadCrumb()
    })

    return {
      ArrowRight,levelList
    }
  }
}

</script>

<style scoped>
.el-breadcrumb {
  height: 40px;
}
.el-breadcrumb{
  margin-top: 10px;
}
</style>
