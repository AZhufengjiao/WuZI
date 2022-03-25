<template>
  <div class="Material_container">
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

      <!--   列   时间 -->
      <el-col :span="5">
        <div class="demo-date-picker"     >
          <div class="block"    >
            <el-date-picker size="large"
                            v-model="value1"
                            type="daterange"
                            @change="datePickerHandle"
                            range-separator="To"
                            start-placeholder="Start date"
                            end-placeholder="End date"
            />
          </div>
        </div>
      </el-col>
    </el-row>

<!--  表格  -->
    <el-table highlight-current-row  stripe   @select-all="handleSelectAll"
              @select="handleSelectionChange"
              border
              :data="MaterialsTogetherList.value"
              style="width: 100%;margin-top: 20px">
      <el-table-column v-if=" flag" type="index" width="50" />
      <el-table-column prop="date" label="日期"  />
      <el-table-column v-if="!flag" type="selection" width="55" />
      <el-table-column prop="type" label="物资类型" width="120" />
      <el-table-column prop="materialname" label="物资名称" width="120" />
      <el-table-column v-if="flag " prop="count" label="捐赠数量" width="120" />
      <el-table-column v-if="!flag " prop="username" label="捐赠人" width="120" />
      <el-table-column prop="quantity" label="物资数量" width="600" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">

          <el-button @click="lookHandle(scope)" v-if="flag"  type="text" size="small"> 查看详情</el-button>
          <el-button  @click="MaterialsEcho(scope)"  v-if="!flag"  type="text" size="small">修改</el-button>
          <!--删除按钮-->
          <el-popconfirm
              v-if="!flag"
              confirm-button-text="yes"
              cancel-button-text="No"
              icon-color="red"
              title="您确定要删除该物资吗?"
              @confirm="confirmEvent(scope)"
          >
            <template #reference>
              <el-button    type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column >
    </el-table>

    <div v-if="!flag" style="margin-top: 20px">
      <el-button @click="DelSelect "
      >删除选择</el-button
      >


      <el-popover
          v-model:visible="visible"
          placement="bottom"
          title="提示"
          :width="200"
          content="全选不成功，请全选"
      >
        <template #reference>
          <el-button @click="allSelection">删除全选</el-button>
        </template>
      </el-popover>
    </div>

    <!--   分页   -->
    <Paging :PagingList="PagingList" @todatanum="toDataNum" @todata="donateToPage"></Paging>

    <!--    修改框    -->
    <el-dialog width="600px"    v-model="dialogFormUpDate" title="修改物资"  >
      <el-form
          ref="updateFormRef"
          :rules="updateRules"
          :model="updateForm">
        <el-form-item label="物资名"  prop="materialName"  :label-width="formLabelWidth">
          <el-input size="large" v-model="updateForm.materialName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="捐赠人" prop="username" :label-width="formLabelWidth">
          <el-input size="large" v-model="updateForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity" :label-width="formLabelWidth">
          <el-input size="large" v-model="updateForm.quantity" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="捐赠类型" prop="type" :label-width="formLabelWidth">
          <el-select     @change="optionChange" v-model="value" class="m-2" :placeholder="updateForm.type">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
           <el-button  @click="dialogFormUpDate = false"> 取消</el-button>
           <el-button type="primary" @click="updateSubmitForm(updateFormRef)" >确认</el-button  >
          </span>
      </template>
    </el-dialog>

  </el-card>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import Bread from '@/components/Bread/index.vue'
import Paging from '@/components/Paging/index.vue'
import {reactive, ref} from "vue";
import {
  materialsList,
  materialsNameList,
  delMaterials,
  updateMaterials,
  updateMaterialsP, putMaterialsState, DelMaterialsState
} from "../../../api/materials";
import {ElMessage} from "element-plus";
export default {
  name: "index",
  components:{
    Bread ,Search,Paging
  },
  setup(){
    // 时间
    const value1 = ref('')
    const datePickerHandle=()=>{
      let reg=/\\|\//g
      // 开始时间
      let stateData=value1.value[0].toLocaleString().split(' ')[0].replace(reg,'-')
      // 结束时间
      let endData=value1.value[1].toLocaleString().split(' ')[0].replace(reg,'-')
      console.log( stateData,endData)
    }

    //分页数据
    let flag=ref(true)
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
    // 点击查看详情，保存物资名
    let materialName=ref('')
    // 通过物资名查询数据
    function getMaterialName(){
      let result={
        materialName:materialName.value,
        page:PagingList.page,
        num:PagingList.num
      }
      materialsNameList(result) .then((res)=>{
        if(res.status==200 && res.results.length>0){
          console.log(res)
          MaterialsTogetherList.value=res.results
          PagingList.total=res.total
          iptSearch.value=''
        }else{
          getMaterialsTogether()
        }
      })
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
          // res.results.forEach((item)=>{
          //   item.date=item.date.substring(0,10)
          // })
          MaterialsTogetherList.value = res.results
          PagingList.total=res.total
        }
      })
      flag.value=true
    }
    getMaterialsTogether()
    // 表格选择框定义一个数据存储选中的数据
    let selectList=ref([])
    // 存储一个全选长度
    let selectListLength=ref('')
    // 表格选择框发生变化
    const handleSelectionChange=(selection)=>{
      // 存储用户选择的选项
      selectList.value=selection
      console.log( selectList.value)
    }
    // 给全选设置一个开关
    let SelectAllFlag=ref(false)
    // 表格全选改变触发
    const handleSelectAll=(selection)=>{
      SelectAllFlag.value=!SelectAllFlag.value
      if( SelectAllFlag.value==true){
        selectList.value=selection
        selectListLength.value=selection.length
      }else{
        selectList.value=[]
      }
    }
    // 点击删除选择
    const DelSelect=()=>{
      if(selectList.value.length==0) return
      let arr=selectList.value
      console.log(arr)
      arr.forEach((item)=>{
        putMaterialsState(item.tid)
      })
      console.log( selectList.value)
      DelMaterialsState().then((res)=>{
        if(res.status==200){
          getMaterialName()
        }
      })
    }
    // 删除全部选中
    const visible = ref(false)
    const allSelection=()=>{
      // 判断全选是否选择
      console.log(
          selectListLength.value,selectList.value.length
      )
      if(selectListLength.value!=selectList.value.length){
          return   visible.value = !visible
      }else{
        if(SelectAllFlag.value==true){
          selectList.value.forEach((item)=>{
            putMaterialsState(item.tid)
          })
        }
        DelMaterialsState().then((res)=>{
          if(res.status==200){
            getMaterialsTogether()
          }
        })
      }
    }

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
    let valSearch=ref('')
    // 搜索用户捐赠 保存数据
    const searchUser=()=>{
      flag.value=false
      // console.log(iptSearch.value.trim())
      if(iptSearch.value.trim().length>0){
        searchUsers()
      }else   {
        getMaterialsTogether()
      }
    }

    // 点击删除按钮
    const confirmEvent=( scope)=>{
      let tid= scope.row.tid
      delMaterials(tid).then((res)=>{
        console.log(res)
        if(res.status==200){
          ElMessage.success('该物资删除成功')
        }
      })
      getMaterialName()
    }
    // 点击查看详情
    const lookHandle=(scope)=>{
      flag.value=false
      materialName.value=scope.row.materialname
      getMaterialName()
    }

    // 修改图标框
    const dialogFormUpDate = ref(false)
    const formLabelWidth = '70px'

    // 修改角色
    const options=[
      {
        value:'1',
        label:'现金',
      },{
        value:'0',
        label:'物品',
      }
    ]
    const value=ref('')
    // 选择器切换触发
    const optionChange=(val)=>{
      value.value=val
    }
    // 修改框
    let updateForm = reactive({
      type: '',  // 类型
      materialName:'',  // 物资名
      username:'', // 用户名
      quantity: '',  // 数量
    })
    const updateFormRef = ref('')
    // 修改用户注册校验
    const updateRules=reactive({
      materialName:[{
        required:true,
        message:'请输入物资名',
        trigger:'blur'
      },{
        min:1,
        max:12,
        message: '物资名长度不能超过1-12个字符',
        trigger:'blur'
      }],
      username:[{
        required:true,
        message:'请输入捐赠人名',
        trigger:'blur'
      },{
        min:1,
        max:12,
        message: '物资名长度不能超过1-12个字符',
        trigger:'blur'
      }],
      quantity:[{
        required:true,
        message:'请输入数量',
        trigger:'blur'
      },{
        min:1,
        max:12,
        message: '数量不能超过1-12个字符',
        trigger:'blur'
      }],
    })


    // 保存数据id
    let  materialsId=ref('')
    // 点击修改 回显数据
    const MaterialsEcho=(scope)=>{
      materialsId.value=scope.row.tid
      const {materialname,quantity,type,username} =scope.row
      updateForm.materialName=materialname
      updateForm.username=username
      updateForm.quantity=quantity
      updateForm.type=type
      dialogFormUpDate.value=true
    }
    // 点击修改框确认按钮，修改数据
    const updateSubmitForm=(data)=>{
      let tid=materialsId.value
      let {materialName,username,quantity,type}=data.model
      type=value.value
      //  物品
      if(type==0){
        type=0
        let res={
          tid,materialName,username,quantity,type
        }
        if(materialName=='现金'){
          return ElMessage({
            message: '类型是物品，物资名不能是现金！',
            type: 'warning',
          })
        }
        updateMaterials(res).then((result)=>{
          if(result.status==200){
            getMaterialName()
            ElMessage({
              message: '物资修改成功',
              type: 'success',
            })
            value.value=''
            updateForm.username=''
            updateForm.materialName=''
            updateForm.quantity=''
            dialogFormUpDate.value=false
          }
        })
      }else{
        type=1
        let res={
          tid,materialName,username,type,price:quantity
        }
        res.materialName='现金'
        updateMaterialsP(res).then((result)=>{
          if(result.status==200){
            getMaterialName()
            ElMessage({
              message: '物资修改成功',
              type: 'success',
            })
            value.value=''
            updateForm.username=''
            updateForm.materialName=''
            updateForm.quantity=''
            dialogFormUpDate.value=false

          }
        })
      }

    }

    return {
      lookHandle,optionChange,
      confirmEvent,
      flag,
      MaterialsTogetherList,
      handleSelectionChange,
      PagingList,
      donateToPage,
      toDataNum,
      iptSearch,
      searchUser,value1,datePickerHandle,
      formLabelWidth,
      dialogFormUpDate,visible,
      updateForm,
      updateFormRef,
      updateRules,
      options,
      value,
      MaterialsEcho,
      updateSubmitForm,DelSelect,handleSelectAll,allSelection
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
 .iconX{
   position: absolute;
   left: 16px;
   top: 8px;
   color: red;
   font-size: 18px;
 }
</style>
