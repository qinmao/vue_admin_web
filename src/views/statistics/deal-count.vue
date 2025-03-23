<template>
  <div class="main">
    <el-form ref="formRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="创建日期">
        <el-date-picker
          placeholder="创建日期"
          type="daterange"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="searchTime"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useIcon('ep-search')"
          :loading="loading"
          @click="onSearchBtnClick"
        >
          搜索
        </el-button>
        <el-button :icon="useIcon('ep-refresh')" @click="onResetBtnClick('formRef')">
          重置
        </el-button>
        <el-button :icon="useIcon('ep-download')" @click="onDownloadClick"> 导出Excel </el-button>
      </el-form-item>
    </el-form>
    <div class="search-table">
      <div class="title-wrapper">
        <p>各部门签收反馈任务数统计列表</p>
        <div class="r-btn-wrapper">
          <el-divider direction="vertical" />
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-icon class="icon" :size="20" @click="onResetBtnClick('formRef')">
              <i-ep-refresh />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
      <el-table
        :data="list"
        v-loading="loading"
        element-loading-text="加载中..."
        border
        show-summary
        max-height="640"
      >
        <el-table-column prop="dealDeptName" label="部门">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/user-deal-count?deptId=${row.dealDeptId}`)"
              link
              type="primary"
              >{{ row.dealDeptName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="dealCount" sortable label="共接收">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealDeptId=${row.dealDeptId}`)"
              link
              type="primary"
              >{{ row.dealCount }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="self" sortable label="自查">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(
                  `/statistics/task-list?dealDeptId=${row.dealDeptId}&createDeptId=${row.dealDeptId}`
                )
              "
              link
              type="primary"
              >{{ row.self }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="receive" sortable label="接收">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(
                  `/statistics/task-list?dealDeptId=${row.dealDeptId}&receive=${row.dealDeptId}`
                )
              "
              link
              type="primary"
              >{{ row.receive }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="noSign" sortable label="待签收">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealDeptId=${row.dealDeptId}&status=20`)"
              link
              type="primary"
              >{{ row.noSign }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="signFeedBack" sortable label="签收待反馈">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealDeptId=${row.dealDeptId}&status=30`)"
              link
              type="primary"
              >{{ row.signFeedBack }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="backFeedBack" sortable label="退回待反馈">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealDeptId=${row.dealDeptId}&status=32`)"
              link
              type="primary"
              >{{ row.backFeedBack }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="done" sortable label="已完成">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealDeptId=${row.dealDeptId}&status=50`)"
              link
              type="primary"
              >{{ row.done }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="green" sortable label="绿色预警">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealDeptId=${row.dealDeptId}&warning=1`)"
              link
              type="primary"
              >{{ row.green }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="yellow" sortable label="黄色预警">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealDeptId=${row.dealDeptId}&warning=2`)"
              link
              type="primary"
              >{{ row.yellow }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="red" sortable label="红色预警">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealDeptId=${row.dealDeptId}&warning=3`)"
              link
              type="primary"
              >{{ row.red }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { exportJsonToExcel } from '@/plugins/excel'
import { useIcon } from '@/components/CyIcon/hook'

const preThreeMonth = dayjs().subtract(3, 'M').format('YYYY-MM-DD 00:00:00')
const now = dayjs().format('YYYY-MM-DD 23:59:59')
const defalutTime = [preThreeMonth, now]

export default {
  data() {
    return {
      loading: false,
      list: [],
      searchForm: {
        startTime: '',
        endTime: ''
      },
      shortcuts: [
        {
          text: '近一周',
          value: () => {
            const startDate = dayjs().subtract(1, 'w').format('YYYY-MM-DD 00:00:00')
            const start = new Date(startDate)
            const end = new Date()
            return [start, end]
          }
        },
        {
          text: '近一月',
          value: () => {
            const end = new Date()
            const startDate = dayjs().subtract(1, 'M').format('YYYY-MM-DD 00:00:00')
            const start = new Date(startDate)
            return [start, end]
          }
        },
        {
          text: '近三月',
          value: () => {
            const end = new Date()
            const startDate = dayjs().subtract(3, 'M').format('YYYY-MM-DD 00:00:00')
            const start = new Date(startDate)
            return [start, end]
          }
        }
      ],
      searchTime: defalutTime
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    useIcon,
    async getList() {
      this.loading = true
      if (this.searchTime && this.searchTime.length) {
        const [startTime, endTime] = this.searchTime
        this.searchForm.startTime = startTime
        this.searchForm.endTime = endTime
      }
      const { code, result } = await this.$http
        .post('/api/statistics/getDealCount', this.searchForm)
        .finally(() => {
          this.loading = false
        })
      if (code === 200) {
        this.list = result || []
      }
    },
    onResetBtnClick(formRef) {
      if (!formRef) return
      this.$refs[formRef].resetFields()
      this.onSearchBtnClick()
    },
    onSearchBtnClick() {
      this.getList()
    },
    onDownloadClick() {
      const excelData = this.list.map((item) => {
        const {
          dealDeptName,
          deployCount,
          noSign,
          signFeedBack,
          backFeedBack,
          done,
          green,
          yellow,
          red,
          self,
          receive
        } = item
        return {
          部门: dealDeptName,
          共接收: deployCount,
          自查: self,
          接收: receive,
          待签收: noSign,
          签收待反馈: signFeedBack,
          退回待反馈: backFeedBack,
          已完成: done,
          绿色预警: green,
          黄色预警: yellow,
          红色预警: red
        }
      })
      exportJsonToExcel(excelData, '各部门处置任务数统计列表.xlsx')
    }
  }
}
</script>
