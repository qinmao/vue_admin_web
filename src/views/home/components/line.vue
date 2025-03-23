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
    textStyle: {
      //   color: '#fff'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['已发布', '已处理']
      //   textStyle: {
      //     color: '#fff'
      //   }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '已发布',
        type: 'line',
        stack: 'Total',
        data: []
      },
      {
        name: '已处理',
        type: 'line',
        stack: 'Total',
        data: []
      }
    ]
  })
  return chartInstance
}

watch(
  () => props.data,
  (newVal) => {
    const xAxisData = newVal.map((item) => item.deployDate)
    const deployData = newVal.map((item) => item.deploy)
    const doingData = newVal.map((item) => item.doing)
    chartInstance.setOption({
      xAxis: {
        data: xAxisData
      },
      series: [
        {
          data: deployData
        },
        {
          data: doingData
        }
      ]
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
