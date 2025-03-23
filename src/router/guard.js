// 路由守卫
import NProgress from '@/plugins/nprogress'
import router from './index'
import { useUserStore } from '@/store/user'

/** 路由白名单 */
const whiteList = ['/login', '/regist', '/404']

let hasToken

router.beforeEach(async (to, from) => {
  if (!hasToken) {
    hasToken = localStorage.getItem('token')
  }
  // start progress bar
  NProgress.start()

  // set page title
  document.title = to?.meta?.title ?? '找不到路径'

  if (hasToken) {
    if (!useUserStore().hasGeneratedRoutes) {
      // console.log('未生成动态路由时生成一次')
      await useUserStore().generateRoutes()
      // 触发重定向,解决上面动态添加路由可能未完成的问题
      return to.fullPath
    }
    return true
  } else {
    if (whiteList.includes(to.path)) {
      //   console.log('未登录-在白名单的不拦截')
      return true
    } else {
      // 跳转登录页
      NProgress.done()
      return `/login?redirect=${encodeURIComponent(to.fullPath)}`
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
