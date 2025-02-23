import request from '@/utils/request'

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/products',
    method: 'get',
    params
  })
}

// 添加商品
export function addProduct(data) {
  return request({
    url: '/products',
    method: 'post',
    data
  })
}

// 更新商品
export function updateProduct(id, data) {
  return request({
    url: `/products/${id}`,
    method: 'put',
    data
  })
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: `/products/${id}`,
    method: 'delete'
  })
}

// 获取商品详情
export function getProductDetail(id) {
  return request({
    url: `/products/${id}`,
    method: 'get'
  })
}

// 更新商品状态（上架/下架）
export function updateProductStatus(id, status) {
  return request({
    url: `/products/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 商品图片上传
export function uploadProductImage(data) {
  return request({
    url: '/upload/product',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
} 