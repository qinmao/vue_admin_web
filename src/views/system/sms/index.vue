<template>
  <div class="page-wrapper">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="模版名" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入模版名" autocomplete="off" />
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
        <p>短信模版列表</p>
        <div class="r-btn-wrapper">
          <div class="btn-opt">
            <el-button @click="onAddDialogClick" type="primary" :icon="useIcon('ep-circle-plus')">
              新增模版
            </el-button>
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
          height="640"
        >
          <el-table-column prop="name" label="模版名" />
          <el-table-column prop="code" label="模版Code" />
          <el-table-column prop="content" label="模版内容" min-width="220" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :icon="useIcon('ep-edit-pen')"
                @click="onEditDialogClick(row)"
              >
                修改
              </el-button>
              <el-button
                :icon="useIcon('ep-pointer')"
                class="reset-margin"
                link
                :loading="tryLoading"
                type="primary"
                @click="onTrySendClick(row.content)"
                >{{ tryLoading ? '发送中' : '试发' }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="短信模版" width="40%" :before-close="handleClose">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="rule-form"
        status-icon
      >
        <el-form-item label="模版名" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="模版code" prop="code" v-if="!ruleForm.id">
          <el-input v-model="ruleForm.code" autocomplete="off" />
        </el-form-item>
        <el-form-item label="短信内容" prop="content">
          <el-input v-model="ruleForm.content" :rows="3" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onAbortClck">重置</el-button>
          <el-button type="primary" :loading="btnLoading" @click="onSubmitBtnClick()">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { $http } from '@/plugins/axios/index'
import { useIcon } from '@/components/CyIcon/hook'
import { useResizeTable } from '@/views/hook/table'
const { tableHeight, tableWrapperRef } = useResizeTable()

defineOptions({
  name: 'SMS'
})

const searchFormRef = ref(null)
const searchForm = reactive({
  name: ''
})
const list = ref([])
const loading = ref(false)
let ruleForm = reactive({})
let dialogVisible = ref(false)
let btnLoading = ref(false)
let tryLoading = ref(false)
const rules = reactive({
  name: [{ required: true, message: '请输入模版名', trigger: 'blur' }],
  code: [{ required: true, message: '请输入模版code', trigger: 'blur' }],
  content: [{ required: true, message: '请输入短信内容', trigger: 'blur' }]
})
let ruleFormRef = ref(null)

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
  getList()
}

function onResetBtnClick() {
  if (!searchFormRef.value) return
  searchFormRef.value.resetFields()
  onSearchBtnClick()
}

function onAbortClck() {
  ruleFormRef.value.resetFields()
}

function handleClose() {
  ElMessageBox.confirm('确认要关闭弹窗吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ruleForm = {}
      dialogVisible.value = false
    })
    .catch(() => {
      // catch error
    })
}

function onAddDialogClick() {
  dialogVisible.value = true
  nextTick(() => {
    ruleFormRef.value.resetFields()
  })
}

async function onSubmitBtnClick() {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      btnLoading.value = true
      const { id, ...data } = ruleForm
      const url = id ? `/api/sms/update/${id}` : '/api/sms/add'
      const { result } = await $http.post(url, data).finally(() => {
        btnLoading.value = false
      })
      if (result > 0) {
        ElMessage({
          type: 'success',
          message: '操作成功'
        })
        dialogVisible.value = false
        onSearchBtnClick()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

function onEditDialogClick(row) {
  dialogVisible.value = true
  nextTick(() => {
    const { id, name, code, content } = JSON.parse(JSON.stringify(row))
    ruleForm = { id, name, code, content }
  })
}

function onTrySendClick(sendContent) {
  tryLoading.value = true
  $http
    .post('/api/sms/trySendMsg', {
      sendContent,
      receivePhone: '186xxxxxxxx'
    })
    .finally(() => {
      tryLoading.value = false
    })
}

onMounted(() => {
  //   onSearchBtnClick()
})
</script>
