<template>
  <div class="common-layout">
  <el-container>
    <!--  头部  -->
    <el-header>
      <HomeHeaders></HomeHeaders>
    </el-header>
    <el-container>
    <!--   侧边栏   -->
      <el-aside >
        <HomeAside ></HomeAside>
      </el-aside>
      <el-main >
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
import HomeHeaders from "@/views/home/components/HomeHeaders/index.vue";
import HomeAside from "@/views/home/components/HomeAside/index.vue";
import {ref} from "vue";

export default {
  name: "HomePage",
  components:{
    HomeHeaders,HomeAside
  },

}
</script>

<style scoped lang="less">
.common-layout .el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);  overflow: hidden;
}
.common-layout{
  height: 100%;
  .el-container  {
    height: 100%;
  }
}

.el-header,
.el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-header{
  background-color: #3a517a;
}

.el-aside {
  --el-aside-width: none;
}

.isActive{
  width: 60px;
}

</style>
