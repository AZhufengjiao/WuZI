<template>
  <div class="MaterialS_container">
    <Bread></Bread>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="4">
            <el-form-item prop="materialName"  label="物资名" label-width="75px">
              <el-input  size="large" @input="searchName" placeholder="请输入物资名" v-model="ruleForm.materialName" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="4">-->
<!--            <el-form-item prop="amount" label="数量" label-width="75px">-->
<!--              <el-input  size="large" placeholder="请输入物资数量" v-model="ruleForm.amount" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4">
            <el-form-item prop="pid" label="负责人" label-width="75px">
              <el-select @change="optionChangeHandle" v-model="ruleForm.pid" class="m-2" placeholder="请选择负责人" size="large">
                <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.principal"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;    &nbsp;  &nbsp;
          <el-col :span="4">
            <el-form-item prop="recipientName" label="接收人" label-width="75px">
              <el-input  size="large" placeholder="请输入接收人姓名" v-model="ruleForm.recipientName" />
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;  &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4" >
            <el-button size="large" type="primary" @click="provideHandle(ruleFormRef)">出库</el-button>
          </el-col>
        </el-row>
<!--    第二行    -->
        <el-row>
          <el-col :span="4">
            <el-form-item prop="recipientMobile" label="电话" label-width="75px">
              <el-input  size="large" placeholder="请输入电话" v-model="ruleForm.recipientMobile" />
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4">
            <el-form-item prop="address" label="地址" label-width="75px">
              <el-cascader size="large" v-model="ruleForm.address"  placeholder="请选择地址"  @change="getCityList" :options="arr" />
            </el-form-item>
          </el-col>
          &nbsp;    &nbsp;    &nbsp;
          &nbsp;    &nbsp;    &nbsp;  &nbsp;     &nbsp;    &nbsp;    &nbsp;  &nbsp;     &nbsp;    &nbsp;    &nbsp;  &nbsp;     &nbsp;    &nbsp;    &nbsp;  &nbsp;     &nbsp;    &nbsp;    &nbsp;  &nbsp;      &nbsp;    &nbsp;  &nbsp;     &nbsp;    &nbsp;    &nbsp;  &nbsp;    &nbsp;    &nbsp;    &nbsp;  &nbsp;   &nbsp;    &nbsp;  &nbsp;    &nbsp;    &nbsp;
          <el-col :span="4" >
            <el-button size="large" style="margin-left: 2px" type="primary" @click="empty" >清空</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!--  表格  -->
      <el-table border     @selection-change="handleSelectionChange" stripe highlight-current-row  :data="tableData" style="width: 100% ;margin-top: 20px">
        <el-table-column v-if="Flag" type="index" width="50" />
        <el-table-column v-if="!Flag" type="selection" width="55" />
        <el-table-column   prop="materialname" label="物资名"  />
        <el-table-column  prop="username" label="捐赠人"  />
        <el-table-column  prop="quantity" label="数量" />
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
import {getPutStorageList, getPutStorageNameList, postDelivery} from "../../../api/distribute";
import {ElMessage} from "element-plus";
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
      if(Flag.value){
        getTableData()
      }else{
        searchName()
      }

    }
    // 子传父分页num
    const toDataNum=(num)=>{
      PagingList.num=num
      if(Flag.value){
        getTableData()
      }else{
        searchName()
      }
    }

    // 表格
    const ruleFormRef = ref([])
    const ruleForm = ref({
      ids:[],
      materialName:'',  // 物资名
      address:'',  // 地址
        pid:'',   // 负责人
      amount:'',  // 数量
      recipientName:'',  // 接收人
      recipientMobile:'' ,// 电话
      deliveryDate:''  //时间
    })
    const rules = reactive({
      materialName: [
        {
          required:true,
          message:'请输入出库物资',
          trigger:'blur'
        },{
          min:2,
          max:12,
          message: '物资名长度不能超过2-12个字符',
          trigger:'blur'
        }
      ],
      address: [
        {
          required: true,
          message: '请选择地址',
          trigger: 'blur'
        },
      ],
      recipientName: [
        {
          required: true, min: 1, max: 12,
          message: '请输入接收人',
          trigger: 'blur'
        },
      ],
      recipientMobile: [
        {
          required:true,
          message:'请输入手机号',
          trigger:'blur'
        },
        {
          pattern: /(^1[3|4|5|7|8]\d{9}$)|(^\d{3,4}-\d{7,8}$)|(^\d{7,8}$)|(^\d{3,4}-\d{7,8}-\d{1,4}$)|(^\d{7,8}-\d{1,4}$)/,
          message: '号码格式错误，请重新输入',
          trigger:'blur'
        }
      ],
      pid: [
        {
          required: true,
          message: '请选择负责人',
          trigger: 'blur'
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
          Flag.value=true
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

    // 地址三级联动获取数据  递归遍历
    let address=ref('')
    const getCityList=(val)=>{
      val.value=val
      let str=[]
      let num=0
      function fn(arr ,val,num){
        arr.forEach((item)=>{
        if(item.value===val[num]){
          if(num===2){
            str.push(item.label)
            return str
          }else{
            str.push(item.label)
            num+=1
            fn(item.children,val,num)
          }
        }
        })
      }
      fn(arr.value,val,num)
      str=str.toString().replace(/,/g,' ')
      ruleForm.address=str
      address.value=str
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


    // 清空
    const empty=()=>{
      ruleForm.value.id=[]
      ruleForm.value.materialName=''
      ruleForm.value.address=''
      ruleForm.value.pid=''
      ruleForm.value.amount=''
      ruleForm.value.recipientName=''
      ruleForm.value.recipientMobile=''
      ruleForm.value.deliveryDate=''
    }

    // 根据出库物资名模糊查询
    const searchName=()=>{
      // 获取参数名
      let str=ruleForm.value.materialName.trim()
      let reqParams = {
        materialName: str,
        pageNum:PagingList.value.page,
        pageSize:PagingList.value.num
      }
      getPutStorageNameList(reqParams).then((res)=>{
        if(res.data.items.length>0){
          res.data.items.forEach((item)=>{
            // 现金
            if(item.type==1){
              item.quantity=item.price
            }
          })
          Flag.value=false
          tableData.value=res.data.items
          PagingList.value.total=res.data.total
        }else{
       return   ElMessage({
            message: '查询不到该物资',
            type: 'warning',
          })
        }
      })
    }

    // 选择框发生变化触发 获取id
    const handleSelectionChange=(val)=>{
      if(   Flag.value )return
      let num=0
      val.forEach((item)=>{
      num+=item.quantity
        ruleForm.value.ids.push(item.tid)
      })
      ruleForm.value.amount=num
    }

    // 点击出库按钮
    const provideHandle=(formEl)=>{
      //校验
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          if(ruleForm.value.ids.length===0){
          return ElMessage({
              message: '请选择出库物资',
              type: 'warning',
            })
          }

          let today=new Date()
          let date= `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}`;
          formEl.model.deliveryDate=date
          formEl.model.address=address.value

          console.log(ruleForm.value)

          postDelivery(ruleForm.value).then((res)=>{
            console.log(res)
            if(res.code==200){
              ElMessage.success('该物资出库成功')
              getTableData()
              empty()
            }
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }



    return {
      tableData,options,optionChangeHandle,value,provideHandle,handleSelectionChange,
      PagingList,
      iptSearch,
      donateToPage,
      toDataNum,
 getCityList,
      getTableData,searchName,
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
