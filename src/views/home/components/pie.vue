<script setup>
import * as echarts from 'echarts'
import { useChartResize } from '../chart-resize.js'

const props = defineProps({
  data: Array
})

const chart = ref(null)

let chartInstance = null

function initChart() {
  const chartInstance = echarts.init(chart.value)
  chartInstance.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '-1.8%',
      left: 'center',
    //   textStyle: {
    //     color: '#fff'
    //   }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        // label: {
        //   color: '#fff'
        // },
        emphasis: {
          label: {
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        data: [
          // { value: 1048, name: 'Search Engine' },
          // { value: 735, name: 'Direct' },
          // { value: 580, name: 'Email' },
          // { value: 484, name: 'Union Ads' },
          // { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  })
  return chartInstance
}
watch(
  () => props.data,
  (newVal) => {
    chartInstance.setOption({
      series: {
        data: newVal
      }
    })
  }
)
onMounted(() => {
  chartInstance = initChart()
  useChartResize(chartInstance)
})
onUnmounted(() => {
  if (!chartInstance) {
    return
  }
  chartInstance.dispose()
})
</script>

<template>
  <div ref="chart" class="chat-item"></div>
</template>

<style scoped>
.chat-item {
  width: 100%;
  height: 300px;
}
</style>
