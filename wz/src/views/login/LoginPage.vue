<template>
<div class="login_container">
  <!--  遮罩层-->
  <div class="mask"></div>
  <div class="box">
  <!-- 项目名称 -->
  <div class="Login_title">疫情捐赠物资管理系统</div>
  <!--  登录框  -->
  <div id="login_box">
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          style="max-width: 500px"
      >
        <el-form-item   label-width="0"  prop="user" >
          <el-input size="large" v-model="ruleForm.user" placeholder="用户名">
            <template    #suffix>
              <el-icon size="17px" class="el-input__icon">
                <user-filled />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item  class="itemH"   label-width="0"  prop="password"   >
          <el-input type="password"   style="height: 45px;"   class="w-50 m-2"  size="large"  v-model="ruleForm.password"   placeholder="密码">
            <template    #suffix>
              <el-icon  size="17px" class="el-input__icon"><key /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!--  复选框 -->
        <el-checkbox v-model="checked" @click="checkCli">记住用户名</el-checkbox>

        <br>
        <!--   按钮   -->
        <el-button @click="submitForm(ruleFormRef)" size="large" class="buttonH" color="#1e537d" style="color: white">登录</el-button>

        <!--    注册    -->
        <el-link   class="register" type="primary" @click="dialogFormVisible = true">立即注册</el-link>

        <!--    注册框    -->
        <el-dialog  class="dialog" width="600px"   v-model="dialogFormVisible" title="用户注册"  >
          <el-form
              ref="registerFormRef"
              :rules="registerRules"
              :model="registerForm">
              <el-form-item label="用户名"  prop="username"  :label-width="formLabelWidth">
              <el-input size="large" v-model="registerForm.username" autocomplete="off"></el-input>
              </el-form-item>
            <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
              <el-input size="large" v-model="registerForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
              <el-input type="password"  size="large"  v-model="registerForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="newPassword" :label-width="formLabelWidth">
              <el-input type="password"  size="large" v-model="registerForm.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
              <el-input size="large" v-model="registerForm.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
          <span class="dialog-footer">
           <el-button  @click="registerCancelForm">取消</el-button>
           <el-button type="primary"   @click="registerSubmitForm(registerFormRef)" >确认</el-button  >
          </span>
          </template>
        </el-dialog>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import {reactive, ref,   onMounted} from 'vue'
import { Key,UserFilled,Calendar} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {userLogin,userRegister} from '@/api/login.js'
// 导入router
import { useRouter } from "vue-router";
import {useStore} from 'vuex'
export default {
  name: "LoginPage",
  setup(){
    // onMounted(()=>{
    //   ruleForm.user=store.state.login.username.trim().length>0?store.state.login.username:''
    // })
    // 密码校验
    const checkAge = (rule , value, callback ) => {
      if (!value) {
        return callback(new Error('请输入确认密码！'))
      }
      if(value.length<6||value.length>12){
        return callback(new Error('密码长度不能超过6-12个字符'))
      }
      if(registerForm.newPassword){
        if(value===registerForm.newPassword){
          callback()
        }else{
          return callback(new Error('密码不一致，请重新输入！'))
        }
      }
    }
    //确认密码校验
    const newCheckAge = (rule , value, callback ) => {
      if (!value) {
        return callback(new Error('请输入确认密码！'))
      }
      if(value.length<6||value.length>12){
        return callback(new Error('密码长度不能超过6-12个字符'))
      }
      if(registerForm.password){
        if(value===registerForm.password){
          callback()
        }else{
          return callback(new Error('密码不一致，请重新输入！'))
        }
      }
    }
    // 使用router
    let router = useRouter();
    // 获取store对象
    const store=useStore()
    const input = ref('')
    // 复选框控制器
    const checked=ref(false)
    // 注册框
    const dialogFormVisible = ref(false)
    const formLabelWidth = '70px'
    checked.value=store.state.login.flag

    // 登录框
    const ruleFormRef = ref ('')
    // 用户名 密码
    const ruleForm = reactive({
      user:'admin',
      password:'123123'
    })
    // 校验
    const rules = reactive({
      user:[{
        required:true,
        message:'请输入用户名',
        trigger:'blur'
      },{
        min:2,
        max:12,
        message: '用户名长度不能超过2-12个字符',
        trigger:'blur'
      }],
      password:[{
        required:true,
        message:'请输入密码',
        trigger:'blur'
      },{
        min:6,
        max:12,
        message: '用户名长度不能超过6-12个字符',
        trigger:'blur'
      }]
    })

    // 注册框
    const registerForm = reactive({
      username: '',
      password:'',
      newPassword:'',
      mobile:'',
      email:'',
      role:0,
      state:1
    })
    const registerFormRef = ref('')
    //注册校验
    const registerRules=reactive({
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
      password: [{ validator: checkAge, trigger: 'blur' }],
      newPassword: [{ validator: newCheckAge, trigger: 'blur' }],
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
    // 点击注册确认框确认按钮
    const registerSubmitForm = (formEl ) => {
      //校验
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          dialogFormVisible.value = false
          console.log('submit!')
        } else {
          console.log('error submit!')
          return false
        }
      })
      const { username, password, mobile, email, role,state}=registerForm
      // 发起请求 注册用户
      userRegister(username, password, mobile, email, role,state).then((data)=>{
        console.log(data)
        if(data.status==200){
          ruleForm.password=''
          ElMessage.success('注册成功,请登录')
          ruleForm.user=username

          registerForm.name= ''
          registerForm.password= ''
          registerForm.newPassword= ''
          registerForm.mobile= ''
          registerForm.email= ''
          dialogFormVisible.value = false
        }
      })

    }
   // 点击注册确认框取消按钮
   const registerCancelForm=()=>{
    registerForm.username= ''
    registerForm.password= ''
    registerForm.newPassword= ''
    registerForm.mobile= ''
    registerForm.email= ''
   dialogFormVisible.value = false
  }

    //记住用户名
    if(store.state.login.flag){
      checked.value=true
      ruleForm.user=store.state.login.username.trim().length>0?store.state.login.username:''
    }

    // 登录
    const submitForm=(ruleFormRef)=>{
      console.log(111)
      userLogin(ruleFormRef.model.user,ruleFormRef.model.password).then((data)=>{
        console.log(data)
        if(data.status==200){
            // 添加token
            store.commit('login/setToken',data.token)
            ElMessage.success('登录成功')

            //登录成功 ，存储用户名
            // localStorage.setItem('userName',ruleForm.user)
            // setCookie('token',ruleForm.user,3600*12)
            store.commit('login/setUser', ruleForm.user)
            router.push('/home')
          }else{
            ElMessage.error('用户名或密码错误请重新输入')
            ruleForm.user=''
            ruleForm.password=''
            store.commit('login/setToken','')
          }
      })

    }
    // 点击复选框
    const checkCli=()=>{
        store.commit('login/setFlag',!checked.value)
    }
    return {
      checkCli, input,ruleForm,ruleFormRef,checked,rules,submitForm,registerSubmitForm,registerCancelForm,dialogFormVisible,registerForm,registerRules,registerFormRef,formLabelWidth
    }
  },
  components:{
    Key,UserFilled,Calendar,
  }
}


</script>

<style scoped lang="less">
.login_container{
  display: flex;
  justify-content: center;
  align-items: center;
overflow: hidden;
  width: 100%;
  height: 100%;
  background : url("./src/assets/images/bgi.webp")no-repeat;
  background-size:100% 100% ;
  box-sizing: border-box;
  .mask{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: rgba(56, 177, 258, 0.32);
  }
  .box{
    width: 500px;
    z-index: 3 !important;
  }
  .Login_title{
    color: white;
    text-align: center;
    font-size: 22px;
    margin-bottom: 11px;
  }
  #login_box{
    width: 500px;
    height: 310px;
    padding: 50px;
    background-color: white;
    box-sizing: border-box;
    input::-webkit-input-placeholder {
      color: #333;
    }
    .buttonH{
      margin-top: 10px;
     width: 400px;
     height: 45px;
    }
    .register{
      float: right;
      margin-top: 10px;
    }
  }
}

//.el-input{
//  --el-input-placeholder-color: #454545;
//}
.itemH{
  margin-bottom:12px;
}
.el-input__inner {
  height: 45px !important;
}

// 注册框


</style>
