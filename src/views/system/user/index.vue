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
                  class="reset-margin"
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
                    <el-button
                      class="reset-margin"
                      link
                      type="primary"
                      :icon="useIcon('ep-delete')"
                    >
                      删除
                    </el-button>
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
                          @click="onRoleClick(row)"
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
    <el-dialog
      class="pure-dialog"
      :before-close="handleClose"
      width="48%"
      draggable
      title="添加或编辑"
      v-model="dialogVisible"
    >
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="formRules" label-width="100px">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="ruleForm.userName" clearable placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="ruleForm.account" clearable placeholder="请输入账号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12" v-if="!editFormId">
            <el-form-item label="用户密码" prop="password">
              <el-input
                type="password"
                clearable
                show-password
                v-model="ruleForm.password"
                placeholder="请输入用户密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="ruleForm.phone" clearable placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="归属部门" prop="deptIds">
          <el-cascader
            style="width: 100%"
            v-model="ruleForm.deptIds"
            :show-all-levels="false"
            :options="treeDepts"
            :props="{
              value: 'id',
              label: 'name',
              // 设置父子节点取消选中关联，从而达到选择任意一级选项
              checkStrictly: true,
              multiple: true
            }"
            clearable
            filterable
            placeholder="请选择归属部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="直属领导" prop="pId">
          <el-cascader
            style="width: 100%"
            v-model="ruleForm.pId"
            :options="treeUserList"
            :props="{
              value: 'id',
              label: 'userName',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择直属领导"
          >
            <template #default="{ node, data }">
              <span>{{ data.userName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email" clearable placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex">
              <el-select
                v-model="ruleForm.sex"
                placeholder="请选择用户性别"
                style="width: 100%"
                clearable
              >
                <el-option label="男性" :value="1" />
                <el-option label="女性" :value="2" />
                <el-option label="未知" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" placeholder="请输入备注信息" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!editFormId">
            <el-form-item label="状态" prop="status">
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
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="onAbortClck">重置</el-button>
        <el-button type="primary" :loading="btnLoading" @click="onSubmitClick"> 确定 </el-button>
      </template>
    </el-dialog>
    <el-dialog
      class="pure-dialog"
      :before-close="pwdHandleClose"
      width="30%"
      draggable
      :title="resetPwdTitle"
      v-model="pwdDialogVisible"
    >
      <el-form
        ref="passwordRef"
        :model="pwdForm"
        :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]"
      >
        <el-form-item label="用户密码" prop="password">
          <el-input
            type="password"
            clearable
            show-password
            v-model="pwdForm.password"
            placeholder="请输入用户新密码"
          />
        </el-form-item>
      </el-form>
      <div class="pwd-tip-wrapper">
        <div class="tip-item" v-for="(item, idx) in pwdProgress" :key="idx">
          <el-progress
            striped
            striped-flow
            :duration="curScore === idx ? 6 : 0"
            :percentage="curScore >= idx ? 100 : 0"
            :color="item.color"
            :stroke-width="10"
            :show-text="false"
          />
          <p :style="{ 'text-align': 'center', color: curScore === idx ? item.color : '' }">
            {{ item.text }}
          </p>
        </div>
      </div>
      <template #footer>
        <el-button @click="onPwdAbortClick">重置</el-button>
        <el-button type="primary" :loading="pwdBtnloading" @click="onPwdSubmitClick">
          确定
        </el-button>
      </template>
    </el-dialog>
    <el-dialog
      class="pure-dialog"
      :before-close="roleHandleClose"
      width="30%"
      draggable
      :title="roleTitle"
      v-model="roleDialogVisible"
    >
      <el-form :model="roleForm">
        <el-form-item label="用户名称">
          <el-input disabled v-model="roleForm.userName" />
        </el-form-item>
        <el-form-item label="用户id" v-show="false">
          <el-input v-model="roleForm.userId" />
        </el-form-item>
        <el-form-item label="角色列表" prop="roleIds">
          <el-select
            v-model="roleForm.roleIds"
            placeholder="请选择"
            style="width: 100%"
            clearable
            multiple
          >
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :value="item.id"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="roleBtnloading" @click="onRoleSubmitClick">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { $http } from '@/plugins/axios/index'
import tree from './tree.vue'
import { useIcon } from '@/components/CyIcon/hook'
import { validPhone, validEmail, buildTree, getAllPathsFromTree } from '@/utils'
import { usePwd, useRole } from './utils/hook'
import { useDept } from '@/views/system/dept/utils/hook'
const { treeDepts, getDeptList } = useDept()
import { useResizeTable } from '@/views/hook/table'
const { tableHeight, tableWrapperRef } = useResizeTable()

const {
  pwdDialogVisible,
  passwordRef,
  pwdForm,
  pwdProgress,
  curScore,
  resetPwdTitle,
  pwdBtnloading,
  onPwdAbortClick,
  onPwdSubmitClick,
  onResetPwdClick,
  pwdHandleClose
} = usePwd()

const {
  roleTitle,
  roleDialogVisible,
  roleBtnloading,
  roleForm,
  roleList,
  roleHandleClose,
  getRoleList,
  onRoleClick,
  onRoleSubmitClick
} = useRole()

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

const ruleFormRef = ref()
const dialogVisible = ref(false)
const btnLoading = ref(false)
const treeUserList = ref([])
let ruleForm = reactive({
  userName: '',
  deptIds: [],
  account: '',
  pId: '',
  password: '',
  phone: '',
  email: '',
  sex: '',
  status: 1,
  remark: ''
})
const formRules = reactive({
  userName: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
  password: [{ required: true, message: '用户密码为必填项', trigger: 'blur' }],
  account: [{ required: true, message: '账号为必填项', trigger: 'blur' }],
  phone: [
    {
      required: true,
      message: '手机号为必填项',
      trigger: 'blur',
      validator(rule, value, callback) {
        if (!value) {
          callback(new Error('请输手机号'))
        } else if (!validPhone(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
    }
  ],
  deptIds: [{ required: true, message: '用户归属部门为必填项', trigger: 'change' }],
  //   pId: [{ required: true, message: '用户直属领导为必选项', trigger: 'change' }],
  email: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (!validEmail(value)) {
          callback(new Error('请输入正确的邮箱格式'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
let editFormId = ref('')

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

function handleClose(done) {
  ElMessageBox.confirm('确定要关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
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

async function getList() {
  const { result: userList } = await $http.post(`/api/user/getList`, { status: 1 })
  const treeUserData = buildTree(userList)
  treeUserList.value = treeUserData || []
}

function addUser(params) {
  btnLoading.value = true

  $http
    .post('/api/user/add', params)
    .then(() => {
      dialogVisible.value = false
      ElMessage({
        message: '添加用户成功',
        type: 'success'
      })
      onSearchBtnClick()
    })
    .finally(() => {
      btnLoading.value = false
    })
}

function updateUser(params) {
  btnLoading.value = true
  $http
    .post(`/api/user/update/${editFormId.value}`, params)
    .then(() => {
      dialogVisible.value = false
      ElMessage({
        message: '修改用户信息成功',
        type: 'success'
      })
      onSearchBtnClick()
    })
    .finally(() => {
      btnLoading.value = false
    })
}
async function onSubmitClick() {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      //  处理 用户归属部门
      const { deptIds, ...rest } = ruleForm
      const formDeptIds = [...new Set(deptIds.flat())]
      const formData = { deptIds: formDeptIds, ...rest }
      if (editFormId.value) {
        updateUser(formData)
      } else {
        addUser(formData)
      }
    } else {
      console.log('error submit!', fields)
    }
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
  editFormId.value = id
  ruleForm = {
    deptIds,
    ...rest
  }
  dialogVisible.value = true
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
onMounted(() => {
  getDeptList() // 获取层级化的部门数据

  getPageList()

  getList()

  getRoleList()
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
