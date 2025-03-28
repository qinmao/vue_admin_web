<template>
  <div class="two-page-wrapper">
    <tree
      ref="treeRef"
      class="l-tree"
      :treeData="treeDepts"
      :treeLoading="treeLoading"
      @tree-select="onTreeSelect"
    />
    <div class="r-table">
      <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名称：" prop="userName">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名称" clearable />
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable class="!w-[160px]">
            <el-option label="已开启" value="1" />
            <el-option label="已关闭" value="0" />
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
      <div class="search-table">
        <div class="title-wrapper">
          <p>用户列表</p>
          <div class="r-btn-wrapper">
            <div class="btn-opt">
              <el-button @click="onAddDialogClick" type="primary" :icon="useIcon('ep-circle-plus')">
                新增用户
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
            <el-table-column prop="id" label="用户编号" width="90" />
            <el-table-column prop="avatarUrl" label="用户人像" width="90">
              <template #default="{ row }">
                <el-avatar :size="50" shape="square" :src="row.avatarUrl" v-if="row.avatarUrl" />
                <el-avatar :size="50" :icon="useIcon('ep-user-filled')" v-else />
              </template>
            </el-table-column>
            <el-table-column prop="account" label="登录账号" width="80" />
            <el-table-column prop="userName" label="用户名" />
            <el-table-column prop="phone" label="手机号" />
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
            <el-table-column label="归属部门" prop="paths" :formatter="deptNameFormat" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="remark" label="备注" />
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
                  :title="`是否确认删除用户名称为${row.userName}的这条数据`"
                  @confirm="onDeleteBtnClick(row)"
                >
                  <template #reference>
                    <el-button link type="primary" :icon="useIcon('ep-delete')"> 删除 </el-button>
                  </template>
                </el-popconfirm>
                <el-dropdown>
                  <el-button
                    style="margin-left: 10px"
                    link
                    type="primary"
                    :icon="useIcon('ep-more')"
                  />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <el-button
                          link
                          type="primary"
                          :icon="useIcon('ep-lock')"
                          @click="onResetPwdClick(row)"
                        >
                          重置密码
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          link
                          type="primary"
                          :icon="useIcon('ri-admin-line')"
                          @click="onEditRoleClick(row)"
                        >
                          分配角色
                        </el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
  </div>
</template>
<script setup>
import { $http } from '@/plugins/axios/index'
import tree from './tree.vue'
import { useIcon } from '@/components/CyIcon/hook'
import { buildTree, getAllPathsFromTree } from '@/utils'
import { useDept } from '@/views/system/dept/utils/hook'
const { treeDepts, getDeptList } = useDept()
import { useResizeTable } from '@/views/hook/table'
const { tableHeight, tableWrapperRef } = useResizeTable()

import PwdForm from './form/pwd-form.vue'
import AccountForm from './form/account-form.vue'
import RoleForm from './form/role-form.vue'
import { useDialog } from '@/components/CyDialog/hook'
const { createDialog } = useDialog()

defineOptions({
  name: 'User'
})

const treeLoading = ref(false)
const treeRef = ref()

const searchForm = reactive({
  deptId: '', // 左侧部门树的id
  userName: '',
  phone: '',
  status: '',

  currentPage: 1,
  pageSize: 20
})
const searchFormRef = ref()
const loading = ref(false)
const list = ref([])
const total = ref(0)

const treeUserList = ref([])
const roleList = ref([])

function onTreeSelect({ id, selected }) {
  searchForm.deptId = selected ? id : 68
  getPageList()
}

function deptNameFormat(row, column, cellValue, index) {
  let deptNameList = []
  cellValue.forEach((item) => {
    const currDeptName = item.map((deptItem) => deptItem.name).join('>')
    deptNameList.push(currDeptName)
  })
  return deptNameList.join(',')
}

async function getPageList() {
  loading.value = true
  const { result } = await $http.post('/api/user/getPageList', searchForm).finally(() => {
    loading.value = false
  })
  const userList = result.list || []

  const newList = userList.map((item) => {
    const treeDepts = buildTree(item.depts)
    item.paths = getAllPathsFromTree(treeDepts)
    return item
  })

  list.value = newList
  total.value = result.total || 0
}

function onSearchBtnClick() {
  searchForm.currentPage = 1
  getPageList()
}

function onResetBtnClick() {
  searchFormRef.value.resetFields()
  searchForm.deptId = ''
  treeRef.value.onTreeReset()
  onSearchBtnClick()
}

function handleSizeChange(pageSize) {
  searchForm.pageSize = pageSize
  getPageList()
}

function handleCurrentChange(currentPage) {
  searchForm.currentPage = currentPage
  getPageList()
}

async function updateUserInfo(id, userInfo = {}) {
  const { result } = await $http.post(`/api/user/update/${id}`, userInfo)
  if (result > 0) {
    ElMessage({
      type: 'success',
      message: '修改成功'
    })
  }
}

function onSwitchChange(status, row) {
  ElMessageBox.confirm(
    `确认要<strong>${
      row.status === 0 ? '停用' : '启用'
    }</strong><strong style='color:var(--el-color-primary)'>${row.userName}</strong>用户吗?`,
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
      updateUserInfo(row.id, { status })
    })
    .catch(() => {
      row.status === 0 ? (row.status = 1) : (row.status = 0)
    })
}

function onAddDialogClick() {
  createDialog({
    width: '50%',
    title: `添加账号`,
    content: AccountForm,
    contentProps: {
      initData: {},
      id: '',
      treeDepts: treeDepts.value,
      treeUserList: treeUserList.value
    },
    buttons: [
      {
        text: '提交',
        type: 'primary',
        handle: async ({ formData, validate, close }) => {
          const isValid = await validate()
          if (!isValid) return

          //  处理 用户归属部门
          const { deptIds, ...rest } = formData
          const formDeptIds = [...new Set(deptIds.flat())]
          const params = { deptIds: formDeptIds, ...rest }
          addUser(params).then(() => {
            ElMessage({
              message: '添加用户成功',
              type: 'success'
            })
            onSearchBtnClick()
          })
          close()
        }
      },
      {
        text: '取消',
        handle: ({ formData, close }) => close()
      }
    ]
  })
}

async function onEditDialogClick(row) {
  //   const { result } = await $http.get(`/api/user/getUsertDetail/${row.id}`)
  const result = JSON.parse(JSON.stringify(row))
  const { depts, paths, createTime, id, ...rest } = result
  const deptIds = []
  paths.forEach((item) => {
    const currDeptIds = item.map((deptItem) => deptItem.id)
    if (currDeptIds.length) {
      deptIds.push(currDeptIds)
    }
  })

  createDialog({
    width: '50%',
    title: `编辑账号`,
    content: AccountForm,
    contentProps: {
      initData: { deptIds, ...rest },
      id,
      treeDepts: treeDepts.value,
      treeUserList: treeUserList.value
    },
    buttons: [
      {
        text: '提交',
        type: 'primary',
        handle: async ({ formData, validate, close }) => {
          const isValid = await validate()
          if (!isValid) return
          //  处理 用户归属
          const { deptIds, password, ...rest } = formData
          const formDeptIds = [...new Set(deptIds.flat())]
          const params = { deptIds: formDeptIds, ...rest }
          updateUser(id, params).then(() => {
            ElMessage({
              message: '修改成功',
              type: 'success'
            })
            onSearchBtnClick()
          })
          close()
        }
      },
      {
        text: '取消',
        handle: ({ formData, close }) => close()
      }
    ]
  })
}

function updatePwd(id, pwdForm) {
  return $http.post(`/api/user/updatePassword/${id}`, pwdForm)
}

function onResetPwdClick(row) {
  createDialog({
    width: '50%',
    title: `重置 ${row.account} 用户的密码`,
    content: PwdForm,
    buttons: [
      {
        text: '提交',
        type: 'primary',
        handle: async ({ formData, validate, close }) => {
          const isValid = await validate()
          if (!isValid) return
          updatePwd(row.id, formData).then(() => {
            ElMessage({
              message: `密码已成功重置`,
              type: 'success'
            })
            close()
          })
        }
      },
      {
        text: '取消',
        handle: ({ formData, close }) => close()
      }
    ]
  })
}

// 分配用户角色
function updateUserRole(id, params) {
  return $http.post(`/api/user/updateUserRole/${id}`, params)
}

async function onEditRoleClick(row) {
  // 获取当前用户用户的角色
  const { result } = await $http.get(`/api/user/getUsertDetail/${row.id}`)
  const roleIds = result.roles.map((item) => item.id) || []
  createDialog({
    width: '50%',
    title: `为 ${row.account} 分配角色`,
    content: RoleForm,
    contentProps: {
      initData: {
        roleIds
      },
      roleList: roleList.value
    },
    buttons: [
      {
        text: '提交',
        type: 'primary',
        handle: async ({ formData, validate, close }) => {
          const isValid = await validate()
          if (!isValid) return

          updateUserRole(row.id, formData).then(() => {
            ElMessage({
              message: '分配角色成功',
              type: 'success'
            })
          })
          close()
        }
      },
      {
        text: '取消',
        handle: ({ formData, close }) => close()
      }
    ]
  })
}

async function getUserList() {
  const { result: userList } = await $http.post(`/api/user/getList`, { status: 1 })
  const treeUserData = buildTree(userList)
  treeUserList.value = treeUserData || []
}

function addUser(params) {
  return $http.post('/api/user/add', params)
}

function updateUser(id, params) {
  return $http.post(`/api/user/update/${id}`, params)
}

function onDeleteBtnClick(row) {
  $http.post(`/api/user/delete/${row.id}`).then(() => {
    ElMessage({
      message: '删除用户信息成功',
      type: 'success'
    })
    onSearchBtnClick()
  })
}

async function getRoleList() {
  const { result } = await $http.get('/api/role/list')
  roleList.value = result || []
}

onMounted(() => {
  getDeptList() // 获取层级化的部门数据
  getRoleList()
  getUserList()

  getPageList()
})
</script>

<style scoped lang="scss">
.two-page-wrapper {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 48px);
  padding: 24px;
}

.l-tree {
  width: 260px;
  margin-right: 8px;
}

.r-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pwd-tip-wrapper {
  margin-top: 16px;
  display: flex;

  .tip-item {
    width: 19vw;
    margin-right: 4px;
  }
}
</style>
