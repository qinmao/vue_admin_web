<template>
  <div class="page-wrapper">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="权限名称：" prop="name">
        <el-input v-model="searchForm.name" placeholder="" clearable />
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
        <el-button :icon="useIcon('ep-refresh')" @click="onResetBtnClick"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <div class="search-table">
      <div class="title-wrapper">
        <p>权限列表</p>
        <div class="r-btn-wrapper">
          <div class="btn-opt">
            <el-button
              @click="onAddDialogClick('')"
              type="primary"
              :icon="useIcon('ep-circle-plus')"
            >
              新增权限
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
          :data="list"
          :height="tableHeight"
          v-loading="loading"
          element-loading-text="加载中..."
          row-key="id"
          default-expand-all
        >
          <el-table-column prop="name" label="权限名称" />
          <el-table-column prop="code" label="权限标识" />
          <el-table-column prop="type" label="权限类型" />
          <el-table-column prop="url" label="路由地址" />
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column fixed="right" label="操作" min-width="140">
            <template #default="{ row }">
              <el-button
                link
                type="primary"
                :icon="useIcon('ep-edit-pen')"
                @click="onEditDialogClick(row)"
              >
                编辑
              </el-button>
              <el-popconfirm
                :title="`是否确认删除名称为${row.name}的这条数据`"
                @confirm="onDeleteBtnClick(row)"
              >
                <template #reference>
                  <el-button link type="primary" :icon="useIcon('ep-delete')"> 删除 </el-button>
                </template>
              </el-popconfirm>
              <el-button
                link
                @click="onAddDialogClick(row.id)"
                type="primary"
                :icon="useIcon('ep-circle-plus')"
              >
                新增
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :before-close="handleClose"
      width="48%"
      draggable
      title="添加或编辑"
      v-model="dialogVisible"
    >
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="formRules" label-width="100px">
        <el-form-item label="上级权限" prop="pId">
          <el-cascader
            style="width: 100%"
            v-model="ruleForm.pId"
            :options="list"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级权限"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="ruleForm.name" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="ruleForm.code" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择" clearable>
            <el-option label="路由权限" value="router" />
            <el-option label="操作权限" value="operate" />
          </el-select>
        </el-form-item>
        <el-form-item label="前端路由" prop="url" v-if="ruleForm.type == 'router'">
          <el-input v-model="ruleForm.url" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="排序字段" prop="sort">
          <el-input-number
            style="width: 100%"
            v-model="ruleForm.sort"
            :min="1"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ruleForm.remark" placeholder="请输入备注信息" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onAbortClck">重置</el-button>
        <el-button type="primary" :loading="btnLoading" @click="onSubmitClick"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { useIcon } from '@/components/CyIcon/hook'
import { $http } from '@/plugins/axios/index'
import { buildTree } from '@/utils'
import { useResizeTable } from '@/views/hook/table'
const { tableHeight, tableWrapperRef } = useResizeTable()

defineOptions({
  name: 'Permission'
})
const searchFormRef = ref()
const searchForm = reactive({
  name: ''
})
const list = ref([])
const loading = ref(false)

const ruleFormRef = ref(null)
const dialogVisible = ref(false)
const btnLoading = ref(false)
const ruleForm = reactive({
  name: '',
  code: '',
  type: 'router',
  url: '',
  sort: 0,
  pId: 0,
  remark: ''
})
const formRules = reactive({
  name: [{ required: true, message: '权限名必填项', trigger: 'blur' }],
  code: [{ required: true, message: '权限标识必填项', trigger: 'blur' }],
  url: [{ required: true, message: '前端路由必填项', trigger: 'blur' }],
  type: [{ required: true, message: '权限类型必选项', trigger: 'change' }]
})
let editFormId = ref('')

function handleClose(done) {
  ElMessageBox.confirm('确定要关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
async function getList() {
  loading.value = true
  const { result } = await $http.post('/api/permission/getList', searchForm).finally(() => {
    loading.value = false
  })
  const treeOpts = buildTree(result)
  //   console.log('treeOpts:', treeOpts)
  list.value = treeOpts || []
}

function onSearchBtnClick() {
  getList()
}

function onResetBtnClick() {
  searchFormRef.value.resetFields()
  onSearchBtnClick()
}

function onEditDialogClick(row) {
  const { name, code, id, sort, pId, type, url, remark } = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
  nextTick(() => {
    editFormId.value = id
    ruleForm.code = code
    ruleForm.name = name
    ruleForm.type = type
    ruleForm.pId = pId
    ruleForm.url = url
    ruleForm.remark = remark
  })
}
function onDeleteBtnClick(row) {
  $http.post(`/api/permission/delete/${row.id}`).then(() => {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    onSearchBtnClick()
  })
}
function onAddDialogClick(pId) {
  dialogVisible.value = true
  editFormId.value = ''
  nextTick(() => {
    ruleFormRef.value.resetFields()
    if (pId) {
      ruleForm.pId = pId
    }
  })
}
function onAbortClck() {
  ruleFormRef.value.resetFields()
  btnLoading.value = false
}
async function onSubmitClick() {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      btnLoading.value = true
      if (editFormId.value) {
        $http
          .post(`/api/permission/update/${editFormId.value}`, ruleForm)
          .then(() => {
            dialogVisible.value = false
            ElMessage({
              message: '修改成功',
              type: 'success'
            })
            onSearchBtnClick()
          })
          .finally(() => {
            btnLoading.value = false
          })
      } else {
        $http
          .post('/api/permission/add', ruleForm)
          .then(() => {
            dialogVisible.value = false
            ElMessage({
              message: '添加成功',
              type: 'success'
            })
            onSearchBtnClick()
          })
          .finally(() => {
            btnLoading.value = false
          })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  onSearchBtnClick()
})
</script>
