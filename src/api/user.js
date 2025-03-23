import { $http } from '@/plugins/axios/index'

export function loginByPassword(data) {
  return $http({
    url: '/api/auth/loginByPassword',
    method: 'post',
    data
  })
}

export function loginByPhone(data) {
  return $http({
    url: '/api/auth/loginByPhone',
    method: 'post',
    data
  })
}

export function logout() {
  return $http({
    url: '/api/auth/logout',
    method: 'post'
  })
}

// 登录成功获取的解密Token
export function profile() {
  return $http({
    url: '/api/auth/profile',
    method: 'get'
  })
}

export function getSelfDetail() {
  return $http.get(`/api/user/getSelfDetail`)
}

export function getUsertDetail(userId) {
  return $http({
    url: `/api/user/getUsertDetail/${userId}`,
    method: 'get'
  })
}

export function getUserPermissions() {
  return $http({
    url: `/api/user/getUserPermissions`,
    method: 'get'
  })
}
