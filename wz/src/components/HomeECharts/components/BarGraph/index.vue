<template>
  <h3>捐赠情况</h3>
  <canvas id="main" width="450" height="338"></canvas>
</template>

<script >
import * as echarts from 'echarts';
import {onMounted} from "vue";
import {getExistingMaterial} from "../../../../api/echarts";
export default {
  name: "index",
  setup(){
    const getExisting=()=>{
      getExistingMaterial().then((res)=>{
        // console.log(res)
      })
    }

    const getEcharts=()=>{
      const chartDom = document.getElementById('main');
      const  myChart = echarts.init(chartDom);
      let option;

      option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [
              120,
              {
                value: 200,
                itemStyle: {
                  color: '#a90000'
                }
              },
              150,
              80,
              70,
              {
                value: 200,
                itemStyle: {
                  color: '#34bfa3'
                }
              },
              110,
              130
            ],
            type: 'bar'
          }
        ]
      };

      option && myChart.setOption(option);
    }
    onMounted(()=>{
      getEcharts()
      getExisting()
    })

  }
}
</script>

<style scoped>
</style>
