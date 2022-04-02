<template>
  <div class="MaterialS_container">
    <Bread></Bread>
    <!-- 卡片试图区域 -->
    <el-card>
      <!--      <img src="./src/assets/address/" alt="">-->
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="4">
            <el-form-item prop="materialName" label="物资名" label-width="58px">
              <el-input  size="large" placeholder="请输入物资名" v-model="ruleForm.materialName" />
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4">
            <el-form-item prop="amount" label="数量" label-width="58px">
              <el-input  size="large" placeholder="请输入物资数量" v-model="ruleForm.amount" />
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4">
            <el-form-item prop="pid" label="负责人" label-width="58px">
              <el-select @change="optionChangeHandle" v-model="value" class="m-2" placeholder="请选择负责人" size="large">
                <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.principal"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;    &nbsp;  &nbsp;    &nbsp;    &nbsp;  &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4" >
            <el-button size="large" type="primary">出库</el-button>
          </el-col>
        </el-row>
<!--    第二行    -->
        <el-row>
          <el-col :span="4">
            <el-form-item prop="recipientMobile" label="电话" label-width="58px">
              <el-input  size="large" placeholder="请输入电话" v-model="ruleForm.recipientMobile" />
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4">
            <el-form-item prop="name" label="地址" label-width="58px">
              <el-cascader size="large" v-model="address"  placeholder="请选择地址"  @change="getCityList" :options="arr" />
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4">
            <el-form-item prop="recipientName" label="接收人" label-width="58px">
              <el-input  size="large" placeholder="请输入接收人姓名" v-model="ruleForm.recipientName" />
            </el-form-item>
          </el-col>  &nbsp;    &nbsp;    &nbsp;  &nbsp;    &nbsp;    &nbsp;  &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4" >
            <el-button size="large" type="primary" @click="empty" >清空</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!--  表格  -->
      <el-table border stripe highlight-current-row  :data="tableData" style="width: 100% ;margin-top: 20px">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="materialname" label="物资名"  />
        <el-table-column prop="username" label="捐赠人"  />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="principalName" label="负责人" />
      </el-table>

      <!--  分页  -->
      <Paging v-if="PagingList.total>PagingList.page" :PagingList="PagingList" @todatanum="toDataNum" @todata="donateToPage"></Paging>
    </el-card>

  </div>
</template>

<script >
import Bread from '@/components/Bread/index.vue'
import  Input from '@/components/Input/index.vue'
import city from './city.js'
import { Search } from '@element-plus/icons-vue'
import {materialPrincipal, materialScarcityLikeName, materialScarcityList} from "../../../api/materials";
import {onMounted, reactive, ref} from "vue";
import Paging from '@/components/Paging/index.vue'
import { getPutStorageList} from "../../../api/distribute";
export default {
  name: "index",
  components:{
    Bread,Search,Paging,Input
  },
  setup(){
    // 开关
    let Flag=ref(false)
    // 地址三级联动数据
    let arr=ref(city)
    //搜索框数据
    const iptSearch=ref('')
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

    // 表格
    const ruleFormRef = ref([])
    const ruleForm = reactive({
      materialName:'',  // 物资名
      address:'',  // 地址
        pid:'',   // 负责人
      amount:'',  //数量
      recipientName:'',  // 接收人
      recipientMobile:'' // 电话
    })
    const rules = reactive({
      name: [
        { message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
      ],
      region: [
        {
          required: true,
          message: 'Please select Activity zone',
          trigger: 'change',
        },
      ],
      date1: [
        {
          type: 'date',
          required: true,
          message: 'Please pick a date',
          trigger: 'change',
        },
      ]
    })

    // 现有库存数据
    const tableData =ref([])
    // 获取现有库存数据
    function  getTableData(){
      iptSearch.value=''
      let obj={
        pageSize:PagingList.value.num,
        pageNum:PagingList.value.page
      }
      getPutStorageList(obj).then((res)=>{
        if(res.code==200){
          console.log(res.data.items)
          res.data.items.forEach((item)=>{
            // 现金
            if(item.type==1){
              item.quantity=item.price
            }
          })
          tableData.value=res.data.items
          PagingList.value.total=res.data.total
        }
      })
    }
    onMounted(()=>{
      getTableData()
      // 获取负责人数据
      getOptions()
    })

    // 地址三级联动获取数据
    const getCityList=(val)=>{
      console.log(arr.value.flat(5))
      console.log(val)
    }


    // 出库框 ---- 负责人
    const  value = ref('')
    const options = ref([])
    // option选中值发生变化时触发
    const optionChangeHandle=(val)=>{
      ruleForm.pid=val
    }
    // 获取option数据
    const getOptions=()=>{
      materialPrincipal().then((res)=>{
        if(res.code==200){
          options.value=res.data.principal
        }
      })
    }


    // 搜索框模糊查询
    const searchUser=()=>{
      console.log(iptSearch.value)
      // 获取参数名
      let str=iptSearch.value.trim()
      let reqParams = {
        materialName: str,
        pageNum:PagingList.value.page,
        pageSize:PagingList.value.num
      }
      materialScarcityLikeName(reqParams).then((res)=>{
        if(res.code==200){
          console.log(res)
          tableData.value=res.data.searchScarceMaterial
          PagingList.value.total=res.data.total
        }
      })
    }

    // 清空
    const empty=()=>{
      console.log(111)
    }

    return {
      tableData,options,optionChangeHandle,value,
      PagingList,
      iptSearch,
      donateToPage,
      toDataNum,
      searchUser,getCityList,
      getTableData,
      ruleFormRef,
      ruleForm,arr,
      rules,
      Flag,
      empty
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

.el-form-item .el-form-item__content{
  margin-left: 0 !important;
}
</style>
