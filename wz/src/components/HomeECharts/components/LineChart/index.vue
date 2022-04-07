<template>
<!--  <h1>一周</h1>-->
  <canvas id="lineChart" width="1060" height="330"></canvas>
</template>

<script>
import {onMounted} from "vue";
import * as echarts from 'echarts';
export default {
  name: "index",
  setup(){
    const getEcharts=()=>{
      const  chartDom = document.getElementById('lineChart');
      const myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: 'Stacked Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['矿泉水', '蔬菜', "泡面", '防护服', '口罩']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['December', 'January', 'February', 'March', 'April', 'May', 'June']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '矿泉水',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '蔬菜',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '泡面',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '防护服',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '口罩',
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
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
.lineChart{

}
</style>
