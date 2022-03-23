<template>
  <div class="echarts_container">
    <el-row justify="space-between">
      <el-col :span="8" ><div class="grid-content bg-purple">   <BarGraph></BarGraph></div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple">    <Pie></Pie> </div></el-col>
      <el-col :span="7" ><div class="grid-content bg-purple">
        <div class="Material_box">
          <ul>
            <li class="Material_box_li">
                <h4>救援  </h4>
                <span>年率增长次数</span>

              <span class="Material_box_li_span violet"> +24%</span>
            </li>
            <li class="Material_box_li">
              <h4>支付  </h4>
              <span>年率增长次数</span>

              <span class="Material_box_li_span green"> +568586</span>
            </li>
            <li class="Material_box_li">
              <h4>支付  </h4>
              <span>年率增长次数</span>

              <span class="Material_box_li_span blue">  -10%</span>
            </li>
          </ul>
        </div>
      </div></el-col>
    </el-row>
    <br>

    <el-row   >
       <div class="grid-content bg-purple left_bottom_box">
         <h4>1231231</h4>
         <LineChart></LineChart>
       </div>
       <div class="grid-content bg-purple righe_bottom_box">
         <h2>最新的更新</h2>
         <ul>
           <li class="Material_box_li">
             <h3>救援  </h3>

             <span class="Material_box_li_span  "> +24%</span>
           </li>
           <li class="Material_box_li">
             <h3>支付  </h3>

             <span class="Material_box_li_span  "> +568586</span>
           </li>
           <li class="Material_box_li">
             <h3>支付  </h3>

             <span class="Material_box_li_span gray">  -10%</span>
           </li>
         </ul>
       </div>
    </el-row>

  </div>


<!--<el-card>-->
  <!-- 面包屑 -->
<!--  <Bread></Bread>-->
<!--</el-card>-->
</template>
<script>
import  BarGraph from './components/BarGraph/index.vue'
import  Pie from './components/Pie/index.vue'
import LineChart from './components/LineChart/index.vue'
// import Bread from '../Bread/index.vue'
export default {
  name: "index",
  components:{
    BarGraph,Pie,LineChart
  }
}
</script>

<style scoped lang="less">
.el-card{
  height: 100%;
}
.echarts_container{
  height: 98%;
  margin: 10px;
}

.grid-content{
  background-color: white;
  border-radius: 25px;
  height: 370px;
  padding: 0 36px 17px 44px;
  overflow: hidden;

}

.Material_box{
  /*display: flex;*/
  /*flex-direction:   column-reverse;*/
  padding: 20px 0;
  height: 100%;
  box-sizing: border-box;
}
.Material_box ul {
  list-style: none;
  margin: 0;
  padding: 0;  height: 100%;
}
.righe_bottom_box ul{
  list-style: none;
  margin: 0;
  padding: 0;  height: 100%;

}
.righe_bottom_box ul h4{
  color:#a09cb8;
}
.Material_box ul li{
  height: 33.333%;
  box-sizing: border-box;
  border-bottom: 4px solid #f9f9fa;
}
.Material_box ul li:last-child{
  border-bottom:0
}

.Material_box_li{
  position: relative;
  padding-top: 35px;
  height: 12%;


  h4 {
    margin: 0 !important;
    font-weight: 400;
    margin-bottom: 4px;
    font-size: 20px;
    color: #464646;
  }
  span{
    color:#a09cb8
  }


  .Material_box_li_span{
    position: absolute;
    right: 0;
    top:45px;
    font-weight: 700;
    font-size: 24px;
  }
}

.violet{
  color: #716aca !important;
}
.green{
color: #34bfa3  !important;
}
.blue{
  color: #00c5dc  !important;
}
.gray{
  color: #a09cb8 !important;
}

.righe_bottom_box{
  margin-left:32px;
  width: 404px;
  height:388px;
}
 .righe_bottom_box h3{
   color: #a09cb8;    font-weight: 400 !important;
 }
.left_bottom_box{
  width: 1063px;
  height:388px;
}
</style>
