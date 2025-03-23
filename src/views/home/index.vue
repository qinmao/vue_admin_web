<template>
  <div class="page-wrapper">
    <!-- <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" class="chart-item">
        <el-card shadow="never" :style="{ height: `calc(${height}px - 35vh - 250px)` }">
          <template #header>
            <TypeIt strings="未签收任务" :cursor="false" :speed="120" />
          </template>
          <el-skeleton animated :rows="7" :loading="signLoading">
            <template #default>
              <Vue3SeamlessScroll
                :list="signData"
                :hover="true"
                :hover-stop="true"
                class="seamless-wrapper"
              >
                <ul>
                  <li v-for="item in signData" class="title-wrapper mb-2">
                    <p class="title" v-text="item.name"></p>
                    <p class="date" v-text="item.deadline"></p>
                  </li>
                </ul>
              </Vue3SeamlessScroll>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" class="chart-item">
        <el-card shadow="never" :style="{ height: `calc(${height}px - 35vh - 250px)` }">
          <template #header> <TypeIt strings="临期任务" :cursor="false" :speed="120" /> </template>
          <el-skeleton animated :rows="7" :loading="approachLoading">
            <template #default>
              <Vue3SeamlessScroll
                class="seamless-wrapper"
                :list="approachData"
                :hover="true"
                :hover-stop="true"
              >
                <ul>
                  <li v-for="item in approachData" class="title-wrapper mb-2">
                    <span class="title" v-text="item.name"></span>
                    <span class="date" v-text="item.deadline"></span>
                  </li>
                </ul>
              </Vue3SeamlessScroll>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" class="chart-item">
        <el-card shadow="never" :style="{ height: `calc(${height}px - 35vh - 250px)` }">
          <template #header> <TypeIt strings="超时任务" :cursor="false" :speed="120" /> </template>
          <el-skeleton animated :rows="7" :loading="overTimeLoading">
            <template #default>
              <Vue3SeamlessScroll
                :hover="true"
                :hover-stop="true"
                class="seamless-wrapper"
                :list="overTimeData"
              >
                <ul>
                  <li v-for="item in overTimeData" class="title-wrapper mb-2">
                    <p class="title" v-text="item.name"></p>
                    <p class="date" v-text="item.deadline"></p>
                  </li>
                </ul>
              </Vue3SeamlessScroll>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" class="chart-item">
        <el-card shadow="never">
          <template #header>
            <div class="title-wrapper">
              <TypeIt strings="任务发布与处理趋势" :cursor="false" :speed="120" />
              <div class="flex items-center">
                <el-date-picker
                  v-model="lineDate"
                  type="daterange"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :shortcuts="shortcuts"
                  size="small"
                  value-format="YYYY-MM-DD"
                />
                <el-button class="btn-search" type="primary" size="small" @click="getTaskDeploy"
                  >查询</el-button
                >
              </div>
            </div>
          </template>
          <el-skeleton animated :rows="7" :loading="lineLoading">
            <template #default>
              <Line :data="lineData" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" class="chart-item">
        <el-card shadow="never">
          <template #header>
            <div class="title-wrapper">
              <TypeIt strings="各部门处置任务占比" :cursor="false" :speed="120" />
              <div>
                <el-date-picker
                  v-model="pieDate"
                  type="daterange"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :shortcuts="shortcuts"
                  size="small"
                  value-format="YYYY-MM-DD"
                />
                <el-button class="btn-search" type="primary" size="small" @click="getDealDeptCount"
                  >查询</el-button
                >
              </div>
            </div>
          </template>
          <el-skeleton animated :rows="7" :loading="pieLoading">
            <template #default>
              <Pie :data="pieData" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" class="chart-item">
        <el-card shadow="never">
          <template #header>
            <div class="title-wrapper">
              <TypeIt strings="各部门任务完成情况" :cursor="false" :speed="120" />
              <div>
                <el-date-picker
                  v-model="barDate"
                  type="daterange"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :shortcuts="shortcuts"
                  size="small"
                  value-format="YYYY-MM-DD"
                />
                <el-button class="btn-search" type="primary" size="small" @click="getTaskDeptCount"
                  >查询</el-button
                >
              </div>
            </div>
          </template>
          <el-skeleton animated :rows="7" :loading="barLoading">
            <template #default>
              <Bar :data="barData" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>
<script setup>
import dayjs from 'dayjs'
import { $http } from '@/plugins/axios/index'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'

import TypeIt from '@/components/CyTypeit'
import Pie from './components/pie.vue'
import Bar from './components/bar.vue'
import Line from './components/line.vue'

import { shortcuts, defalutTime } from './utils.js'

const barData = ref([])
const lineData = ref([])
const pieData = ref([])

let signData = reactive([])
let approachData = reactive([])
let overTimeData = reactive([])

const lineDate = ref(defalutTime)
const pieDate = ref(defalutTime)
const barDate = ref(defalutTime)

const signLoading = ref(false)
const approachLoading = ref(false)
const overTimeLoading = ref(false)

const lineLoading = ref(false)
const pieLoading = ref(false)
const barLoading = ref(false)

async function getNoSignTask() {
  signLoading.value = true
  const { result } = await $http.get('/api/statistics/getNoSignTask').finally(() => {
    signLoading.value = false
  })
  signData.push(...result)
}

async function getApproachingTask() {
  approachLoading.value = true
  const { result } = await $http.get('/api/statistics/getApproachingTask').finally(() => {
    approachLoading.value = false
  })
  approachData.push(...result)
}

async function getOverTimeTask() {
  overTimeLoading.value = true
  const { result } = await $http.get('/api/statistics/getOverTimeTask').finally(() => {
    overTimeLoading.value = false
  })
  overTimeData.push(...result)
}
// 各部门任务完成情况
async function getTaskDeptCount() {
  barLoading.value = true
  const [startTime, endTime] = barDate.value
  const { result } = await $http
    .post('/api/statistics/getTaskDeptCount', { startTime, endTime })
    .finally(() => {
      barLoading.value = false
    })
  barData.value = result || []
}
// 任务发布趋势
async function getTaskDeploy() {
  lineLoading.value = true
  const [startTime, endTime] = lineDate.value
  const { result } = await $http
    .post('/api/statistics/getTaskTrend', { startTime, endTime })
    .finally(() => {
      lineLoading.value = false
    })
  //   构建x轴数据
  const day = dayjs(endTime).diff(dayjs(startTime), 'd')
  const deployDateList = result.map((item) => {
    return dayjs(item.deployDate).format('YYYY-MM-DD')
  })
  let list = []
  for (let index = 0; index <= day; index++) {
    const key = dayjs(startTime).add(index, 'd').format('YYYY-MM-DD')
    const i = deployDateList.findIndex((day) => day === key)
    if (i > -1) {
      list.push({
        deployDate: key,
        deploy: +result[i].deploy,
        doing: +result[i].doing
      })
    } else {
      // 原始数据不含有的补上
      list.push({
        deployDate: key,
        deploy: 0,
        doing: 0
      })
    }
  }
  lineData.value = list || []
}
// 部门处置任务占比
async function getDealDeptCount() {
  pieLoading.value = true
  const [startTime, endTime] = pieDate.value
  const { result } = await $http
    .post('/api/statistics/getDealDeptCount', { startTime, endTime })
    .finally(() => {
      pieLoading.value = false
    })
  pieData.value = result || []
}

onMounted(() => {
  // getNoSignTask()
  // getApproachingTask()
  // getOverTimeTask()
  // getTaskDeploy()
  // getDealDeptCount()
  // getTaskDeptCount()
})
</script>
<style lang="scss" scoped>
:deep(.el-date-editor--daterange) {
  width: 220px;
}
.seamless-wrapper {
  height: 230px;
  overflow: hidden;
}
.chart-item {
  margin-bottom: 18px;
  .title-wrapper {
    display: flex;
    justify-content: space-between;
    .btn-search {
      margin-left: 10px;
    }
  }
}
</style>
