import request from '@/utils/request'

// 获取评价列表
export function getReviewList(params) {
  return request({
    url: '/reviews',
    method: 'get',
    params
  })
}

// 回复评价
export function replyReview(data) {
  return request({
    url: '/admin/review/reply',
    method: 'post',
    data
  })
}

// 删除评价
export function deleteReview(id) {
  return request({
    url: `/reviews/${id}`,
    method: 'delete'
  })
}

// 更新评价状态
export function updateReviewStatus(id, status) {
  return request({
    url: `/reviews/${id}/status`,
    method: 'put',
    data: { status }
  })
}