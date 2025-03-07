import request from '@/utils/request'

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: '/order/seller/list',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: `/admin/orders/${id}`,
    method: 'get'
  })
}

// 更新订单状态
export function updateOrderStatus(id, status) {
  return request({
    url: `/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 发货
export function shipOrder(id, data) {
  return request({
    url: `/admin/orders/${id}/ship`,
    method: 'post',
    data
  })
}

// 处理退款申请
export function handleRefund(id, data) {
  return request({
    url: `/orders/${id}/refund`,
    method: 'post',
    data
  })
}

// 获取订单统计数据
export function getOrderStats() {
  return request({
    url: '/orders/stats',
    method: 'get'
  })
}

// 取消订单
export function cancelOrder(id, reason) {
  return request({
    url: `/admin/orders/${id}/cancel`,
    method: 'post',
    data: { reason }
  })
}

// 完成订单
export function completeOrder(id) {
  return request({
    url: `/admin/orders/${id}/complete`,
    method: 'post'
  })
} 