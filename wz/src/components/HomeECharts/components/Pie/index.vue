<template>
<div class="pie_box">
  <h3>物资情况</h3>
  <canvas id="pie" width="550" height="350"></canvas>
</div>
</template>

<script>
import * as echarts from 'echarts';
import {onMounted, ref} from "vue";
import {getExistingMaterial} from "../../../../api/echarts";
export default {
  name: "index",setup(){

    // const getExisting=()=>{
    //   getExistingMaterial().then((res)=>{
    //       list.value=res.data.items
    //     console.log( list.value)
    //   })
    //   console.log(   list.value)
    // }
    const getEcharts=()=>{
      let list=ref([])
      const getExisting=()=>{
        getExistingMaterial().then((res)=>{
          // console.log(res)
            list.value=res.data.items
        })
      }
      getExisting()
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
            // data:list.value
            data: [
              { value: 40, name: '口罩' },
              { value: 38, name: '防护服' },
              { value: 32, name: '泡面' },
              { value: 30, name: '蔬菜' },
              { value: 28, name: '被子' },
              { value: 26, name: '矿泉水' },
            ]
          }
        ]
      };

      option && myChart.setOption(option);
    }

    onMounted(()=>{
      getEcharts()

    })

    return {

    }
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
