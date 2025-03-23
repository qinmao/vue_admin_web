import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { addCollection } from '@iconify/vue'
import { icons as epIcons } from '@iconify-json/ep'
import { icons as riIcons } from '@iconify-json/ri'

// 引入平台配置
import('./platform-config')

// element-plus 暗黑模式 CSS 变量
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'animate.css'
// 导入样式
import './style/index.scss'

// 添加两个图标集合
addCollection(epIcons)
addCollection(riIcons)

import App from './App.vue'
import router from './router'
import '@/router/guard'

const app = createApp(App)
const pinia = createPinia()

app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误 如 Sentry
  console.log('errorHandler:', err)
}

import { httpReq } from '@/plugins/axios'
import { setupI18n } from '@/plugins/i18n'

app.use(pinia)
app.use(router)
app.use(httpReq)

setupI18n(app).then(() => {
  app.mount('#app')
})
