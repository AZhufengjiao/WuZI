<template>
  <!--   列   时间 -->
  <el-col :span="5">
    <div class="demo-date-picker"     >
      <div class="block"    >
        <el-date-picker size="large"
                        v-model="value1"
                        type="daterange"
                        @change="getDate"
                        range-separator="To"
                        start-placeholder="Start date"
                        end-placeholder="End date"
        />
      </div>
    </div>
  </el-col>
</template>

<script>
import {ref} from "vue";

export default {
  name: "index",
  setup(props,{emit}){
    const value1 = ref('')

    const getDate=()=>{
      emit('datePickerHandle',value1.value)
    }

    return {value1,getDate}
  }
}
</script>

<style scoped>

</style>
