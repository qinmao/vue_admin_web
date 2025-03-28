<template>
  <el-form ref="formRef" :model="ruleForm" :rules="rules" label-width="100px">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="登录账号" prop="account">
            <el-input v-model="ruleForm.account" clearable placeholder="请输入账号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="ruleForm.userName" clearable placeholder="请输入用户名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12" v-if="!id">
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
        <el-col :span="12" v-if="!id">
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
  </el-form>
</template>

<script setup>
import { validPhone, validEmail } from '@/utils'

const props = defineProps({
  initData: {
    type: Object
  },
  id: {
    type: [String, Number]
  },

  treeDepts: {
    type: Array
  },
  treeUserList: {
    type: Array
  }
})

const formRef = ref(null)
const ruleForm = reactive({
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

Object.entries(props.initData).forEach(([key, value]) => {
  ruleForm[key] = value
})

const rules = {
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
}

// 暴露方法
const validate = () => formRef.value.validate()
const getFormData = () => ({
  ...ruleForm
})

defineExpose({
  validate,
  getFormData // 只暴露方法，不暴露数据对象
})
</script>
