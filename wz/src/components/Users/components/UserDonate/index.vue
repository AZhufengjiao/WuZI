<template>
  <div class="donate_container">
    <!-- 面包屑 -->
    <Bread></Bread>

    <!-- 卡片试图区域 -->
    <el-card>
      <!--  一/行  -->
      <el-row :gutter="20" class="rowT">
        <!--   列   搜索 -->
        <el-col :span="4"><div class="grid-content bg-purple"></div>
          <el-input     class="w-50 m-2"
              @input="searchUser"
              @blur="getUserDonateList"
              v-model="iptSearch"
              size="large"
              @keydown.enter="getUserDonateList"
              placeholder="请输入搜索姓名"
          >
            <template #append>
              <el-button  @click="searchUser" ><Search style="width: 28px;height: 16px;"></Search></el-button>
            </template>
          </el-input>
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

      <!--   表格   -->
      <Table highlight-current-row @handleFullUser="handleFullUser"  @HistoryUsername="HistorySearchUsers" :UserDonateList="UserDonateList" class="table" border  size="large" style="width: 2190px" ></Table>

<!--   分页   -->
      <Paging :PagingList="PagingList" @todatanum="toDataNum" @todata="donateToPage"></Paging>
    </el-card>
  </div >
</template>

<script>
import {h, reactive, ref} from 'vue'
import Bread from '@/components/Bread/index.vue'
import Table from '@/components/Table/index.vue'
import Paging from '@/components/Paging/index.vue'
import { Search  } from '@element-plus/icons-vue'
import {getUserDonate, getUserDonateLike, getUserDonateUsernameId} from "../../../../api/user";
import {ElMessage,ElNotification} from "element-plus";
export default {
  name: "index",
  setup(){
    // 类型选择框
    const value = ref('')
    // 搜索历史 存储id
    let userid=ref(null)
    // 选择框数据
    const options = [
      {
        value: '2',
        label: '全部',
      },
      {
        value: '1',
        label: '现金',
      },
      {
        value: '0',
        label: '物品',
      },
    ]
    //搜索框数据
    const iptSearch=ref('')
    //分页数据
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
      getUserDonateList()
    }
    // 子传父分页num
    const toDataNum=(num)=>{
      PagingList.num=num
      getUserDonateList()
    }

    // 表格数据
    let UserDonateList=reactive([])
    // 获取表格数据
    const getUserDonateList=()=>{
      iptSearch.value=''
      const res={
        page:PagingList.page,
        num:PagingList.num
      }
      getUserDonate(res).then((res)=>{
        console.log(res) // 2020-06-27 14:20:27
        // res.results.forEach((item)=>item.RepDate=item.RepDate.split('T')[0])
        res.results.forEach((item,index)=>{
          // 该物资是物品
          if(item.types==1){
            item.quantity=  item.price
          }
        })
        UserDonateList.value=res.results
        PagingList.total=res.total
      })

    }
    getUserDonateList()


    // 封装搜索数据函数
    function searchUsers(){
      console.log(iptSearch.value)
      let result={
        username:iptSearch.value.trim(),
        page:PagingList.page,
        num:PagingList.num
      }
      console.log(result)
      getUserDonateLike(result).then((res)=>{
        if(res.code==200){
          UserDonateList.value=res.results
          PagingList.total=res.total
        }else{
          ElMessage({
            message: '找不到该用户',
            type: 'error',
          })
          iptSearch.value=''
        }
      })
    }
    let valSearch=ref('')
    // 搜索用户捐赠 保存数据
    const searchUser=()=>{
      // console.log(iptSearch.value.trim())
      if(iptSearch.value.trim().length>0){
        // 类别选择的是现金
        if(valSearch.value==1){
          getUserDonateLikeFn(1)
        }
        else if(valSearch.value==0) {
          getUserDonateLikeFn(0)
        }else{
          searchUsers()
        }
      }else{
        getUserDonateList()
      }
    }

    // 表格点击历史记录
    const HistorySearchUsers=({id})=>{
      if(userid.value==id){
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: teal' }, '已经是该用户啦'),
        })
      }
      userid.value=id
      let result={
        id:userid.value,
        page:PagingList.page,
        num:PagingList.num
      }
      getUserDonateUsernameId(result).then((res)=>{
        console.log(res)
        UserDonateList.value=res.results
        PagingList.total=res.total
      })
    }
    // 表格点击返回全部
    const handleFullUser=()=>{
      getUserDonateList()
    }

    //选择框发生变化时触发
    const selectHandle=(val)=>{
      //  类型选择框选中值
     valSearch.value=val
      console.log(   valSearch.value)
      // 当前数据是模糊搜索
      if(iptSearch.value.trim().length>0 ){
        // 类别选择的是现金
        if(val==1){
          getUserDonateLikeFn(1)
        }else if(val==0){
          getUserDonateLikeFn(0)
        }else if(val==2){
          searchUsers()
        }
      }else{
      // 当前是全部数据
        // 类别选择的是现金
        if(val==1){
          getUserDonateListFn(1)
        }else if(val==0){
          getUserDonateListFn(0)
        }else if(val==2){
          getUserDonateList()
        }
      }
    }
    // 封装一个方法 模糊查询搜索数据 username
    function getUserDonateLikeFn(num){
      let result={
        username:iptSearch.value.trim(),
        page:PagingList.page,
        num:PagingList.num
      }
      getUserDonateLike(result).then((res)=>{
        if(res.code==200){
          console.log(res)
          UserDonateList.value=res.results.filter((item)=>item.type==num)
          // UserDonateList.value.forEach((item,index)=>{
          //   // 该物资是现金
          //   if(item.types==1){
          //     item.quantity=  item.price
          //   }
          // })
          PagingList.total=res.total
        }else{
          ElMessage({
            message: '找不到该用户',
            type: 'error',
          })
          iptSearch.value=''
        }
      })
    }
    // 封装另一个方法 搜索全部数据
    function getUserDonateListFn(num){
      const res={
        page:PagingList.page,
        num:PagingList.num
      }
      getUserDonate(res).then((res)=>{
       if(res.code==200){
         UserDonateList.value=res.results.filter((item)=>item.types==num)
         UserDonateList.value.forEach((item,index)=>{
           // 该物资是现金
           if(item.types==1){
             item.quantity=  item.price
           }
         })
         PagingList.total=res.total
       }else{
         ElMessage({
           message: '找不到该用户',
           type: 'error',
         })
       }

      })
    }
    return {
      value,
      HistorySearchUsers,
      selectHandle,
      options,
      UserDonateList,
      PagingList,
      donateToPage,
      toDataNum,
      iptSearch,getUserDonateList,
      searchUser,handleFullUser
    }
  },
  components:{
    Bread,Table,Paging,Search
  }
}
</script>

<style scoped>
.donate_container{
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
.table{
  margin-top: 24px;
}
.donate_container .el-scrollbar__view .el-table__body{
  width: 2190px !important
}
</style>
