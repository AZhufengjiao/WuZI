<template>
  <!--   列   搜索 -->

    <el-input     class="w-50 m-2"
                  size="large"
                  placeholder="请输入物品名"
                  v-model="searchName"
                  @input="dataLikeName"
                  @mouseenter="flag=!flag"
                  @mouseleave="flag=!flag"
    >
      <template #suffix>
        <span v-if="flag" @click="datalist" class="iconfont">&#xe63a;</span>
      </template>
    </el-input>
<!--  </el-col>-->
</template>

<script>
import {ref} from "vue";

export default {
  name: "index",
  setup(props,{emit}){
    // 搜索
    let flag=ref(false)

    // 搜索 模糊查询入库物资名
    const searchName=ref('')

    // 获取总数据
    const datalist=()=>{
      searchName.value=''
        emit('dataList',searchName.value)
    }

    // 获取模糊查询数据
    const dataLikeName=()=>{
      emit('dataLikeName',searchName.value)
    }

    return {flag,datalist,dataLikeName,searchName}
  }
}
</script>

<style scoped>

</style>
