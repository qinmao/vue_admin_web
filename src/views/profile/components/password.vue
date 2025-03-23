<template>
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
      <p  :style="{ 'text-align': 'center',  color: curScore === idx ? item.color : '' }">
        {{ item.text }}
      </p>
    </div>
  </div>
  <el-button type="primary" :loading="pwdBtnloading" @click="onPwdSubmitClick"> 修改 </el-button>
</template>
<script setup>
import { zxcvbn } from '@zxcvbn-ts/core'
import { $http } from '@/plugins/axios/index'
import { useUserStore } from '@/store/user'

const passwordRef = ref()
// 重置的新密码
const pwdForm = reactive({
  password: ''
})

const pwdProgress = reactive([
  { color: '#e74242', text: '非常弱' },
  { color: '#EFBD47', text: '弱' },
  { color: '#ffa500', text: '一般' },
  { color: '#1bbf1b', text: '强' },
  { color: '#008000', text: '非常强' }
])
// 当前密码强度（0-4）
const curScore = ref()

const pwdBtnloading = ref(false)

watch(pwdForm, ({ password }) => (curScore.value = !password ? -1 : zxcvbn(password).score))

function onPwdSubmitClick() {
  passwordRef.value.validate((valid) => {
    if (valid) {
      pwdBtnloading.value = true
      $http
        .post(`/api/user/updateSelfPassword`, pwdForm)
        .then(() => {
          ElMessageBox.confirm('密码已成功修改,是否重新登录?', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              useUserStore().logout()
            })
            .catch(() => {
              // catch error
            })
        })
        .finally(() => {
          pwdBtnloading.value = false
        })
    }
  })
}
</script>

<style lang="scss">
/** 局部重置 ElProgress 的部分样式 */
.el-progress-bar__outer,
.el-progress-bar__inner {
  border-radius: 0;
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
