<template>
  <div class="page-wrapper">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="状态：" prop="running">
        <el-select v-model="searchForm.running" placeholder="请选择状态" clearable>
          <el-option label="已启用" :value="true" />
          <el-option label="已停用" :value="false" />
        </el-select>
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
      </el-form-item>
    </el-form>
    <div class="search-table">
      <div class="title-wrapper">
        <p>任务调度列表</p>
        <div class="r-btn-wrapper">
          <div class="btn-opt">
            <!-- <el-button @click="onAddDialogClick" type="primary" :icon="useIcon(addFillIcon)">
              新增部门
            </el-button> -->
          </div>
          <el-divider direction="vertical" />
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-icon class="icon" :size="20" @click="onResetBtnClick">
              <i-ep-refresh />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper" ref="tableWrapperRef">
        <el-table
          :height="tableHeight"
          :data="list"
          v-loading="loading"
          element-loading-text="加载中..."
        >
          <el-table-column prop="job" label="任务标识" />
          <el-table-column prop="jobName" label="任务名" />
          <el-table-column prop="lastDate" label="上次执行时间" />
          <el-table-column prop="nextDate" label="下次执行时间" />
          <el-table-column prop="running" label="任务状态">
            <template #default="{ row }">
              <el-switch
                v-model="row.running"
                :active-value="true"
                :inactive-value="false"
                active-text="已启用"
                inactive-text="已停用"
                inline-prompt
                @Change="onSwitchChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <!-- <el-button
              link
              type="primary"
              :icon="useIcon(clockIcon)"
              @click="onTimeEditClick(row)"
            >
              更改执行日期
            </el-button> -->
              <el-button
                link
                type="primary"
                :icon="useIcon('ep-video-play')"
                @click="onJobStartClick(row)"
                :loading="row.btnloading"
              >
                立即执行
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { $http } from '@/plugins/axios/index'
import { useIcon } from '@/components/CyIcon/hook'
import { useResizeTable } from '@/views/hook/table'
const { tableHeight, tableWrapperRef } = useResizeTable()

let list = ref([])
let loading = ref(false)
let searchForm = reactive({
  running: ''
})
const searchFormRef = ref(null)

async function getJobList() {
  loading.value = true
  const { result } = await $http('/api/job/getCronJobs').finally(() => {
    loading.value = false
  })
  let arr = []
  if (searchForm.running !== '') {
    arr = result.filter((item) => item.running == searchForm.running)
  } else {
    arr = result
  }
  list.value = arr || []
}

function onSearchBtnClick() {
  getJobList()
}

function onResetBtnClick(formRef) {
  if (!searchFormRef.value) return
  searchFormRef.value.resetFields()
  onSearchBtnClick()
}

function onSwitchChange(row) {
  ElMessageBox.confirm(
    `确认要<strong>${
      row.running ? '启用' : '停用'
    }</strong><strong style='color:var(--el-color-primary)'></strong>吗?`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true,
      draggable: true
    }
  )
    .then(() => {
      $http('/api/job/startOrStopJob', {
        params: {
          jobName: row.job
        }
      })
    })
    .catch(() => {
      row.running ? (row.running = false) : (row.running = true)
    })
}
function onJobStartClick(row) {
  row.btnloading = true
  $http.post(`/api/job/${row.job}`).finally(() => {
    row.btnloading = false
  })
}

onMounted(() => {
  getJobList()
})
</script>
