<template>
  <div class="MaterialS_container">
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

      <!--   列   添加 -->
      <el-col :span="5"  >
        <el-button size="large" type="primary"  @click="addMaterialHandle">添加物资</el-button>
      </el-col>
    </el-row>

    <!--  表格  -->
    <el-table  border stripe highlight-current-row  :data="tableData" style="width: 100% ;margin-top: 20px">
      <el-table-column type="index" width="50" />
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
          <el-button type="text" size="small"  @click="updateMaterial" >修改物资</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--  分页  -->
      <Paging v-if="PagingList.total>PagingList.page" :PagingList="PagingList" @todatanum="toDataNum" @todata="donateToPage"></Paging>

    <!--    添加弹出框    -->
    <el-dialog width="600px"  v-model="centerDialogVisible" :title=text  >
      <el-form
          ref="addDateFormRef"
          :rules="addDateRules"
          :model="addDateForm">
        <el-form-item label="稀缺物资名"  prop="username"  :label-width="formLabelWidth">
          <el-input size="large" v-model="addDateForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="物资数量" prop="quantity" :label-width="formLabelWidth">
          <el-input size="large" v-model="addDateForm.quantity" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="pid" :label-width="formLabelWidth">
          <el-select v-model="value" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采购状态" prop="state" :label-width="formLabelWidth">
          <el-input size="large" v-model="addDateForm.state" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
<!--   flag  true  是添加     -->
          <span v-if="flag" class="dialog-footer">
           <el-button  @click="centerDialogVisible = false"> 取消</el-button>
           <el-button type="primary" @click="addSubmitForm(addDateFormRef)" >确认</el-button  >
          </span>

        <!--   flag  false  是修改     -->
        <span v-else class="dialog-footer">
           <el-button  @click="centerDialogVisible = false"> 取消</el-button>
           <el-button type="primary" @click="updateSubmitForm(addDateFormRef)" >确认</el-button  >
          </span>
      </template>
    </el-dialog>




  </el-card>

  </div>
</template>

<script >
import Bread from '@/components/Bread/index.vue'
import { Search } from '@element-plus/icons-vue'
import {materialScarcityList} from "../../../api/materials";
import {onMounted, reactive, ref} from "vue";
import Paging from '@/components/Paging/index.vue'
export default {
  name: "index",
  components:{
    Bread,Search,Paging
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

    // 获取稀缺物资函数
    function  getTableData(){
      let obj={
        num:PagingList.value.num,
        page:PagingList.value.page
      }
      materialScarcityList(obj).then((res)=>{
        if(res.status==200){
          tableData.value=res.results
        }
      })
    }
    onMounted(()=>{
      getTableData()
    })


    // 添加框和修改框进行切换
    const flag=ref(null)
    const text=ref('')
    //搜索框数据
    const iptSearch=ref('')

    // 稀缺物资数据
    const tableData =ref([])

    //添加框
    const centerDialogVisible = ref(false)
    const formLabelWidth = '100px'
    //添加框数据
    const  addDateForm = reactive({
     username: '',  // 物资名
     quantity:'',  // 物资数量
     pid:'', // 负责人
     state: '',  // 采购状态
    })
    const addDateFormRef = ref('')
    // 添加物资校验
    const addDateRules=reactive({
      username:[{
        required:true,
        message:'请输入稀缺物资名',
        trigger:'blur'
      },{
        min:1,
        max:12,
        message: '稀缺物资名长度不宜过长',
        trigger:'blur'
      }],
      pid:[{
        required:true,
        message:'请选择负责人',
        trigger:'blur'
      }],
      quantity:[{
        required:true,
        message:'请输入数量',
        trigger:'blur'
      },{
        min:1,
        max:12,
        message: '数量已经超出了上限',
        trigger:'blur'
      }],
    })
    // 添加框 ---- 负责人
    const  value = ref('')
    const options = [
      {
        value: 'Option1',
        label: 'Option1',
      },
      {
        value: 'Option2',
        label: 'Option2',
      },
      {
        value: 'Option3',
        label: 'Option3',
      },
      {
        value: 'Option4',
        label: 'Option4',
      },
      {
        value: 'Option5',
        label: 'Option5',
      },
    ]

    // 点击添加框  true
    const addMaterialHandle=()=>{
      text.value='添加稀缺物资'
      flag.value=true
      centerDialogVisible.value=true
    }
    //  点击修改   false
    const updateMaterial=()=>{
      text.value='修改稀缺物资'
      flag.value=false
      centerDialogVisible.value=true
    }





    return {
      tableData,
      PagingList,
      iptSearch,
      centerDialogVisible,
      addDateRules,
      addDateForm,
      addDateFormRef,
      formLabelWidth,
      addMaterialHandle,value,options,flag,text,updateMaterial
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
