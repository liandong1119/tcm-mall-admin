import request from '@/utils/request'

// 获取商家列表
export function getMerchantList(params) {
  return request({
    url: '/admin/merchants',
    method: 'get',
    params
  })
}

// 获取商家详情
export function getMerchantDetail(id) {
  return request({
    url: `/admin/merchants/${id}`,
    method: 'get'
  })
}

// 更新商家状态
export function updateMerchantStatus(id, status) {
  return request({
    url: `/admin/merchants/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 添加商家
export function addMerchant(data) {
  return request({
    url: '/admin/merchants',
    method: 'post',
    data
  })
}

// 更新商家信息
export function updateMerchant(id, data) {
  return request({
    url: `/admin/merchants/${id}`,
    method: 'put',
    data
  })
} 