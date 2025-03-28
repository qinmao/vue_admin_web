<template>
  <div class="page-wrapper">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="已启用" value="1" />
          <el-option label="已停用" value="0" />
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
        <el-button :icon="useIcon('ep-refresh')" @click="onResetBtnClick"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <div class="page-content">
      <div class="search-table">
        <div class="title-wrapper">
          <p>角色列表</p>
          <div class="r-btn-wrapper">
            <div class="btn-opt">
              <el-button @click="onAddDialogClick" type="primary" :icon="useIcon('ep-circle-plus')">
                新增角色
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
          >
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="code" label="角色标识" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="已启用"
                  inactive-text="已停用"
                  inline-prompt
                  @Change="(newVal) => onSwitchChange(newVal, row)"
                />
              </template>
            </el-table-column>
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
                  :title="`是否确认删除角色名称为${row.name}的这条数据`"
                  @confirm="onDeleteBtnClick(row)"
                >
                  <template #reference>
                    <el-button link type="primary" :icon="useIcon('ep-delete')"> 删除 </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  @click="onPermissionBtnClick(row)"
                  link
                  type="primary"
                  :icon="useIcon('ep-menu')"
                >
                  分配权限
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
      <div class="permission-wrapper" v-if="showPermission">
        <div class="permission-header">
          <div class="btn-wrapper">
            <el-button @click="showPermission = false" type="primary" :icon="useIcon('ep-close')">
              取消
            </el-button>
            <el-button type="primary" @click="onSaveBtnClick" :icon="useIcon('ep-check')">
              保存
            </el-button>
          </div>
          <div class="r-desc">为【{{ currentRoleInfo.name }}】分配权限</div>
        </div>
        <div class="input-search">
          <el-input v-model="filterText" placeholder="请输入关键词进行搜索" clearable />
        </div>
        <div class="permission-opt">
          <!-- <el-checkbox @change="onExpandChange" label="展开/折叠" /> -->
          <el-checkbox @change="onSelectAllChange" label="全选/全不选" />
        </div>
        <el-tree
          ref="treeRef"
          :data="allPermission"
          :props="{ label: 'name', children: 'children' }"
          show-checkbox
          node-key="id"
          check-strictly
          default-expand-all
          :filter-node-method="filterNode"
        ></el-tree>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name" clearable placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色标识" prop="code">
          <el-input v-model="ruleForm.code" clearable placeholder="请输入角色标识" />
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
import { buildTree } from '@/utils/index'
import { useResizeTable } from '@/views/hook/table'
const { tableHeight, tableWrapperRef } = useResizeTable()

defineOptions({
  name: 'Role'
})

const searchFormRef = ref()
const searchForm = reactive({
  name: '',
  status: '',
  currentPage: 1,
  pageSize: 20
})
const list = ref([])
const loading = ref(false)
const total = ref(0)

const ruleFormRef = ref()

const dialogVisible = ref(false)
const btnLoading = ref(false)
const ruleForm = reactive({
  name: '',
  code: '',
  remark: ''
})
const formRules = reactive({
  name: [{ required: true, message: '角色名必填项', trigger: 'blur' }],
  code: [{ required: true, message: '角色标识必填项', trigger: 'blur' }]
})
let editFormId = ref('')

let showPermission = ref(false)
let currentRoleInfo = ref({})
let allPermission = ref([])
let allPermissionIds = []
let treeRef = ref(null)
let filterText = ref('')

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
  const { result } = await $http.post('/api/role/getPageList', searchForm).finally(() => {
    loading.value = false
  })

  list.value = result.list || []
  total.value = result.total || 0
}
function handleSizeChange(pageSize) {
  searchForm.pageSize = pageSize
  getList()
}
function handleCurrentChange(currentPage) {
  searchForm.currentPage = currentPage
  getList()
}
function onSearchBtnClick() {
  searchForm.currentPage = 1
  getList()
}
function onResetBtnClick() {
  searchFormRef.value.resetFields()
  onSearchBtnClick()
}
async function onEditDialogClick(row) {
  const { name, code, id, status, remark } = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true

  nextTick(() => {
    editFormId.value = id
    ruleForm.code = code
    ruleForm.name = name
    ruleForm.status = status
    ruleForm.remark = remark
  })
}
function onDeleteBtnClick(row) {
  $http.post(`/api/role/delete/${row.id}`).then(() => {
    ElMessage({
      message: '删除信息成功',
      type: 'success'
    })
    onSearchBtnClick()
  })
}
function onSwitchChange(status, row) {
  ElMessageBox.confirm(
    `确认要<strong>${
      row.status === 0 ? '停用' : '启用'
    }</strong><strong style='color:var(--el-color-primary)'>${row.name}</strong>吗?`,
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
      updateRole(row.id, { status })
    })
    .catch(() => {
      row.status === 0 ? (row.status = 1) : (row.status = 0)
    })
}
function updateRole(id, roleInfo) {
  $http.post(`/api/role/update/${id}`, roleInfo).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success'
    })
  })
}
function onAddDialogClick() {
  dialogVisible.value = true
  editFormId.value = ''
  nextTick(() => {
    ruleFormRef.value.resetFields()
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
          .post(`/api/role/update/${editFormId.value}`, ruleForm)
          .then(() => {
            dialogVisible.value = false
            ElMessage({
              message: '修改角色信息成功',
              type: 'success'
            })
            onSearchBtnClick()
          })
          .finally(() => {
            btnLoading.value = false
          })
      } else {
        $http
          .post('/api/role/add', ruleForm)
          .then(() => {
            dialogVisible.value = false
            ElMessage({
              message: '添加角色成功',
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

async function getRolePermission(roleId) {
  const {
    result: { permissions }
  } = await $http.get(`/api/role/getRoleDetailById/${roleId}`)
  const permissionIds = permissions.map((item) => item.id)
  return permissionIds
}

// 获取所有的权限列表
async function getAllPermisson() {
  const { result } = await $http.post('/api/permission/getList', {})
  const treeOpts = buildTree(result)
  //   console.log('treeOpts:', treeOpts)
  allPermissionIds = result.map((item) => item.id)
  allPermission.value = treeOpts || []
}

// 展示角色权限
async function onPermissionBtnClick(row) {
  const permissionIds = await getRolePermission(row.id)
  showPermission.value = true
  nextTick(() => {
    currentRoleInfo.value = row
    treeRef.value.setCheckedKeys(permissionIds)
  })
}

function onSelectAllChange(val) {
  const selectKeys = val ? allPermissionIds : []
  treeRef.value.setCheckedKeys(selectKeys)
}
watch(filterText, (val) => {
  treeRef.value.filter(val)
})
const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

function onSaveBtnClick() {
  const checkedKeys = treeRef.value.getCheckedKeys()
  const roleId = currentRoleInfo.value.id
  //   console.log('checkedKeys:', checkedKeys)
  $http
    .post(`/api/role/updateRolePermission/${roleId}`, {
      permissionIds: checkedKeys
    })
    .then(() => {
      ElMessage({
        message: '保存权限成功',
        type: 'success'
      })
    })
}

onMounted(() => {
  onSearchBtnClick()
  getAllPermisson()
})
</script>

<style scoped lang="scss">
.page-content {
  display: flex;
  justify-content: space-between;
  height: 100%;
  .search-table {
    transition: all 0.3s;
  }
  .permission-wrapper {
    flex: 1;
    margin-left: 10px;
    margin-top: 8px;
    padding: 0 8px;
    background-color: var(--el-bg-color);

    .permission-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      .btn-wrapper {
        display: flex;
        align-items: center;
      }
      .r-desc {
        font-size: 16px;
      }
    }
    .permission-opt {
      margin-top: 10px;
    }
  }
}
</style>
