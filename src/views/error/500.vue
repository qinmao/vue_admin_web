<script setup>
import { useRouter } from 'vue-router'

import noServer from '@/assets/svg/status/500.svg?component'

defineOptions({
  name: '500'
})

const router = useRouter()
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <noServer />
    <div class="ml-12">
      <p class="font-medium text-4xl mb-4 dark:text-white">500</p>
      <p class="mb-4 text-gray-500">抱歉，服务器出错了</p>
      <el-button type="primary" @click="router.push('/')"> 返回首页 </el-button>
    </div>
  </div>
</template>
