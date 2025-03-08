import request from '@/utils/request'

// 获取退款列表
export function getRefundList(params) {
  return request({
    url: '/order/refund/list',
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

// 同意退款申请
export function handleRefund(data) {
  return request({
    url: `/order/refund/accept`,
    method: 'put',
    data
  })
}

// 拒绝退款申请
export function rejectRefund(data) {
  return request({
    url: `/order/refund/refuse`,
    method: 'put',
    data
  })
} 