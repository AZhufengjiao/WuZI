<template>
<!-- 入库 -->
  <div class="MaterialS_container">
    <Bread></Bread>
    <!-- 卡片试图区域 -->
    <el-card>
      <!--  一/行  -->
      <el-row :gutter="14" class="rowT">
        <el-col :span="5">
           <Input @dataList="dataList" @dataLikeName="dataLikeName" ></Input>
        </el-col>

        <!--   列   添加 -->
        <el-col :span="2"  >
          <el-button size="large" type="primary"  @click="addMaterialHandle">添加物资</el-button>
        </el-col>

          <!--    时间    -->
          <Dates @datePickerHandle="datePickerHandle"></Dates>
      </el-row>

      <!--  表格  -->
      <el-table  border stripe highlight-current-row  :data="tableData" style="width: 100% ;margin-top: 20px">
        <el-table-column type="index" width="50" />
        <el-table-column prop="putDate" label="时间"  />
        <el-table-column prop="materialname" label="物资名称"  />
        <el-table-column prop="type" label="物资类型"  />
        <el-table-column prop="username" label="捐赠人"  />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="principalName" label="负责人" />

        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button type="text" size="small"  @click="updateMaterial(scope)" >修改物资</el-button>
            <el-button type="text" size="small" v-if="Flag!==0"  @click="getTableData" >返回全部</el-button>
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
          <el-form-item label="物资名"  prop="putMaterialName"  :label-width="formLabelWidth">
            <el-input size="large" v-model="addDateForm.putMaterialName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="捐赠人用户名"  prop="username"  :label-width="formLabelWidth">
            <el-input size="large" v-model="addDateForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="物资数量" prop="amount" :label-width="formLabelWidth">
            <el-input size="large" v-model="addDateForm.amount" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="pid" :label-width="formLabelWidth">
            <el-select @change="optionChangeHandle" v-model="value" class="m-2" placeholder="请选择负责人" size="large">
              <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.principal"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="物资类型" prop="putMaterialType" :label-width="formLabelWidth">
            <el-select @change="optionChangeHandleState" v-model="stateValue" class="m-2" placeholder="请选择物品类型" size="large">
              <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <!--   flag  true  是添加     -->
          <span v-if="flag" class="dialog-footer">
            <el-button  @click="addCancel"> 取消</el-button>
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
import  Input from '@/components/Input/index.vue'
import Dates from '@/components/Date/index.vue'
import { Search } from '@element-plus/icons-vue'
import {
  addMaterialStorage,
  getDateMaterials,
  materialPrincipal,
  materialStorageList,
  searchMaterialName, updateMaterialList
} from "../../../api/materials";
import {onMounted, onUpdated, reactive, ref} from "vue";
import Paging from '@/components/Paging/index.vue'
import {ElMessage} from "element-plus";
export default {
  name: "index",
  components:{
    Bread,Search,Paging,Input,Dates
  },
  setup(){
    // 切换分页
    let Flag=ref('')  // 0 是全部 ；1是模糊查询；2是时间
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
      if(Flag.value==0){
        getTableData()
      }else if(Flag.value==1){
        searchMaterialNameHandle()
      }else{
        datePickerHandle()
      }
      PagingList.page=page
    }
    // 子传父分页num
    const toDataNum=(num)=>{
      if(Flag.value==0){
        getTableData()
      }else if(Flag.value==1){
        searchMaterialNameHandle()
      }else{
        datePickerHandle()
      }
      PagingList.num=num
    }

    // 搜索 模糊查询入库物资名
    const searchName=ref('')

    //搜索框  获取所有数据
    const dataList=()=>{
      getTableData()
    }
    // 搜索框 模糊查询
const dataLikeName=(str)=>{
      searchName.value=str
  searchMaterialNameHandle()
}

    // 入库物资数据
    const tableData =ref([])
    // 获取入库物资函数
    function  getTableData(){
      let obj={
        pageSize:PagingList.value.num,
        pageNum:PagingList.value.page
      }
      materialStorageList(obj).then((res)=>{
        if(res.code==200){
          Flag.value=0
          res.data.items.forEach((item)=>{
            if(item.type==0){
              item.type='物品'
            }else{
              item.type='现金'
              item.quantity=item.price
            }
          })
          tableData.value=res.data.items
          PagingList.value.total=res.data.total
          searchName.value=''
        }
      })
    }


    // input事件触发模糊查询 获取数据
    const searchMaterialNameHandle=()=>{
      let obj={
        pageSize:PagingList.value.num,
        pageNum:PagingList.value.page,
        materialName:searchName.value
      }
      searchMaterialName(obj).then((res)=>{
        if(res.data.items.length !== 0){
          Flag.value=1
          res.data.items.forEach((item)=>{
            if(item.type==0){
              item.type='物品'
            }else{
              item.type='现金'
              item.quantity=item.price
            }
          })
          tableData.value=res.data.items
          PagingList.value.total=res.data.total
        }else{
          searchName.value = ''
          ElMessage({
            message: '找不到该物资',
            type: 'error',
          })
        }
      })
    }

    onMounted(()=>{
      getTableData()
      getOptions()
    })
    onUpdated(() => {
      console.log(111)
    })

    // 时间
    const value1 = ref('')
    const datePickerHandle = (value) => {
      let reg = /\\|\//g
      // 开始时间
      let startDate = value[0].toLocaleString().split(' ')[0].replace(reg, '-')
      // 结束时间
      let endDate = value[1].toLocaleString().split(' ')[0].replace(reg, '-')
      let obj = {
        startDate,
        endDate ,
        pageNum: PagingList.value.page,
        pageSize: PagingList.value.num
      }
      getDateMaterials(obj).then((res) => {
        if (res.code == 200) {
          Flag.value=0
          res.data.items.forEach((item)=>{
            if(item.type==0){
              item.type='物品'
            }else{
              item.type='现金'
              item.quantity=item.price
            }
          })
          tableData.value = res.data.items
          PagingList.value.total = res.data.total
        }
      })
    }


    // 添加框和修改框进行切换
    const flag=ref(null)
    const text=ref('')

    //添加框
    const centerDialogVisible = ref(false)
    const formLabelWidth = '120px'
    //添加框数据校验
    let  addDateForm = reactive({
      putStorageDate:'' ,// 时间
      username:'', // 捐赠人用户名
      putMaterialType:'', // 物资类型
      putMaterialName:'', // 物资名称
      amount:'', // 物资数量
      pid:''// 负责人
    })
    const addDateFormRef = ref('')
    const addDateRules=reactive({
      id:[{
        required:true,
        message:'请输入捐赠人姓名',
        trigger:'blur'
      },{
        min:1,
        max:12,
        message: '捐赠人姓名长度不宜过长',
        trigger:'blur'
      }],
      putMaterialName:[{
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
      putMaterialType:[{
        required:true,
        message:'请选择物品类型',
        trigger:'blur'
      }],
      amount:[{
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
    const options = ref([])
    // option选中值发生变化时触发
    const optionChangeHandle=(val)=>{
      addDateForm.pid=val
    }
    // 获取option数据
    const getOptions=()=>{
      materialPrincipal().then((res)=>{
        if(res.code==200){

          options.value=res.data.principal
        }
      })
    }
    // 添加框  ---- 状态
    // 修改角色
    const stateOptions=[
      {
        value:1,
        label:'现金',
      },{
        value:0,
        label:'物品',
      }
    ]
    const stateValue=ref('')
    // option类型选中值发生变化时触发
    const optionChangeHandleState=(val)=>{
      addDateForm.putMaterialType=val
    }


    //修改数据
    // 存储id
    let tid=ref('')
    // 点击添加框  true
    const addMaterialHandle=()=>{
      text.value='添加稀缺物资'
      flag.value=true
      centerDialogVisible.value=true
    }
    //  点击修改   false  回显数据
    const updateMaterial=(scope)=>{
      console.log(scope.row)
      tid.value=scope.row.tid
      text.value='修改稀缺物资'
      flag.value=false
      centerDialogVisible.value=true

      // 回显修改狂数据
      const {pid,materialname,username,quantity,type,price} =scope.row
      options.value.forEach((item)=>{
        if(item.id==pid){
          addDateForm.pid=item.principal
          value.value=item.principal
        }
      })
      addDateForm.username=username
      addDateForm.putMaterialType=type
      addDateForm.putMaterialName=materialname
      addDateForm.amount=quantity
      stateValue.value=type
    }
    //点击添加框确认按钮
    const addSubmitForm=(addDateFormRef)=>{
      //校验
      if (!addDateFormRef) return
      addDateFormRef.validate((valid) => {
        if (valid) {
          let today=new Date()
          let date= `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}  ${today.getHours()}:${today.getMinutes()}`;
          addDateForm.putStorageDate=date

          // 物品
          if(addDateForm.putMaterialType ==0){
              if(addDateForm.putMaterialName=='现金'){
                return ElMessage({
                  message: '类型是物品，物资名不能是现金！',
                  type: 'warning',
                })
              }
          }else{
            if(addDateForm.putMaterialName!=='现金'){
              return ElMessage({
                message: '类型是现金，物资名不能是物品！',
                type: 'warning',
              })
            }
          }

          addMaterialStorage(addDateForm).then((res)=>{
            if(res.code==200){
              ElMessage({
                message: '物资添加成功',
                type: 'success',
              })
              getTableData()

              addDateForm.putStorageDate=''
              addDateForm.username=''
              addDateForm.putMaterialType=''
              addDateForm.putMaterialName=''
              addDateForm.amount=''
              addDateForm.pid=''
              value.value=''
              stateValue.value=''
            }
          })

          centerDialogVisible.value = false
        } else {
          return false
        }
      })



    }
    // 点击添加框取消按钮
    const addCancel=()=>{
      centerDialogVisible.value = false

      addDateForm.putStorageDate=''
      addDateForm.username=''
      addDateForm.putMaterialType=''
      addDateForm.putMaterialName=''
      addDateForm.amount=''
      addDateForm.pid=''
      value.value=''
      stateValue.value=''
    }
    // 点击修改框确认按钮
    const updateSubmitForm=(addDateFormRef)=>{
      let pid=options.value.filter((item)=>item.principal===addDateFormRef.model.pid)[0].id
      let type=addDateFormRef.model.putMaterialType==='物品'?0:1
      let obj={
        id:tid.value,
        materialName:addDateFormRef.model.putMaterialName,
        username:addDateFormRef.model.username,
        amount:Number(addDateFormRef.model.amount),
        pid,
        materialType:type
      }
      // 物品
      if(addDateFormRef.model.putMaterialName=='现金'){
        if(addDateFormRef.model.putMaterialType==0){
          return ElMessage({
            message: '物资名是现金，类型不能是物品！',
            type: 'warning',
          })
        }
      }else {
        // 物品
        if(addDateFormRef.model.putMaterialType==1){
          return ElMessage({
            message: '物资名是物品，物资类型不能是现金！',
            type: 'warning',
          })
        }
      }
      updateMaterialList(obj).then((res)=>{
        if(res.code==200){
          addCancel()
          getTableData()
        }
      })
    }




    return {
      tableData,addCancel,
      PagingList,
      centerDialogVisible,
      addDateRules,
      addDateForm,
      addDateFormRef,
      formLabelWidth,
      addMaterialHandle,
      value,
      options,
      flag,
      text,
      searchName,dataList,
      searchMaterialNameHandle,
      updateMaterial,
      addSubmitForm,
      updateSubmitForm,
      optionChangeHandle,
      optionChangeHandleState,
      getOptions,
      donateToPage,dataLikeName,
      toDataNum,
      stateOptions,
      stateValue,getTableData,datePickerHandle,value1,Flag
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
