<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="formRules" label-width="100px">
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="ruleForm.userName" clearable placeholder="请输入用户名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account" clearable placeholder="请输入账号" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" clearable placeholder="请输入手机号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" clearable placeholder="请输入邮箱" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="归属部门" prop="deptIds">
      <el-cascader
        class="w-full"
        v-model="ruleForm.deptIds"
        :show-all-levels="false"
        :options="treeDepts"
        :props="{
          value: 'id',
          label: 'name',
          multiple: true,
          checkStrictly: true
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
    <el-form-item label="上级领导" prop="pId">
      <el-cascader
        class="w-full"
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
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio :value="1">男性</el-radio>
            <el-radio :value="2">女性</el-radio>
            <el-radio :value="3">保密</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" placeholder="请输入备注信息" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" :loading="btnLoading" @click="onSubmitClick"> 修改 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { $http } from '@/plugins/axios/index'
import { validPhone, validEmail, buildTree, getAllPathsFromTree } from '@/utils'
import { useUserStore } from '@/store/user'
import { useDept } from '@/views/system/dept/utils/hook'
const { treeDepts, getDeptList } = useDept()
const { setInfo, userInfo } = useUserStore()

const ruleFormRef = ref()
const btnLoading = ref(false)
const treeUserList = ref([])

let ruleForm = ref({})

const formRules = reactive({
  userName: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
  account: [{ required: true, message: '警号为必填项', trigger: 'blur' }],
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
  pId: [{ required: true, message: '用户直属领导为必选项', trigger: 'change' }],
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

async function onSubmitClick() {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      btnLoading.value = true
      const { deptIds, ...rest } = ruleForm.value
      //   console.log('deptIds:', deptIds)
      const formDeptIds = [...new Set(deptIds.flat())]
      const formData = { deptIds: formDeptIds, ...rest }
      $http
        .post(`/api/user/updateSelf`, formData)
        .then(() => {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          setInfo()
        })
        .finally(() => {
          btnLoading.value = false
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

function getSelfDetail() {
  const { id, createTime, ip, status, depts, roles, ...rest } = userInfo
  const deptIds = []
  const paths = getAllPathsFromTree(buildTree(depts))

  paths.forEach((item) => {
    const currDeptIds = item.map((deptItem) => deptItem.id)
    if (currDeptIds.length) {
      deptIds.push(currDeptIds)
    }
  })

  ruleForm.value = {
    deptIds,
    ...rest
  }
}

async function getUserList() {
  const { result } = await $http.post(`/api/user/getList`, { status: 1 })
  const userList = result.map((item) => {
    return {
      disabled: userInfo.id === item.id,
      ...item
    }
  })
  const treeUserData = buildTree(userList)
  treeUserList.value = treeUserData || []
}

onMounted(() => {
  getDeptList()
  getUserList()
  getSelfDetail()
})
</script>
<style>
.w-full {
  width: 100%;
}
</style>
