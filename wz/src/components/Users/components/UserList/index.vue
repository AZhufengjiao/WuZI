<template>
<div class="user_container">
  <!-- 面包屑 -->
  <Bread></Bread>

  <!-- 卡片试图区域 -->
  <el-card>
    <!--  一/行  -->
    <el-row :gutter="20" class="rowT">
      <!--   列   -->
      <el-col :span="5"><div class="grid-content bg-purple"></div>
        <el-input
            @blur="searchUser"
            v-model="iptSearch" size="large"
            placeholder="请输入搜索姓名"
            @keydown.enter="searchUser"
        >
          <template #append>
            <el-button  @click="btnSearchCli" ><Search style="width: 28px;height: 16px;"></Search></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table highlight-current-row class="table" v-loading="loading" :data="tableData.value " border  size="large" style="width: 100% ">
      <el-table-column prop="id" label="序号" width="60"/>
      <el-table-column prop="username" label="姓名"  />
      <el-table-column prop="mobile" label="电话"  />
      <el-table-column prop="email" label="邮箱"  />
      <el-table-column prop='role' label="角色" />
      <!--   状态   -->
      <el-table-column prop="state" label="状态">
        <template #default="scope">
          <el-switch @click="open1(scope)" @change="switchChange(scope)" v-model="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template #default="scope">
          <el-button @click="huiXianForm(scope)"  type="primary"><el-icon><edit-pen /></el-icon></el-button>
          <!--删除按钮-->
          <el-popconfirm
              confirm-button-text="Yes"
              cancel-button-text="No"
              icon-color="red"
              title="您确定要删除该用户吗?"
              @confirm="confirmEvent(scope)"
          >
            <template #reference>
              <el-button type="danger"><el-icon><delete /></el-icon></el-button>
            </template>
          </el-popconfirm>
          <el-button type="warning"><el-icon><setting /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--  分页  -->
    <el-pagination
        v-model:current-page="page"
        v-model:page-size="num"
        :page-sizes="[5, 10, 15 , 20]"
        background
        class="paging"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="updateCurrent"
    >
    </el-pagination>

    <!--    修改框    -->
    <el-dialog width="600px"    v-model="dialogFormUpDate" title="修改用户"  >
      <el-form
          ref="updateFormRef"
          :rules="updateRules"
          :model="updateForm">
        <el-form-item label="姓名"  prop="username"  :label-width="formLabelWidth">
          <el-input size="large" v-model="updateForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
          <el-input size="large" v-model="updateForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input size="large" v-model="updateForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role" :label-width="formLabelWidth">
          <el-select v-model="value" class="m-2" :placeholder="updateForm.role">
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
           <el-button  @click="dialogFormUpDate = false">取消</el-button>
           <el-button type="primary" @click="updateSubmitForm(updateFormRef)" >确认</el-button  >
          </span>
      </template>
    </el-dialog>
  </el-card>
</div>

</template>

<script>
import { reactive, ref,h,} from 'vue'
import { Search ,EditPen,Delete,Setting} from '@element-plus/icons-vue'
import Bread from '@/components/Bread/index.vue'
import {DelUser, userList, updateState, upDataUser, getUsernameLike} from "../../../../api/user";
import {ElMessage,ElNotification} from "element-plus";
export default {
  name: "index",
  setup(){
    // 加载
    const loading = ref(true)
    // 搜索输入框双向绑定
    const iptSearch=ref('')
    //  表格数据
    let tableData =reactive([])
    let newRole=ref('')

    // 分页 总数量
    let total=ref(8)
    // 页容量
    let num=ref(10)
    // 页码
    let page=ref(1)
    // 分页当前页跳转触发
    const updateCurrent= (val ) => {
      page.value=val
      getData()
    }

    // 获取用户列表信息
    function getData(){
      loading.value=true
      let request = {
        num: num.value,
        page: page.value
      }
      userList(request).then((data)=>{
        if(data.status==200){

          data.results.forEach(item => {
            item.role=item.role?"管理员":'用户'
          })
          tableData.value= data.results
          loading.value=false
          total.value=data.total[0].total
          value.value=  tableData.value.role

        }

      })
    }
    // 获取数据
    getData()

    //功能
    // 搜索数据封装函数
    function searchUsers () {
      let request = {
        username:iptSearch.value.trim(),
        num: num.value,
        page: page.value
      }
      getUsernameLike(request).then((res)=>{

        console.log(res)
        if(res.code==200){
          res.results.forEach(item => {
            item.role=item.role?"管理员":'用户'
          })
          tableData.value= res.results
        }else{
          ElMessage({
            message: '找不到该用户',
            type: 'error',
          })
          iptSearch.value=''
        }
      })
    }
    // 点击搜索按钮
    const btnSearchCli=()=>{
      if(iptSearch.value.trim()===''){
        getData()
        return
      }
      searchUsers()
    }
    // 搜索框失去焦点事件
    const searchUser=()=>{
      if(iptSearch.value.trim()===''){
        getData()
        return
      }
      searchUsers()
    }
    // 点击删除按钮
    const confirmEvent=(scope)=>{

      DelUser(scope.row.id).then((res)=>{
        console.log(res)
        if(res.status==200){
          ElMessage.success('删除成功')
        }
      })
      getData()
    }

    //样式渲染  开关 角色
    // 表格开关切换值触发
    const switchChange=(val)=>{
      let id=val.row.id
      updateState(id).then((res)=>{
        console.log(res)
      })
    }
    // 修改成功通知
    const open1 = (val) => {
      let title=''
      title = val.row.state?'该用户正常登录':'该用户已被禁用'
      ElNotification({
        title: '通知',
        message: h('i', { style: 'color: teal' }, `${title}`),
      })
    }



    // 修改图标框
    const dialogFormUpDate = ref(false)
    const formLabelWidth = '70px'
    // 修改角色
    const options=[
      {
        value:'1',
        label:'管理者',
      },{
        value:'0',
        label:'用户',
      }
    ]
    const value=ref('')
    // 修改框
    const updateForm = reactive({
      username: '',
      mobile:'',
      email:'',
      role:0,
    })
    const updateFormRef = ref('')
    // 修改用户注册校验
    const updateRules=reactive({
      username:[{
        required:true,
        message:'请输入用户名',
        trigger:'blur'
      },{
        min:2,
        max:12,
        message: '用户名长度不能超过2-12个字符',
        trigger:'blur'
      }],
      mobile:[{
        required:true,
        message:'请输入手机号',
        trigger:'blur'
      },
        {
          pattern: /(^1[3|4|5|7|8]\d{9}$)|(^\d{3,4}-\d{7,8}$)|(^\d{7,8}$)|(^\d{3,4}-\d{7,8}-\d{1,4}$)|(^\d{7,8}-\d{1,4}$)/,
          message: '号码格式错误，请重新输入',
          trigger:'blur'
        }] ,
      email:[{
        required:true,
        message:'请输入邮箱',
        trigger:'blur'
      }, {
        pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        message: '请輸入正确的格式',
        trigger:'blur'
      }]
    })
    let userId=ref('')
    //点击修改图标 回显数据
    const huiXianForm=(scope)=>{
      userId.value=scope.row.id
      const {   username ,  mobile, email ,   role }=scope.row
      updateForm.username=username
      updateForm.mobile=mobile
      updateForm.email=email
      updateForm.role=role
      dialogFormUpDate.value = true
    }
    // 点击修改框确认按钮
    const updateSubmitForm = (formEl ) => {
      let id=userId.value
      let role=Boolean(value.value)?1:0
      //校验
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          dialogFormUpDate.value = false
          console.log('submit!')
        } else {
          console.log('error submit!')
          return false
        }
      })
      const { username, mobile, email}=updateForm
      const res={  username, mobile, email, role,id  }
      upDataUser(res).then((res)=>{
        console.log(res)
        if(res.status==200){
          ElMessage.success('用户数据修改成功成功')
          getData()
        }
      })
    }

    return {
      updateSubmitForm,
      formLabelWidth,
      updateForm,
      updateFormRef,
      updateRules,
      tableData,value,
      iptSearch,
      total,
      num,
      page,searchUser,
      updateCurrent,
      btnSearchCli,
      confirmEvent,
      newRole,
      switchChange,
      open1,
      dialogFormUpDate,
      options,
      huiXianForm,loading
    }
  },
  components:{
 Search,Bread, EditPen,Delete,Setting,
  }
}
</script>

<style scoped>
/*.el-table--fit{*/
/*  margin-top: 20px;*/
/*}*/
.el-table  .el-table__header-wrapper table{
  width: 2159px;
  height: 20px !important;
  box-sizing: border-box !important;
}

.table{
  margin-top: 24px;
}
.el-card{
  height: 95%;
}
.rowT{
  padding-top: 5px;
}
.el-breadcrumb{
  margin-top: 10px;
}
.paging{
  text-align: center;
  margin-top: 20px;
}


</style>
