<template>
  <div class="Material_container">
    <h2>入库</h2>
    <Bread></Bread>

    <!-- 卡片试图区域 -->
    <el-card>
      <!--  一/行  -->
      <el-row :gutter="14" class="rowT">
        <!--   列   搜索 -->
        <el-col :span="4">
          <el-input     class="w-50 m-2"
                        @blur="searchUser"
                        v-model="iptSearch"
                        size="large"
                        @keydown.enter="searchUser"
                        placeholder="请输入搜索物资名"
          >
            <template #append>
              <el-button  @click="searchUser" ><Search style="width: 28px;height: 16px;"></Search></el-button>
            </template>
          </el-input>
        </el-col>

        <el-col :span="2">
          <el-button size="large" type="primary">添加物品</el-button>
        </el-col>

        <!--    类型选择    -->
        <el-col :span="5">
          <span>类别 </span>
          <el-select v-model="value"   @change="selectHandle" class="m-2" placeholder="全部" size="large">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <!--  表格  -->
      <el-table stripe  highlight-current-row    @selection-change="handleSelectionChange" border :data="MaterialsTogetherList.value" style="width: 100%;margin-top: 20px">
        <el-table-column type="index" width="50" />
        <el-table-column type="selection" width="55" />

        <el-table-column prop="type" label="物资类型" width="120" />
        <el-table-column prop="materialname" label="物资名称" width="120" />
        <el-table-column prop="count" label="捐赠数量" width="120" />
        <el-table-column prop="quantity" label="物资数量" width="600" />
        <el-table-column fixed="right" label="操作" width="120">

          <template #default="scope">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jiahao"></use>
            </svg>
            <svg class="icon iconx" aria-hidden="true">
              <use xlink:href="#icon-hongseshanchuX"></use>
            </svg>
          </template>
        </el-table-column >
      </el-table>

      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])"
        >全选</el-button
        >
        <el-button @click="toggleSelection()">删除全选</el-button>
      </div>


      <!--   分页   -->
      <Paging :PagingList="PagingList" @todatanum="toDataNum" @todata="donateToPage"></Paging>
    </el-card>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import Bread from '@/components/Bread/index.vue'
import Paging from '@/components/Paging/index.vue'
import {reactive, ref} from "vue";
import {materialsList, materialsNameList} from "../../../api/materials";
import {ElMessage} from "element-plus";
export default {
  name: "index",
  components:{
    Bread ,Search,Paging
  },
  setup(){    //分页数据
    let PagingList=reactive({
      // 分页 总数量
      total:8,
      // 页容量
      num:12,
      // 页码
      page:1
    })
    // 子传父分页page
    const donateToPage=(page)=>{
      PagingList.page=page
      getMaterialsTogether()
    }
    // 子传父分页num
    const toDataNum=(num)=>{
      PagingList.num=num
      getMaterialsTogether()
    }

    // 表格列表
    let MaterialsTogetherList=reactive([])
    // 获取表格数据
    const getMaterialsTogether=()=>{
      let res={
        num:PagingList.num,
        page:PagingList.page
      }
      materialsList(res).then((res)=>{
        console.log(res)
        if(res.status==200) {
          res.results.forEach((item)=>{
            if(item.type==0){
              item.type='物品'
            }else{
              item.type='现金'
            }
          })
          MaterialsTogetherList.value = res.results
          PagingList.total=res.total
        }
      })
    }
    getMaterialsTogether()

    //搜索框数据
    const iptSearch=ref('')
    // 封装搜索数据函数
    function searchUsers(){
      let result={
        materialName:iptSearch.value.trim(),
        page:PagingList.page,
        num:PagingList.num
      }
      materialsNameList(result) .then((res)=>{
        if(res.status==200){
          console.log(res)
          res.results.forEach((item)=>{
            if(item.type==0){
              item.type='物品'
            }else{
              item.type='现金'
            }
          })
          MaterialsTogetherList.value=res.results
          PagingList.total=res.total
          iptSearch.value=''
        }else{
          ElMessage({
            message: '找不到该物资',
            type: 'error',
          })
          iptSearch.value=''
        }
      })
    }
    // let valSearch=ref('')
    // 搜索用户捐赠 保存数据
    const searchUser=()=>{
      // console.log(iptSearch.value.trim())
      // if(iptSearch.value.trim().length>0){
      //   // 类别选择的是现金
      //   if(valSearch.value==1){
      //     getUserDonateLikeFn(1)
      //   }
      //   else if(valSearch.value==0) {
      //     getUserDonateLikeFn(0)
      //   }else{
      //     searchUsers()
      //   }
      // }else{
      searchUsers()

      // }
    }

    // 表格选择框发生变化
    const handleSelectionChange=(selection)=>{
      console.log(selection)
    }
    return {
      MaterialsTogetherList,handleSelectionChange,PagingList,donateToPage,toDataNum,iptSearch,searchUser
    }
  }
}
</script>

<style scoped lang="less">
.Material_container{
  width: 100%;
  height: 98%;
  box-sizing: border-box;
}
.el-card{
  height: 95%;
}
.rowT{
  padding-top: 5px;
}
.el-table__body{
  width: 100%;
}
.Material_container   .el-table__body{
  width: 2190px !important
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.iconx{
  position: absolute;
  //top: 7px;
  left: 34px;
  right: 0;
  font-size: 22px;
}
</style>
