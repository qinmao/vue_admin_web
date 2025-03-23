import { defineStore } from 'pinia'
import { loginByPassword, getSelfDetail, getUserPermissions } from '@/api/user'
import { removeStore } from '@/utils'
import { constantRoutes, asyncRoutes, redirectRoutes } from '@/router/routes'
import router from '@/router'
import { resolve } from 'path-browserify'

export const useUserStore = defineStore('user', {
  state: () => ({
    userAllRoutes: [], // 用户全量路由,过滤菜单时使用
    hasGeneratedRoutes: false,
    userInfo: {}
  }),
  actions: {
    loginByPwd(loginForm) {
      return new Promise((resolve, reject) => {
        loginByPassword(loginForm)
          .then(async (res) => {
            const {
              result: { access_token }
            } = res
            // 1. set Token
            localStorage.setItem('token', access_token)
            // 2. set UserInfo
            await this.getInfo()
            // 3. 获取权限生成动态路由并添加
            await this.generateRoutes()
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async getInfo() {
      if (this.userInfo && this.userInfo.id) return
      const { result } = await getSelfDetail()
      this.userInfo = result || {}
    },
    logout() {
      removeStore('token')
      this.userInfo = {}
      router.replace('/login')
      location.reload()
    },
    // 生成动态路由
    async generateRoutes() {
      //   const { result: permissonList } = await getUserPermissions()
      //   const dynamicRoutes = permissonList.filter((v) => v.type === 'router').map((v) => v.url) // 用户权限控制的动态路由
      //   // 比对全量动态路由取交集
      //   let filterRouters = []
      //   asyncRoutes.forEach((v) => {
      //     if (dynamicRoutes.includes(v.path)) {
      //       if (!v.children) {
      //         filterRouters.push(v)
      //       } else {
      //         v.children = v.children.filter((item) =>
      //           dynamicRoutes.includes(resolve(v.path, item.path))
      //         )
      //         filterRouters.push(v)
      //       }
      //     }
      //   })
      //   const userDynamicRoutes = [...filterRouters, ...redirectRoutes]
      //   userDynamicRoutes.forEach((v) => {
      //     router.addRoute(v)
      //   })

      //   开发环境测试
      const userDynamicRoutes = [...asyncRoutes, ...redirectRoutes]
      userDynamicRoutes.forEach((v) => {
        router.addRoute(v)
      })

      this.userAllRoutes = [...constantRoutes, ...userDynamicRoutes]
      this.hasGeneratedRoutes = true
      //   console.log('filterRouters:', filterRouters)
      //   console.log('userAllRoutes:', this.userAllRoutes)
    }
  }
})
