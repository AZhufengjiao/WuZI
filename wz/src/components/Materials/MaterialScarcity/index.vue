<template>
  <div class="MaterialS_container">
  <Bread></Bread>
  <!-- 卡片试图区域 -->
  <el-card>
    <!--  一/行  -->
    <el-row :gutter="14" class="rowT">
      <!--   列   搜索 -->
      <el-col :span="5">
        <Input @dataList="dataList" @dataLikeName="dataLikeName" ></Input>
      </el-col>
    </el-row>

    <!--  表格  -->
    <el-table border stripe highlight-current-row  :data="tableData" style="width: 100% ;margin-top: 20px">
      <el-table-column type="index" width="50" />
      <el-table-column prop="type" label="物资类型"  />
      <el-table-column prop="materialname" label="物资名"  />
      <el-table-column prop="quantity" label="数量" />
      <!-- 状态 -->
      <el-table-column prop="state"  label="采购状态">
        <template #default="scope">
          <el-tag  class="ml-2" type="warning"> 稀缺</el-tag>
          <el-tag v-if="scope.row.state==1" class="ml-2" type="info">待采购</el-tag>
        </template>
      </el-table-column>

<!--      <template>-->
<!--        <el-empty description="description" />-->
<!--      </template>-->

    </el-table>

<!--  分页  -->
      <Paging v-if="PagingList.total>PagingList.page" :PagingList="PagingList" @todatanum="toDataNum" @todata="donateToPage"></Paging>
  </el-card>

  </div>
</template>

<script >
import Bread from '@/components/Bread/index.vue'
import  Input from '@/components/Input/index.vue'
import { Search } from '@element-plus/icons-vue'
import {materialScarcityLikeName, materialScarcityList} from "../../../api/materials";
import {onMounted, reactive, ref} from "vue";
import Paging from '@/components/Paging/index.vue'
export default {
  name: "index",
  components:{
    Bread,Search,Paging,Input
  },
  setup(){
    //搜索框数据
    const searchName=ref('')
    // 分页
    let PagingList=ref({
      // 分页 总数量
      total:8,
      // 页容量
      num:10,
      // 页码
      page:1
    })
    // 子传父分页page
    const donateToPage=(page)=>{
      PagingList.page=page
      getTableData()
    }
    // 子传父分页num
    const toDataNum=(num)=>{
      PagingList.num=num
      getTableData()
    }

    //搜索框  获取所有数据
    const dataList=()=>{
      getTableData()
    }
    // 搜索框 模糊查询
    const dataLikeName=(str)=>{
      searchName.value=str
      searchUser()
    }

    // 稀缺物资数据
    const tableData =ref([])
    // 获取稀缺物资函数
    function  getTableData(){
      searchName.value=''
      let obj={
        num:PagingList.value.num,
        page:PagingList.value.page
      }
      materialScarcityList(obj).then((res)=>{
        if(res.status==200){
          console.log(res)

          res.data.items.forEach((item)=>{
            if( item.materialname!=='现金' ){
             item.type='物品'
            }else{
              item.type='现金'
            }
          })
          tableData.value=res.data.items
          PagingList.value.total=res.data.total
        }
      })
    }
    onMounted(()=>{
      getTableData()
    })


    // 搜索框模糊查询
    const searchUser=()=>{
      console.log(searchName.value)
      // 获取参数名
      let str=searchName.value.trim()
      let reqParams = {
        materialName: str,
        pageNum:PagingList.value.page,
        pageSize:PagingList.value.num
      }
      materialScarcityLikeName(reqParams).then((res)=>{
        if(res.code==200){
          console.log(res)

          res.data.searchScarceMaterial.forEach((item)=>{
            if( item.materialname!=='现金' ){
              item.type='物品'
            }else{
              item.type='现金'
            }
          })
          tableData.value=res.data.searchScarceMaterial
          PagingList.value.total=res.data.total
        }
      })
    }

    return {
      dataList,
      dataLikeName,
      tableData,
      PagingList,
      searchName,
      donateToPage,
      toDataNum,
      searchUser,getTableData
    }
  }
}
</script>

<style scoped>
.MaterialS_container{
  width: 100%;
  height: 98%;
  box-sizing: border-box;
}

.el-card{
  height: 95%;
}
</style>
