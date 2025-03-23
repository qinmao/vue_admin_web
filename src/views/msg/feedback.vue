<template>
  <div class="page-wrapper">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="消息状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="消息状态" clearable>
          <el-option label="未读" :value="0" />
          <el-option label="已读" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="发送人">
        <el-input v-model="searchForm.sendUserName" clearable placeholder="发送人" />
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
        <p>反馈消息列表</p>
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
          <el-table-column prop="sendUserName" label="发送人" />
          <el-table-column label="消息内容" min-width="220">
            <template #default="{ row }">
              <span v-if="row.msgType == 1">
                <template v-for="(cItem, index) in row.docs">
                  <el-image
                    v-if="isImage(cItem.url)"
                    preview-teleported="true"
                    class="msg-img"
                    :key="index"
                    style="width: 80px"
                    :src="formatUrl(cItem.url)"
                    :zoom-rate="1.2"
                    :preview-src-list="getImgUrls(row.docs)"
                    :initial-index="index"
                    fit="contain"
                  />
                  <el-link
                    v-if="!isImage(cItem.url)"
                    class="file-item"
                    type="primary"
                    title="点击查看或下载"
                    :href="formatUrl(cItem.url)"
                    target="_blank"
                    ><i-ep-download />{{ cItem.url }}</el-link
                  >
                </template>
              </span>
              <span v-else>{{ row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="msgType" label="消息类型">
            <template #default="{ row }">
              {{ row.msgType === 1 ? '附件' : '文本' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="消息状态">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" effect="dark" type="success"> 已读 </el-tag>
              <el-tag v-else effect="dark" type="warning"> 未读 </el-tag>
            </template>
          </el-table-column>
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

defineOptions({
  name: 'FeedBack'
})

const searchFormRef = ref(null)
const searchForm = reactive({
  currentPage: 1,
  pageSize: 20,

  sendUserName: '',
  status: ''
})
const list = ref([])
const loading = ref(false)
const total = ref(0)

async function getList() {
  loading.value = true
  const { code, result } = await $http.post('/api/task-msg/getPageList', searchForm).finally(() => {
    loading.value = false
  })
  if (code === 200) {
    list.value = result.list || []
    total.value = result.total || 0
  }
}

function formatUrl(url) {
  return `${import.meta.env.VITE_APP_STATICE}/dajiandu_doc/${url}`
}

function isImage(url) {
  const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
  const imgExts = ['png', 'jpg', 'jpeg', 'webp']
  return imgExts.includes(ext)
}

function getImgUrls(docs = []) {
  let imgUrlList = []
  docs.forEach((item) => {
    if (isImage(item.url)) {
      const url = `${import.meta.env.VITE_APP_STATICE}/dajiandu_doc/${item.url}`
      imgUrlList.push(url)
    }
  })
  return imgUrlList
}

function onResetBtnClick() {
  if (!searchFormRef.value) return
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

<style lang="scss" scoped>
.msg-img {
  margin-left: 5px;
  margin-right: 5px;
}
.file-item {
  font-size: 12px;
}
</style>
