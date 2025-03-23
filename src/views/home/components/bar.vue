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
    // textStyle: {
    //   color: '#fff'
    // },
    legend: {
      //   textStyle: {
      //     color: '#fff'
      //   }
    },
    tooltip: {},
    dataset: {
      dimensions: ['单位', '已发布', '已完成'],
      source: []
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }]
  })
  return chartInstance
}
watch(
  () => props.data,
  (newVal) => {
    chartInstance.setOption({
      dataset: {
        source: newVal
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
