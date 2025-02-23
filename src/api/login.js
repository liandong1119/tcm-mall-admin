import request from '../utils/request'

// 登录接口
export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}