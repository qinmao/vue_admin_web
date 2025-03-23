<template>
  <div class="page-wrapper">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="登录账号" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入登录账号" autocomplete="off" />
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
        <p>在线用户</p>
      </div>
      <div class="table-wrapper" ref="tableWrapperRef">
        <el-table
          :height="tableHeight"
          :data="list"
          v-loading="loading"
          element-loading-text="加载中..."
          height="600"
        >
          <el-table-column prop="name" label="用户Id" />
          <el-table-column prop="name" label="用户名" />
          <el-table-column prop="code" label="登录IP" />
          <el-table-column prop="content" label="登录地点" />
          <el-table-column prop="content" label="操作系统" />
          <el-table-column prop="content" label="浏览器" />
          <el-table-column prop="content" label="登录时间" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                link
                type="primary"
                :icon="useIcon('ep-edit-pen')"
                @click="onEditDialogClick(row)"
              >
                强退
              </el-button>
            </template>
          </el-table-column>
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
defineOptions({
  name: 'OnlineUser'
})

const searchFormRef = ref(null)
const searchForm = reactive({
  name: '',
  currentPage: 1,
  pageSize: 20
})

const list = ref([])
const loading = ref(false)
const total = ref(0)

async function getList() {
  loading.value = true
  const { result } = await $http
    .get(`/api/sms/getSMSTemplateList?name=${searchForm.name}`)
    .finally(() => {
      loading.value = false
    })
  list.value = result || []
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

<style lang="scss" scoped></style>
