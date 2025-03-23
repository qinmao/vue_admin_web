<script setup>
defineOptions({
  name: 'app'
})
import dayjs from 'dayjs'
import { version, name as title } from '../package.json'
import { checkVersion } from 'version-rocket'
import { i18n } from '@/plugins/i18n'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// console.log('zhCn:', zhCn)
import { useUserStore } from '@/store/user'
const { getInfo } = useUserStore()

const currentLocale = computed(() => {
  const lang = i18n.global.locale.value
  const { element } = i18n.global.getLocaleMessage(lang)
  return element
})

const watermarkConfig = {
  font: {
    fontSize: 16
  },
  rotate: -22,
  gap: [100, 100],
  offset: []
}

const waterContent = computed(() => {
  const { account, ip } = useUserStore().userInfo
  const now = dayjs().format('YYYY-MM-DD HH:mm')
  return `${account}-${ip}-${now}`
})

const route = useRoute()
const noWatermarkPages = ['/login', '/register'] // Add routes where you don't want the watermark
const showWatermark = computed(() => {
  return !noWatermarkPages.includes(route.path)
})

// 版本实时更新检测，只作用于线上环境
const checkAppVersion = () => {
  const { MODE } = import.meta.env
  // https://github.com/guMcrey/version-rocket/blob/main/README.zh-CN.md#api
  if (MODE === 'production') {
    checkVersion(
      // config
      {
        // 5分钟检测一次版本
        pollingTime: 5 * 60 * 1000,
        localPackageVersion: version,
        originVersionFileUrl: `${location.origin}/version.json`
      },
      // options
      {
        title,
        description: '检测到新版本',
        buttonText: '立即更新'
      }
    )
  }
}

function initUserInfo() {
  const token = localStorage.getItem('token')
  if (token) {
    getInfo()
  }
}

onBeforeMount(() => {
  initUserInfo()
  checkAppVersion()
})
</script>
<template>
  <el-config-provider :locale="currentLocale">
    <el-watermark
      v-if="showWatermark"
      :content="waterContent"
      :font="watermarkConfig.font"
      :rotate="watermarkConfig.rotate"
      :gap="watermarkConfig.gap"
      :offset="watermarkConfig.offset"
    >
      <RouterView />
    </el-watermark>
    <RouterView v-else />
  </el-config-provider>
</template>
