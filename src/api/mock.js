import {
  generateDashboardData,
  generateProducts,
  generateOrders,
  generateRefunds,
  generateMerchants,
  generateUsers,
  generateCategories,
  generateReviews
} from '@/utils/mockData'

// 模拟延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 仪表盘
export async function getDashboardData() {
  await delay()
  return generateDashboardData()
}

// 商品相关
export async function getProductList() {
  // await delay()
  // return {
  //   total: 100,
  //   list: generateProducts()
  // }
}

export async function getProductDetail(id) {
  await delay()
  return generateProducts(1)[0]
}

// 分类相关
export async function getCategoryList() {
  await delay()
  return generateCategories()
}

// 订单相关
export async function getOrderList() {
  await delay()
  return {
    total: 100,
    list: generateOrders()
  }
}

export async function getOrderDetail(id) {
  await delay()
  return generateOrders(1)[0]
}

// 退款相关
export async function getRefundList() {
  await delay()
  return {
    total: 100,
    list: generateRefunds()
  }
}

export async function getRefundDetail(id) {
  await delay()
  return generateRefunds(1)[0]
}

// 商家相关
export async function getMerchantList() {
  await delay()
  return {
    total: 100,
    list: generateMerchants()
  }
}

export async function getMerchantDetail(id) {
  await delay()
  return generateMerchants(1)[0]
}

// 用户相关
export async function getUserList() {
  await delay()
  return {
    total: 100,
    list: generateUsers()
  }
}

export async function getUserDetail(id) {
  await delay()
  return generateUsers(1)[0]
}

// 评价相关
export async function getReviewList() {
  await delay()
  return {
    total: 100,
    list: generateReviews()
  }
}

// 通用操作响应
export async function handleSuccess() {
  await delay()
  return { success: true }
}

export async function handleError() {
  await delay()
  throw new Error('操作失败')
} 