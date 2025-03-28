<template>
  <el-form ref="formRef" :model="ruleForm" :rules="rules">
    <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        show-password
        clearable
        v-model="ruleForm.password"
        placeholder="请输入用户新密码"
      />
    </el-form-item>
    <el-form-item>
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
    </el-form-item>
  </el-form>
</template>

<script setup>
import './reset.css'
import { zxcvbn } from '@zxcvbn-ts/core'
// const props = defineProps({
//   initData: {
//     type: Object
//   }
// })
// console.log('props:', props)

const formRef = ref(null)
const ruleForm = reactive({
  password: ''
})
const rules = {
  password: { required: true, message: '请输入新密码', trigger: 'blur' }
}

const pwdProgress = reactive([
  { color: '#e74242', text: '非常弱' },
  { color: '#EFBD47', text: '弱' },
  { color: '#ffa500', text: '一般' },
  { color: '#1bbf1b', text: '强' },
  { color: '#008000', text: '非常强' }
])
// 当前密码强度（0-4）
const curScore = ref()

// 暴露方法
const validate = () => formRef.value.validate()
const getFormData = () => ({
  ...ruleForm
})

watch(ruleForm, ({ password }) => (curScore.value = !password ? -1 : zxcvbn(password).score))

defineExpose({
  validate,
  getFormData // 只暴露方法，不暴露数据对象
})
</script>

<style lang="scss" scoped>
.pwd-tip-wrapper {
  width: 100%;
  margin-top: 16px;
  display: flex;

  .tip-item {
    flex: 1;
    margin-right: 4px;
  }
}
</style>
