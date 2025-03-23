import { useUserStore } from '@/store/user'

import router from '@/router'

let httpReq = {}

// 接口错误，限制只弹一次窗
let ElMessageBoxShow = []

const $http = axios.create({
  timeout: 60 * 1000 // 设置超时时间
})

// 请求拦截器
$http.interceptors.request.use(
  (config) => {
    // By default, axios serializes JavaScript objects to JSON.
    // To send data in the application/x-www-form-urlencoded format instead,
    // you can use one of the following options.

    // In a browser, you can use the URLSearchParams API as follows:
    // 方法1
    // const params = new URLSearchParams();
    // params.append('param1', 'value1');
    // params.append('param2', 'value2');
    // axios.post('/foo', params);

    // 方法2
    // const qs = require('qs');
    // axios.post('/foo', qs.stringify({ 'bar': 123 }));
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // 这个错误的逻辑在页面上处理
    console.log('interceptors.request', error) // for debug
    return Promise.resolve({ code: 500, message: error })
  }
)
// 响应拦截器
$http.interceptors.response.use(
  (response) => {
    // 服务器 status 返回 2 开头的情况，会进入这个回调
    if (!response.data) {
      return Promise.resolve({ code: 500, message: '服务开小差了!' })
    }
    const { code, message } = response.data
    // console.log('response.data',response.data)
    // 请求通了，业务状态码没通
    if (code !== 200) {
      if (code === 10002) {
        if (ElMessageBoxShow.length === 0) {
          // 限制只弹一次窗
          ElMessageBoxShow.push(1)
          ElMessageBox.confirm('登录信息过期，请重新登录', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              useUserStore()
                .logout()
                .then(() => {
                  router.replace('/login')
                })
            })
            .catch(() => {
              // ElMessage({
              //   type: 'info',
              //   message: '已取消'
              // })
            })
            .finally(() => {
              ElMessageBoxShow = []
            })
        }
      } else {
        // 统一提示错误消息，非业务状态码200的
        ElMessage({
          message: message || '服务异常',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject({ code, message })
    }
    return response.data
  },
  (error) => {
    // 服务器 status 返回不是 2 开头的情况，会进入这个回调

    // console.log('err:', error)

    // 可以根据后端返回的状态码进行不同的操作
    // 断网 或者 请求超时 状态
    if (!error.response) {
      // 请求超时状态
      if (error.message.includes('timeout')) {
        ElMessage.warning({
          message: `请求超时了!`
        })
      } else {
        ElMessage.warning({
          message: `断网了!`
        })
      }
      return Promise.reject({ code: 500, message: error.message })
    } else {
      const status = error.response.status
      switch (status) {
        case 401:
        case 403:
          // 401：未登录
          // 403: 无权限访问
          // to re-login
          ElMessage.warning({
            message: `您暂无权限操作!`
          })
          break
        case 404:
          // 404 请求不存在
          ElMessage.warning({
            message: `网络请求不存在!`
          })
          break
        default:
          // 其他错误，直接抛出错误提示
          ElMessage.warning({
            message: '服务异常请稍后再试！'
          })
          break
      }
      return Promise.reject({ code: status, message: '服务异常请稍后再试！' })
    }
  }
)

httpReq.install = function (app) {
  app.config.globalProperties.$http = $http
}
export { $http, httpReq }
