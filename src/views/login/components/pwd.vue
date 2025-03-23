<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="pwdRules" class="login-form">
    <h4 class="welcom">欢迎登录</h4>
    <el-form-item prop="account">
      <div class="input-row">
        <el-input
          class="input"
          v-model.trim="ruleForm.account"
          placeholder="请输入账号"
          autofocus
          clearable
        >
          <template #prefix>
            <i-ep-user />
          </template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item prop="password">
      <div class="input-row">
        <el-input
          class="input"
          clearable
          v-model="ruleForm.password"
          type="password"
          show-password
          placeholder="请输入密码"
        >
          <template #prefix>
            <i-ep-lock />
          </template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item prop="verifyCode">
      <div class="input-row">
        <el-input class="input" v-model="ruleForm.verifyCode" placeholder="请输入验证码">
          <template #prefix>
            <i-ri-shield-keyhole-line />
          </template>
          <template #append>
            <img class="code-img" @click="resetCodeClick" :src="imgCodeUrl" alt="验证码" />
          </template>
        </el-input>
      </div>
    </el-form-item>
    <div class="btn-opt">
      <el-button
        class="login-btn"
        :loading="loading"
        type="primary"
        @click="onLoginBtnClick(ruleFormRef)"
        >登录</el-button
      >
    </div>
  </el-form>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { pwdRules } from '../utils/rule'
import { useUserStore } from '@/store/user'
import { debounce } from '@/utils'

const { loginByPwd } = useUserStore()

const loading = ref(false)

const ruleForm = reactive({
  account: '',
  password: '',
  verifyCode: ''
})

const ruleFormRef = ref()
const imgCodeUrl = ref(`/api/common/getCodeImage?${Math.random()}`)

const router = useRouter()

const onLoginBtnClick = async (formEl) => {
  loading.value = true
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      loginByPwd(ruleForm)
        .then((res) => {
          // 跳转到记录的页面或首页
          const { query } = router.currentRoute.value
          const redirect = query.redirect || '/'
          router.push(redirect)
          ElMessage({ message: '登录成功', type: 'success' })
        })
        .finally(() => (loading.value = false))
    } else {
      loading.value = false
      return fields
    }
  })
}

const resetCodeClick = () => {
  const codeUrl = `/api/common/getCodeImage`
  imgCodeUrl.value = codeUrl + '?' + Math.random()
}

const keydownHandler = debounce(({ code }) => {
  const keyCodes = ['Enter', 'NumpadEnter']
  if (keyCodes.includes(code) && loading.value === false) {
    onLoginBtnClick(ruleFormRef.value)
  }
})

onMounted(() => {
  window.document.addEventListener('keydown', keydownHandler)
})

onUnmounted(() => {
  window.document.removeEventListener('keydown', keydownHandler)
})
</script>

<style lang="scss" scoped>
.login-form {
  width: 392px;
  height: 372px;
  background: url(../imgs/login-form.png) no-repeat;
  background-size: 100% 100%;
  padding-top: 60px;
  .welcom {
    text-align: center;
    font-size: 34px;
    font-family: AlibabaPuHuiTi;
    font-weight: bold;
    color: #fff;
    margin-bottom: 20px;
  }
  .input-row {
    margin: 0 auto;
    :deep(.el-input__wrapper) {
      background-color: transparent;
      border-color: #0ba1f8;
    }
    :deep(.el-input__inner) {
      color: #fff;
    }
    :deep(.el-input-group__append) {
      padding: 0;
    }
    .input {
      width: 300px;
    }
    .code-img {
      height: 100%;
      cursor: pointer;
    }
  }
  .btn-opt {
    text-align: center;
    .login-btn {
      width: 300px;
    }
  }
}
</style>
