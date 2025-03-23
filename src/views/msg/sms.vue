<template>
  <div class="page-wrapper">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="业务类型" prop="type">
        <el-select v-model="searchForm.type" placeholder="推送类型" clearable>
          <el-option label="发布任务" value="发布任务" />
          <el-option label="更换处置人" value="更换处置人" />
          <el-option label="任务临期提醒" value="任务临期提醒" />
          <el-option label="任务超时提醒" value="任务超时提醒" />
          <el-option label="设置红色预警" value="设置红色预警" />
          <el-option label="核查不通过" value="核查不通过" />
          <el-option label="上报反馈" value="上报反馈" />
        </el-select>
      </el-form-item>
      <el-form-item label="接收人">
        <el-input v-model="searchForm.receiveUserName" clearable placeholder="接收人" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchForm.receivePhone" clearable placeholder="手机号" />
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
        <el-button :icon="useIcon('ep-refresh')" @click="onResetBtnClick()"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <div class="search-table">
      <div class="title-wrapper">
        <p>短信消息列表</p>
        <div class="r-btn-wrapper">
          <el-divider direction="vertical" />
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-icon class="icon" :size="20" @click="onResetBtnClick()">
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
          <el-table-column prop="id" label="序号" width="80" />
          <el-table-column prop="receiveUserName" label="接收人" width="100" />
          <el-table-column prop="receivePhone" label="手机号" width="120" />
          <el-table-column prop="type" label="业务类型" width="140" />
          <el-table-column prop="sendContent" label="短信内容" min-width="220" />
          <el-table-column prop="createTime" label="发送日期" />
        </el-table>
      </div>
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

<script setup>
import { useIcon } from '@/components/CyIcon/hook'
import { $http } from '@/plugins/axios/index'

import { useResizeTable } from '@/views/hook/table'
const { tableHeight, tableWrapperRef } = useResizeTable()

const searchFormRef = ref(null)
const searchForm = reactive({
  receiveUserName: '',
  receivePhone: '',
  type: '',
  currentPage: 1,
  pageSize: 20
})
const list = ref([])
const loading = ref(false)
const total = ref(0)

async function getList() {
  loading.value = true
  const { code, result } = await $http.post('/api/sms/getPageList', searchForm).finally(() => {
    loading.value = false
  })
  if (code === 200) {
    list.value = result.list || []
    total.value = result.total || 0
  }
}

function onResetBtnClick() {
  searchFormRef.value.resetFields()
  onSearchBtnClick()
}

function onSearchBtnClick() {
  searchForm.currentPage = 1
  getList()
}

function handleSizeChange(pageSize) {
  searchForm.pageSize = pageSize
  getList()
}

function handleCurrentChange(currentPage) {
  searchForm.currentPage = currentPage
  getList()
}

onMounted(() => {
  //   onSearchBtnClick()
})
</script>
