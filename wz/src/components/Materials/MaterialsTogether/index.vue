<template>
  <Bread></Bread>
  <el-divider></el-divider>
  <el-row :gutter="24">

    <router-link to="/home/material/count">
      <div @click="handleCli('3-2')" class="grid-content bg-purple">
        <img src="@/assets/images/f1.png" alt="">
        <br>
        <span>总物资</span>
      </div>
    </router-link>

    <div class="grid-content bg-purple">
      <img src="@/assets/images/f2.png" alt="">
      <br>
      <span>物资入库</span>
    </div>
    <div class="grid-content bg-purple">
      <img src="@/assets/images/f3.png" alt="">
      <br>
      <span>物资出库</span>
    </div>


    <router-link to="/home/material/scarcity">
    <div @click="handleCli('3-3')" class="grid-content bg-purple">
      <img src="@/assets/images/f4.png" alt="">
      <br>
      <span>稀缺物资</span>
    </div>
    </router-link>
  </el-row>

</template>

<script>
import Bread from '@/components/Bread/index.vue'
import {useStore} from "vuex";
import {ref} from "vue";

export default {
  name: "index",
  components:{
    Bread
  },
  setup(){
    let store=useStore()
    let index=ref('')
    const handleCli=(I)=>{
    index.value=I
      store.commit('user/setIndex',index.value)

    }
    return {handleCli,index}
  }
}
</script>

<style scoped lang="less">
.el-divider{
  margin-top: 4px !important;
}
.grid-content{
  /*background-color: red;*/
  width: 110px;
  height: 110px;
  margin-right: 50px !important;
  text-align: center;

  img{
    width: 100% !important;
    height: 100% !important;
    border-radius: 20px;
  }
  span{
    color: #777679;
    margin-top:10px;
  }

}
.el-row a{
    text-decoration: none !important;
}
.grid-content:first-child{
  margin-left: 40px;
}
</style>
