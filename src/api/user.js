import request from '@/utils/request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params
  })
}

// 获取用户详情
export function getUserDetail(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'get'
  })
}

// 更新用户状态
export function updateUserStatus(id, status) {
  return request({
    url: `/admin/users/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 重置用户密码
export function resetUserPassword(id) {
  return request({
    url: `/admin/users/${id}/password/reset`,
    method: 'post'
  })
}

// 管理员登录
export function login(data) {
  return request({
    url: '/seller/login',
    method: 'post',
    data
  })
}

// 获取管理员信息
export function getAdminInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

// 更新管理员密码
export function updateAdminPassword(data) {
  return request({
    url: '/admin/password',
    method: 'put',
    data
  })
} 