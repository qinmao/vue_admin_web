<template>
  <h4 class="title">用户注册</h4>
  <el-form
    ref="ruleFormRef"
    class="register-wrapper"
    label-width="120"
    :model="ruleForm"
    :rules="updateRules"
    size="large"
  >
    <el-form-item
      label="账号"
      :rules="[
        {
          required: true,
          message: '登录账号不能为空',
          trigger: 'blur'
        }
      ]"
      prop="account"
    >
      <el-input
        v-model="ruleForm.account"
        clearable
        placeholder="请输入登录账号"
        :prefix-icon="useIcon('ep-user')"
      />
    </el-form-item>
    <el-form-item prop="phone" label="手机号">
      <el-input
        v-model="ruleForm.phone"
        clearable
        placeholder="请输入手机号"
        :prefix-icon="useIcon('ep-phone')"
      />
    </el-form-item>
    <el-form-item prop="verifyCode" label="验证码">
      <el-input
        v-model="ruleForm.verifyCode"
        clearable
        placeholder="请输入验证码"
        :prefix-icon="useIcon('ri:shield-keyhole-line')"
      >
        <template #append>
          <el-button :disabled="isDisabled" @click="useVerifyCode().start(ruleFormRef, 'phone')">
            {{ text.length > 0 ? text + '秒后重新获取' : '获取验证码' }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input
        v-model="ruleForm.password"
        clearable
        show-password
        placeholder="请输入密码"
        :prefix-icon="useIcon('ri-lock-fill')"
      />
    </el-form-item>
    <el-form-item :rules="repeatPasswordRule" prop="repeatPassword" label="确认密码">
      <el-input
        v-model="ruleForm.repeatPassword"
        clearable
        show-password
        placeholder="确认密码"
        :prefix-icon="useIcon('ri-lock-password-fill')"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="onSubmitBtnClick(ruleFormRef)">
        提交
      </el-button>
      <el-button type="primary" @click="router.push('/login')"> 返回登录 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { $http } from '@/plugins/axios/index'

import { useIcon } from '@/components/CyIcon/hook'
import { updateRules } from './utils/rule'
import { useVerifyCode } from './utils/verifyCode'
const { isDisabled, text } = useVerifyCode()

const router = useRouter()

const loading = ref(false)
const ruleForm = reactive({
  account: '',
  phone: '',
  verifyCode: '',
  password: '',
  repeatPassword: ''
})

const ruleFormRef = ref()

const repeatPasswordRule = [
  {
    required: true,
    validator: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (ruleForm.password !== value) {
        callback(new Error('两次密码不一致!'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]

const onSubmitBtnClick = async (formEl) => {
  loading.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { repeatPassword, ...params } = ruleForm
      const { code, result } = await $http
        .post('/api/user/register', params)
        .finally(() => (loading.value = false))
      if (code === 200 && result > 0) {
        ElMessage({ message: '注册成功', type: 'success' })
      }
    } else {
      loading.value = false
      return fields
    }
  })
}
</script>
<style>
.title {
  margin: 5% 0;
  text-align: center;
}
.register-wrapper {
  margin: 0 auto;
  width: 600px;
  height: 60%;
}
</style>
