<template>

  <Bread></Bread>
  <!-- 卡片试图区域 -->
  <el-card>
    <!--  一/行  -->
    <el-row :gutter="14" class="rowT">
      <!--   列   搜索 -->
      <el-col :span="5">
        <el-input     class="w-50 m-2"
                      size="large"
                      placeholder="请输入稀缺物品名"
        >
          <template #append>
            <el-button   ><Search style="width: 28px;height: 16px;"></Search></el-button>
          </template>
        </el-input>
      </el-col>
      <!--   列   时间 -->
      <el-col :span="5">
        <div class="demo-date-picker"   @panel-change="datePickerHandle"  >
          <div class="block"  >
            <el-date-picker size="large"
                v-model="value1"
                type="daterange"

                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <!--  表格  -->
    <el-table  border stripe highlight-current-row  :data="tableData" style="width: 100% ;margin-top: 20px">
      <el-table-column type="index" width="50" />
      <el-table-column prop="date" label="日期"  />
      <el-table-column prop="username" label="物资名"  />
      <el-table-column prop="quantity" label="数量" />
      <el-table-column prop="pid" label="负责人" />
      <!-- 状态 -->
      <el-table-column prop="state"  label="采购状态">
        <template #default="scope">
          <el-tag  class="ml-2" type="warning"> 稀缺</el-tag>
          <el-tag v-if="scope.row.state==1" class="ml-2" type="info">待采购</el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button type="text" size="small">添加物资</el-button>
          <el-button type="text" size="small">修改物资</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script >
import Bread from '@/components/Bread/index.vue'
import { Search } from '@element-plus/icons-vue'
import {materialScarcityList} from "../../../api/materials";
import {ref} from "vue";
export default {
  name: "index",
  components:{
    Bread,Search
  },
  setup(){
    // 分页
    let PagingList=ref({
      // 分页 总数量
      total:8,
      // 页容量
      num:10,
      // 页码
      page:1
    })

    // 稀缺物资数据
    const tableData =ref([])

    // 时间
    const value1 = ref('')
    const datePickerHandle=(date, mode, view )=>{
      console.log(date, mode, view)
    }

    // 获取稀缺物资函数
    function  getTableData(){
      let obj={
        num:PagingList.value.num,
        page:PagingList.value.page
      }
      materialScarcityList(obj).then((res)=>{
        if(res.status==200){
          res.results.forEach((item)=>{
            item.date=item.date.substring(0,10)
          })
          tableData.value=res.results
        }

      })
    }
    getTableData()

    return {
      tableData,value1,datePickerHandle
    }
  }
}
</script>

<style scoped>
.Material_container{
  width: 100%;
  height: 98%;
  box-sizing: border-box;
}
.el-card{
  height: 95%;
}
</style>
