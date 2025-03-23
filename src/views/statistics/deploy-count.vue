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
        <p>各部门发布核查任务数统计列表</p>
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
        id="table-dept"
        :data="list"
        v-loading="loading"
        element-loading-text="加载中..."
        border
        show-summary
        max-height="640"
      >
        <el-table-column label="部门名称">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/user-deploy-count?deptId=${row.createDeptId}`)"
              link
              type="primary"
              >{{ row.createDeptName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="deployCount" sortable label="共发布">
          <template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?createDeptId=${row.createDeptId}`)"
              link
              type="primary"
              >{{ row.deployCount }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="checking" sortable label="待核查">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(`/statistics/task-list?createDeptId=${row.createDeptId}&status=40`)
              "
              link
              type="primary"
              >{{ row.checking }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="checkNoPass" sortable label="审核退回">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(`/statistics/task-list?createDeptId=${row.createDeptId}&status=32`)
              "
              link
              type="primary"
              >{{ row.checkNoPass }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="checkPass" sortable label="审核通过">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(`/statistics/task-list?createDeptId=${row.createDeptId}&status=50`)
              "
              link
              type="primary"
              >{{ row.checkPass }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="gafw" sortable label="公安服务">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(`/statistics/task-list?createDeptId=${row.createDeptId}&type=公安服务`)
              "
              link
              type="primary"
              >{{ row.gafw }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="jcjc" sortable label="基层基础">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(`/statistics/task-list?createDeptId=${row.createDeptId}&type=基层基础`)
              "
              link
              type="primary"
              >{{ row.jcjc }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="fzga" sortable label="法治公安">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(`/statistics/task-list?createDeptId=${row.createDeptId}&type=法治公安`)
              "
              link
              type="primary"
              >{{ row.fzga }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="zzgz" sortable label="政治工作">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(`/statistics/task-list?createDeptId=${row.createDeptId}&type=政治工作`)
              "
              link
              type="primary"
              >{{ row.zzgz }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="djpa" sortable label="打击破案">
          <template #default="{ row }">
            <el-button
              @click="
                $router.push(`/statistics/task-list?createDeptId=${row.createDeptId}&type=打击破案`)
              "
              link
              type="primary"
              >{{ row.djpa }}</el-button
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
        .post('/api/statistics/getDeployCount', this.searchForm)
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
          createDeptName,
          deployCount,
          checking,
          checkNoPass,
          checkPass,
          gafw,
          jcjc,
          fzga,
          zzgz,
          djpa
        } = item
        return {
          部门名称: createDeptName,
          共发布: deployCount,
          待核查: checking,
          审核退回: checkNoPass,
          审核通过: checkPass,
          公安服务: gafw,
          基层基础: jcjc,
          法治公安: fzga,
          政治工作: zzgz,
          打击破案: djpa
        }
      })
      exportJsonToExcel(excelData, '部门发布核查统计列表.xlsx')
    }
  }
}
</script>
