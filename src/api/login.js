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


/**
 * 获取一个图片验证码的信息
 * @returns {*}
 */
export function getPictureVerifyCode(){
  return request({
    url: '/verifyCode/photo',
    method: 'get'
  })
}