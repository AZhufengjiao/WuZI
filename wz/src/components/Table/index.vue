<template>
  <el-table :data="UserDonateList.value"   style="width: 100%">
    <el-table-column fixed  prop="RepDate" label="时间" width="150" />
    <el-table-column prop="username" label="姓名" width="120" />
    <el-table-column prop="goodname" label="物资名称" width="120" />

    <el-table-column prop="quantity"  label=" 物资数量 " width="120" />

    <el-table-column prop="address" label="地址" width="600" />
    <el-table-column fixed="right" label="操作" width="120">


      <template #default="scope">
        <el-button @click="open1(scope);flag=true"  type="text" size="small">历史记录 </el-button>
        <el-button @click="handleFull" v-if="flag" type="text" size="small">返回全部</el-button>
      </template>
      </el-table-column >
  </el-table>
</template>

<script>
import {computed,ref} from "vue";

export default {
  name: "index",
  props:{
    UserDonateList:{
      type:Array,
      default:[]
    }
  },
  setup(props,{emit}){
    let flag=ref(false)
    // 获取props 模板中可以数据监听 在setup里面用得数据监听
    // 点击历史记录 查询历史
    const open1=(scope)=>{
      let id=scope.row.id
      emit('HistoryUsername',{id })
    }

    // 点击返回 获取所有数据
    const handleFull=()=>{
      flag.value=false
      emit('handleFullUser')
    }

    return {
      open1,flag,handleFull
    }
  }
}
</script>

<style scoped>


</style>
