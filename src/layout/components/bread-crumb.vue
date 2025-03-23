<template>
  <el-breadcrumb>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path">
        <a @click.prevent="handleLink(item)">
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const levelList = ref([])

const route = useRoute()
const router = useRouter()
// const routes = router.options.routes
// console.log('router', router)

const getBreadcrumb = () => {
  const matched = router.currentRoute.value.matched
  return matched
    .filter((item) => item.meta)
    .map((item) => {
      return {
        path: item.path,
        meta: item.meta,
        redirect: item.redirect
      }
    })
}

const handleLink = (item) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
  } else {
    router.push(path)
  }
}

onMounted(() => {
  levelList.value = getBreadcrumb()
  // console.log('levelList', levelList)
})

watch(
  () => route.path,
  () => {
    levelList.value = getBreadcrumb()
  },
  {
    deep: true
  }
)
</script>
