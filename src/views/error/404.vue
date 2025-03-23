<script setup>
import { useRouter } from 'vue-router'

import noExist from '@/assets/svg/status/404.svg?component'

defineOptions({
  name: '404'
})

const router = useRouter()
</script>

<template>
  <div class="wrapper">
    <noExist />
    <div class="content">
      <p class="fp">404</p>
      <p class="tp">抱歉，你访问的页面不存在或您无权访问</p>
      <el-button type="primary" @click="router.push('/')"> 返回首页 </el-button>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 640px;
}
.content {
  margin-left: 12px;
}
.fp {
  margin-top: 4px;
  font-weight: bold;
}
.tp {
  margin-bottom: 4px;
  color: gray;
  font-weight: 500;
}
</style>
