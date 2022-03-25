<template>
  <router-view></router-view>
</template>

<script>
export default {
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
/* login页面的注册框 */
/* 用户修改框 */
#app .login_container  .el-dialog__header,
#app .user_container  .el-dialog__header{
  background-color: #1e537d;
  color: white;
}
#app .login_container  .el-dialog__title{
  color: white;
}
#app  .login_container .el-dialog__footer,
#app .user_container  .el-dialog__header{
  text-align: center;
}
#app  .login_container .el-overlay-dialog,
#app .user_container  .el-dialog__header{
  margin-top: 188px;
}

/* 用户修改框 */
#app .user_container  .el-dialog__header{
  background-color:#3a517a
}
#app .user_container   .el-dialog__title{
  color: white;
}
#app .user_container .el-dialog__footer{
  text-align: center;
}

/* 总物资修改框 */
#app .Material_container  .el-dialog__header{
  background-color:#3a517a
}
#app .Material_container   .el-dialog__title{
  color: white;
}
#app .Material_container .el-dialog__footer{
  text-align: center;
}


#app .MaterialS_container  .el-dialog__header{
  background-color:#3a517a
}
#app .MaterialS_container   .el-dialog__title{
  color: white;
}
#app .MaterialS_container .el-dialog__footer{
  text-align: center;
}


/* 捐赠物资表格*/
#app  .donate_container .el-scrollbar__view .el-table__header,
#app  .donate_container .el-scrollbar__view .el-table__body{
  width: 2190px !important
}

#app  .donate_container .el-table__header-wrapper .el-table__header{
  width: 2190px !important
}
/* 总物资 表格*/
#app  .Material_container  .el-scrollbar__view .el-table__header,
#app  .Material_container  .el-scrollbar__view .el-table__body{
  width: 2190px !important
}

#app  .Material_container  .el-table__header-wrapper .el-table__header{
  width: 2190px !important
}




.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}

</style>
