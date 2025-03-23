<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="phoneRules" class="login-form">
    <el-form-item prop="phone">
      <div class="input-row">
        <el-input v-model="ruleForm.phone" clearable placeholder="请输入手机号">
          <template #prefix>
            <i-ep-iphone />
          </template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item prop="verifyCode">
      <div class="input-row">
        <el-input v-model="ruleForm.verifyCode" clearable placeholder="请输入验证码">
          <template #prefix>
            <i-ri-shield-keyhole-line />
          </template>
          <template #append>
            <el-button
              :disabled="isDisabled"
              class="code-btn"
              @click="onGetCodeBtnClick(ruleFormRef)"
            >
              {{ text.length > 0 ? text + '秒后重新获取' : '获取验证码' }}
            </el-button>
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
      <el-button @click="onBackBtnClick"> 返回 </el-button>
    </div>
  </el-form>
</template>
<script setup>
import { phoneRules } from '../utils/rule'
import { useVerifyCode } from '../utils/verifyCode'
const loading = ref(false)
const ruleForm = reactive({
  phone: '',
  verifyCode: ''
})
const ruleFormRef = ref()
const { isDisabled, text, startCode, endCode } = useVerifyCode()

const onLoginBtnClick = async (formEl) => {
  loading.value = true
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 模拟登录请求，需根据实际开发进行修改
      // TODO
      setTimeout(() => {
        // message(transformI18n($t('login.loginSuccess')), { type: 'success' })
        loading.value = false
      }, 2000)
    } else {
      loading.value = false
      return fields
    }
  })
}

function onGetCodeBtnClick(formEl) {
  startCode(formEl, 'phone', () => {
    console.log('发送验证码')
    // TODO
  })
}

function onBackBtnClick() {
  endCode()
  // TODO
}
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
    .code-btn {
      margin-left: 10px;
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
