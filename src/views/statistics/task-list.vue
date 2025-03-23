<template>
  <div class="page-wrapper">
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="创建日期">
        <el-date-picker
          placeholder="创建日期"
          type="daterange"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="searchTime"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          :icon="useIcon('ep-search')"
          @click="onSearchBtnClick"
          >查询</el-button
        >
        <el-button :loading="loading" :icon="useIcon('ep-download')" @click="onDownloadClick">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>
    <div class="search-table">
      <div class="title-wrapper">
        <h4>任务列表</h4>
      </div>
      <el-table :data="list" v-loading="loading" element-loading-text="加载中..." height="600">
        <el-table-column label="任务编号" width="90">
          <template #default="{ row }">
            <el-button @click="$router.push(`/task/detail?id=${row.id}`)" link type="primary">{{
              row.id
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="任务名称" prop="name" width="140" />
        <el-table-column label="发布人信息" :formatter="deployFormatter" />
        <el-table-column label="处置人信息" :formatter="dealFormatter" />
        <el-table-column label="任务类型" prop="type" width="100" />
        <el-table-column label="预警等级" width="90">
          <template #default="{ row }">
            <el-tag v-if="row.warning === 1" effect="dark" type="success"> 绿色 </el-tag>
            <el-tag v-else-if="row.warning === 2" effect="dark" type="warning"> 黄色 </el-tag>
            <el-tag v-else="row.warning === 3" effect="dark" type="danger"> 红色 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="生成方式" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.resource === 1" effect="dark" type="success"> 自动生成 </el-tag>
            <el-tag v-else-if="row.resource === 2" effect="dark" type="warning"> 批量导入 </el-tag>
            <el-tag v-else="row.resource === 3" effect="dark" type="danger"> 手动创建 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.status === 10" effect="dark"> 已创建待发布 </el-tag>
            <el-tag v-else-if="row.status === 20" effect="dark"> 已发布待签收 </el-tag>
            <el-tag v-else-if="row.status === 30" effect="dark" type="warning">
              已签收待反馈
            </el-tag>
            <el-tag v-else-if="row.status === 32" effect="dark" type="warning">
              已退回待反馈
            </el-tag>
            <el-tag v-else-if="row.status === 40" effect="dark" type="info"> 已反馈待核查 </el-tag>
            <el-tag v-else-if="row.status === 50" type="success" effect="dark">
              核查完已归档
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="截止日期" prop="deadline" />
        <el-table-column label="创建日期" prop="createTime" />
      </el-table>
      <el-pagination
        class="pagination"
        v-model:current-page="searchForm.currentPage"
        v-model:page-size="searchForm.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { useIcon } from '@/components/CyIcon/hook'
import { exportJsonToExcel } from '@/plugins/excel'

const shortcuts = [
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
]
const preThreeMonth = dayjs().subtract(3, 'M').format('YYYY-MM-DD 00:00:00')
const now = dayjs().format('YYYY-MM-DD 23:59:59')
export const defalutTime = [preThreeMonth, now]

export default {
  data() {
    return {
      searchTime: defalutTime,
      shortcuts,
      list: [],
      total: 0,
      loading: false,
      searchForm: {
        currentPage: 1,
        pageSize: 10,

        status: '',
        warning: '',
        resource: '',
        createDeptIds: [],
        dealDeptIds: [],
        types: []
      }
    }
  },
  mounted() {
    const {
      createDeptId,
      status,
      createUserId,
      dealUserId,
      warning,
      resource,
      dealDeptId,
      receive,
      type
    } = this.$route.query
    this.searchForm = {
      currentPage: 1,
      pageSize: 10,
      status,
      warning,
      resource,
      receive,
      createUserId,
      dealUserId,
      createDeptIds: createDeptId ? [+createDeptId] : [],
      dealDeptIds: dealDeptId ? [+dealDeptId] : [],
      types: type ? [type] : []
    }
    this.getList()
  },
  methods: {
    useIcon,
    deployFormatter(row) {
      return `${row.createDeptName}-${row.createUserName}`
    },
    dealFormatter(row) {
      return `${row.dealDeptName}-${row.dealUserName}`
    },
    onSearchBtnClick() {
      this.searchForm.currentPage = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      if (this.searchTime && this.searchTime.length) {
        const [startTime, endTime] = this.searchTime
        this.searchForm.startTime = startTime
        this.searchForm.endTime = endTime
      }
      const { code, result } = await this.$http
        .post('/api/statistics/getPageList', this.searchForm)
        .finally(() => {
          this.loading = false
        })
      if (code === 200) {
        this.list = result.list || []
        this.total = result.total || 0
      }
    },
    // --------------------以下表格相关操作
    handleSizeChange(pageSize) {
      this.searchForm.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(currentPage) {
      this.searchForm.currentPage = currentPage
      this.getList()
    },
    async onDownloadClick() {
      this.loading = true
      if (this.searchTime && this.searchTime.length) {
        const [startTime, endTime] = this.searchTime
        this.searchForm.startTime = startTime
        this.searchForm.endTime = endTime
      }
      const { code, result } = await this.$http
        .post('/api/statistics/findList', this.searchForm)
        .finally(() => {
          this.loading = false
        })
      if (code !== 200) {
        return
      }
      const list = result.map((item) => {
        let warningText
        if (item.warning === 1) {
          warningText = '绿色'
        } else if (item.warning === 2) {
          warningText = '黄色'
        } else {
          warningText = '红色'
        }
        let resourceText
        if (item.resource === 1) {
          resourceText = '自动生成'
        } else if (item.resource === 2) {
          resourceText = '批量导入'
        } else {
          resourceText = '手动创建'
        }
        return {
          任务编号: item.id,
          任务名称: item.name,
          发布人: item.createUserName,
          发布单位: item.createDeptName,
          处置人: item.dealUserId,
          处置单位: item.createDeptName,
          任务类型: item.type,
          问题描述: item.question.desc,
          问题类型: item.question.type,
          预警等级: warningText,
          生成方式: resourceText,
          截止日期: item.deadline,
          创建日期: item.createTime
        }
      })
      exportJsonToExcel(list, '任务明细统计列表.xlsx')
    }
  }
}
</script>
