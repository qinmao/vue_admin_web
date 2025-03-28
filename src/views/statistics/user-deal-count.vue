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
      <el-form-item label="处置部门">
        <el-cascader
          v-model="searchForm.deptId"
          :show-all-levels="false"
          :options="treeDeptOpts"
          :props="{
            value: 'id',
            label: 'name',
            checkStrictly: true,
            emitPath: false
          }"
          clearable
          filterable
          placeholder="请选择任务处置部门"
        >
          <template #default="{ node, data }">
            <span>{{ data.name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
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
        <p>各部门用户处置任务数统计列表</p>
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
        border
        show-summary
        v-loading="loading"
        element-loading-text="加载中..."
        max-height="640"
      >
        <el-table-column prop="dealUserName" label="处置人" />
        <el-table-column prop="dealDeptName" label="归属部门" />
        <el-table-column prop="deployCount" sortable label="共接收"
          ><template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealUserId=${row.dealUserId}`)"
              link
              type="primary"
              >{{ row.deployCount }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="self" sortable label="自查"
          ><template #default="{ row }">
            <el-button
              @click="
                $router.push(
                  `/statistics/task-list?dealUserId=${row.dealUserId}&createUserId=${row.dealUserId}`
                )
              "
              link
              type="primary"
              >{{ row.self }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="receive" sortable label="接收"
          ><template #default="{ row }">
            <el-button
              @click="
                $router.push(
                  `/statistics/task-list?dealUserId=${row.dealUserId}&receive=${row.dealUserId}`
                )
              "
              link
              type="primary"
              >{{ row.receive }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="noSign" sortable label="待签收"
          ><template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealUserId=${row.dealUserId}&status=20`)"
              link
              type="primary"
              >{{ row.noSign }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="signFeedBack" sortable label="签收待反馈"
          ><template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealUserId=${row.dealUserId}&status=30`)"
              link
              type="primary"
              >{{ row.signFeedBack }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="backFeedBack" sortable label="退回待反馈"
          ><template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealUserId=${row.dealUserId}&status=32`)"
              link
              type="primary"
              >{{ row.backFeedBack }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="done" sortable label="已完成"
          ><template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealUserId=${row.dealUserId}&status=50`)"
              link
              type="primary"
              >{{ row.done }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="green" sortable label="绿色预警"
          ><template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealUserId=${row.dealUserId}&warning=1`)"
              link
              type="primary"
              >{{ row.done }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="yellow" sortable label="黄色预警"
          ><template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealUserId=${row.dealUserId}&warning=2`)"
              link
              type="primary"
              >{{ row.done }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="red" sortable label="红色预警"
          ><template #default="{ row }">
            <el-button
              @click="$router.push(`/statistics/task-list?dealUserId=${row.dealUserId}&warning=3`)"
              link
              type="primary"
              >{{ row.done }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { buildTree } from '@/utils'
import { useIcon } from '@/components/CyIcon/hook'

const preThreeMonth = dayjs().subtract(3, 'M').format('YYYY-MM-DD 00:00:00')
const now = dayjs().format('YYYY-MM-DD 23:59:59')
const defalutTime = [preThreeMonth, now]

import { exportJsonToExcel } from '@/plugins/excel'

export default {
  data() {
    return {
      loading: false,
      list: [],
      searchForm: {
        startTime: '',
        endTime: '',
        deptId: ''
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
      treeDeptOpts: [],
      searchTime: defalutTime
    }
  },
  mounted() {
    this.getDeptList()
    this.searchForm.deptId = this.$route.query.deptId
    this.getList()
  },
  methods: {
    useIcon,
    async getDeptList() {
      const { code, result } = await this.$http.post('/api/dept/getList', {
        status: 1
        // hierarchys: [1, 2] // 一级二级
      })
      if (code === 200) {
        const sortList = result
          .sort((a, b) => {
            return b.sort - a.sort
          })
          .map((item) => {
            const { id, name, pId } = item
            return {
              id,
              pId,
              name
            }
          })
        const treeList = buildTree(sortList)
        this.treeDeptOpts = treeList || []
      }
    },
    async getList() {
      this.loading = true
      if (this.searchTime && this.searchTime.length) {
        const [startTime, endTime] = this.searchTime
        this.searchForm.startTime = startTime
        this.searchForm.endTime = endTime
      }
      const { code, result } = await this.$http
        .post('/api/statistics/getDealUserCount', this.searchForm)
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
      this.searchForm.deptId = ''
      this.onSearchBtnClick()
    },
    onSearchBtnClick() {
      this.getList()
    },
    onDownloadClick() {
      const excelData = this.list.map((item) => {
        const {
          dealUserName,
          dealDeptName,
          deployCount,
          noSign,
          noCheck,
          noFeedBack,
          done,
          green,
          yellow,
          red
        } = item
        return {
          处置人: dealUserName,
          归属部门: dealDeptName,
          已下发: deployCount,
          待签收: noSign,
          待反馈: noCheck,
          待核查: noFeedBack,
          已归档: done,
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
