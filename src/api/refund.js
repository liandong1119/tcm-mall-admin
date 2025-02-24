import request from '@/utils/request'

// 获取退款列表
export function getRefundList(params) {
  return request({
    url: '/admin/refunds',
    method: 'get',
    params
  })
}

// 获取退款详情
export function getRefundDetail(id) {
  return request({
    url: `/admin/refunds/${id}`,
    method: 'get'
  })
}

// 处理退款申请
export function handleRefund(id, data) {
  return request({
    url: `/admin/refunds/${id}/handle`,
    method: 'post',
    data
  })
}

// 拒绝退款申请
export function rejectRefund(id, data) {
  return request({
    url: `/admin/refunds/${id}/reject`,
    method: 'post',
    data
  })
} 