<template>
  <!--  分页  -->
  <el-pagination
     v-model:current-page="PagingList.page"
     v-model:page-size="PagingList.num"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 12,14 ,16]"
      background
      :total="PagingList.total"
     @current-change="cliHandle"
     @size-change="handleSizeChange"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "index",
  props:{
    PagingList:Object,
    default:{
      // 分页 总数量
      total:8,
      // 页容量
      num:10,
      // 页码
      page:1
    }
  },
  setup(props,{emit}){
    const cliHandle=(page)=>{
      emit('todata',page)
    }
    const handleSizeChange=(index)=>{
      console.log(index)
      emit('todatanum',index)
    }
return {
  cliHandle,handleSizeChange
}
  }
}
</script>

<style scoped>
.el-pagination{
  text-align: center;
  margin-top: 20px;
}
</style>
