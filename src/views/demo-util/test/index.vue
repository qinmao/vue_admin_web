<template>
  <div class="page-wrapper">
    <el-button @click="onBtnClick" type="primary"> 测试alert </el-button>
  </div>
</template>

<script setup>
import CyAlert from '@/components/CyAlert/index.js'
function onBtnClick() {
  const close = CyAlert('alert命令式组件测试')
  setTimeout(() => {
    close()
  }, 2 * 1000)
}
</script>

<style lang="scss" scoped></style>
