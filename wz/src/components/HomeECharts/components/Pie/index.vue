<template>
<div class="pie_box">
  <h3>物资情况</h3>
  <canvas id="pie" width="550" height="350"></canvas>
</div>
</template>

<script>
import * as echarts from 'echarts';
import {onMounted} from "vue";
export default {
  name: "index",setup(){

    const getEcharts=()=>{
      const  chartDom = document.getElementById('pie');
      const myChart = echarts.init(chartDom);
      let option;

      option = {
        legend: {
          top: 'bottom'
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: { show: true },
        //     dataView: { show: true, readOnly: false },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [70, 120],  //  图大小
            center: ['45%', '40%'], // 左右  上下
            roseType: 'area',
            itemStyle: {
              borderRadius: 6
            },
            data: [
              { value: 40, name: 'rose 1' },
              { value: 38, name: 'rose 2' },
              { value: 32, name: 'rose 3' },
              { value: 30, name: 'rose 4' },
              { value: 28, name: 'rose 5' },
              { value: 26, name: 'rose 6' },
            ]
          }
        ]
      };

      option && myChart.setOption(option);
    }

    onMounted(()=>{
      getEcharts()
    })
  }
}
</script>

<style scoped>
.pie_box{
  width: 100%;
  height: 500px;
}
#pie{
  width:482px;
  /*margin-left: 70px !important;*/
}
</style>
