<template>
  <div class="page-wrapper">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
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
        <el-button :icon="useIcon('ep-refresh')" @click="onResetBtnClick()"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <div class="search-table">
      <div class="title-wrapper">
        <p>部门列表</p>
        <div class="r-btn-wrapper">
          <div class="btn-opt">
            <el-button @click="onAddDialogClick" type="primary" :icon="useIcon('ep-circle-plus')">
              新增部门
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
          v-loading="loading"
          default-expand-all
          element-loading-text="加载中..."
          row-key="id"
          :height="tableHeight"
        >
          <el-table-column prop="name" label="组织名称" min-width="180" />
          <el-table-column prop="deptType" label="组织类型" />
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag effect="dark" type="success" v-if="row.status === 1"> 启用 </el-tag>
              <el-tag effect="dark" type="danger" v-else> 停用 </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="联系人" />
          <el-table-column prop="phone" label="联系方式" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="createTime" label="创建时间" min-width="200" />
          <el-table-column fixed="right" label="操作" width="160">
            <template #default="{ row }">
              <el-button
                link
                type="primary"
                :icon="useIcon('ep-edit')"
                @click="onEditDialogClick(row)"
              >
                编辑
              </el-button>
              <el-popconfirm
                :title="`是否确认删除部门名称为${row.name}的这条数据`"
                @confirm="onDeleteBtnClick(row)"
              >
                <template #reference>
                  <el-button link type="primary" :icon="useIcon('ep-delete')"> 删除 </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog width="40%" draggable title="添加或编辑" v-model="dialogVisible">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="formRules" label-width="100px">
        <el-form-item label="组织类型" prop="deptType">
          <el-select v-model="ruleForm.deptType" placeholder="请选择组织类型" clearable>
            <el-option label="单位(根单位)" value="单位(根单位)" />
            <el-option label="分支单位" value="分支单位" />
            <el-option label="部门" value="部门" />
            <el-option label="项目组/小组" value="项目组/小组" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门" prop="pId" v-if="ruleForm.deptType !== '单位(根单位)'">
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
            placeholder="请选择上级部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="组织名称" prop="name">
          <el-input v-model="ruleForm.name" clearable placeholder="请输入组织名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="userId">
          <el-input v-model="ruleForm.userName" clearable placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" clearable placeholder="请输入联系人手机号" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门状态" prop="status">
              <el-switch
                v-model="ruleForm.status"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="停用"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number
                v-model="ruleForm.sort"
                :min="0"
                :max="9999"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" placeholder="请输入备注信息" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onAbortClck">重置</el-button>
        <el-button type="primary" :loading="btnLoading" @click="onSubmitClick()"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { useIcon } from '@/components/CyIcon/hook'
import { buildTree } from '@/utils'
import { useResizeTable } from '@/views/hook/table'
const { tableHeight, tableWrapperRef } = useResizeTable()
import { $http } from '@/plugins/axios/index'

let list = ref([])
let loading = ref(false)
let searchForm = reactive({
  status: 1
})
let btnLoading = ref(false)
let dialogVisible = ref(false)
let ruleForm = reactive({
  pId: '',
  name: '',
  status: 1,
  sort: 0,
  remark: ''
})
const searchFormRef = ref(null)

const formRules = reactive({
  deptType: [{ required: true, message: '组织类型为必选项', trigger: 'change' }],
  pId: [{ required: true, message: '上级单位名称为必选项', trigger: 'change' }],
  name: [{ required: true, message: '组织名称为必填项', trigger: 'blur' }]
})

const ruleFormRef = ref(null)

let editFormId = ''

function getList() {
  return $http.post('/api/dept/getList', searchForm)
}

async function onSearchBtnClick() {
  loading.value = true
  const { result } = await getList().finally(() => {
    loading.value = false
  })
  const treeList = buildTree(result) // 处理成树结构
  list.value = treeList
}

function onResetBtnClick() {
  if (!searchFormRef.value) return
  searchFormRef.value.resetFields()
  onSearchBtnClick()
}

function onAbortClck() {
  ruleFormRef.value.resetFields()
}
function onAddDialogClick() {
  dialogVisible.value = true
  editFormId = ''
  nextTick(() => {
    ruleFormRef.value.resetFields()
  })
}

function onEditDialogClick(row) {
  dialogVisible.value = true
  nextTick(() => {
    const { id, createTime, children, disabled, ...rest } = JSON.parse(JSON.stringify(row))
    editFormId = id
    ruleForm = rest
  })
}

function update() {
  $http
    .post(`/api/dept/update/${editFormId}`, ruleForm)
    .then(() => {
      dialogVisible.value = false
      ElMessage({
        message: '修改部门信息成功',
        type: 'success'
      })
      onSearchBtnClick()
    })
    .finally(() => {
      btnLoading.value = false
    })
}

function add() {
  btnLoading.value = true
  $http
    .post('/api/dept/add', ruleForm)
    .then(() => {
      dialogVisible.value = false
      ElMessage({
        message: '添加部门成功',
        type: 'success'
      })
      onSearchBtnClick()
    })
    .finally(() => {
      btnLoading.value = false
    })
}
async function onSubmitClick() {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (editFormId) {
        update()
      } else {
        add()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

function onDeleteBtnClick(row) {
  $http.post(`/api/dept/delete/${row.id}`).then(() => {
    ElMessage({
      message: '删除部门信息成功',
      type: 'success'
    })
    onSearchBtnClick()
  })
}
onMounted(() => {
  onSearchBtnClick()
})
</script>
