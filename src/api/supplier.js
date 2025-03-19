import request from '@/utils/request'

/**
 * 获取供应商列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.name] - 供应商名称
 * @param {number} [params.status] - 状态 (1-启用, 0-禁用)
 * @returns {Promise}
 */
export function getSupplierList(params) {
  return request({
    url: '/supplier/list',
    method: 'get',
    params
  })
}

/**
 * 获取所有有效供应商（用于下拉选择）
 * @returns {Promise}
 */
export function getAllSuppliers() {
  return request({
    url: '/supplier/all',
    method: 'get'
  })
}

/**
 * 获取供应商详情
 * @param {number} id - 供应商ID
 * @returns {Promise}
 */
export function getSupplierDetail(id) {
  return request({
    url: `/supplier/${id}`,
    method: 'get'
  })
}

/**
 * 添加供应商
 * @param {Object} data - 供应商数据
 * @returns {Promise}
 */
export function addSupplier(data) {
  return request({
    url: '/supplier',
    method: 'post',
    data
  })
}

/**
 * 更新供应商
 * @param {number} id - 供应商ID
 * @param {Object} data - 供应商数据
 * @returns {Promise}
 */
export function updateSupplier(id, data) {
  return request({
    url: `/supplier/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除供应商
 * @param {number} id - 供应商ID
 * @returns {Promise}
 */
export function deleteSupplier(id) {
  return request({
    url: `/supplier/${id}`,
    method: 'delete'
  })
}

/**
 * 搜索供应商
 * @param {string} keyword - 搜索关键词
 * @returns {Promise}
 */
export function searchSuppliers(keyword) {
  return request({
    url: '/supplier/search',
    method: 'get',
    params: { keyword }
  })
} 