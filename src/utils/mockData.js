// 生成随机ID
export function generateId() {
  return Math.floor(Math.random() * 10000)
}

// 生成随机金额
export function generateAmount() {
  return +(Math.random() * 10000).toFixed(2)
}

// 生成随机日期
export function generateDate() {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
}

// 生成随机电话号码
export function generatePhone() {
  return '1' + Math.floor(Math.random() * 9 + 1) + Array(9).fill(0).map(() => Math.floor(Math.random() * 10)).join('')
}

// 生成随机商品数据
export function generateProducts(count = 10) {
  return Array(count).fill(0).map(() => ({
    id: generateId(),
    name: `中药材商品${generateId()}`,
    category: `分类${Math.floor(Math.random() * 5 + 1)}`,
    price: generateAmount(),
    stock: Math.floor(Math.random() * 1000),
    status: Math.random() > 0.5 ? 1 : 0,
    createTime: generateDate(),
    description: '这是一个商品描述...',
    images: [
      'https://picsum.photos/200/200',
      'https://picsum.photos/200/200',
    ]
  }))
}

// 生成随机订单数据
export function generateOrders(count = 10) {
  const statuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
  return Array(count).fill(0).map(() => ({
    id: generateId(),
    orderNo: 'ORDER' + Date.now() + generateId(),
    amount: generateAmount(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    customerName: `客户${generateId()}`,
    phone: generatePhone(),
    createTime: generateDate(),
    address: '北京市朝阳区xxx街道xxx号',
    items: generateProducts(Math.floor(Math.random() * 3 + 1))
  }))
}

// 生成随机退款数据
export function generateRefunds(count = 10) {
  const statuses = ['pending', 'approved', 'rejected', 'completed']
  return Array(count).fill(0).map(() => ({
    id: generateId(),
    orderNo: 'ORDER' + Date.now() + generateId(),
    amount: generateAmount(),
    reason: '商品质量问题',
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createTime: generateDate(),
    images: [
      'https://picsum.photos/200/200',
      'https://picsum.photos/200/200',
    ]
  }))
}

// 生成随机商家数据
export function generateMerchants(count = 10) {
  return Array(count).fill(0).map(() => ({
    id: generateId(),
    name: `商家${generateId()}`,
    contact: `联系人${generateId()}`,
    phone: generatePhone(),
    email: `merchant${generateId()}@example.com`,
    address: '北京市朝阳区xxx街道xxx号',
    description: '这是一个商家描述...',
    status: Math.random() > 0.5 ? 1 : 0,
    createTime: generateDate()
  }))
}

// 生成随机用户数据
export function generateUsers(count = 10) {
  return Array(count).fill(0).map(() => ({
    id: generateId(),
    username: `user${generateId()}`,
    nickname: `用户${generateId()}`,
    phone: generatePhone(),
    email: `user${generateId()}@example.com`,
    status: Math.random() > 0.5 ? 1 : 0,
    createTime: generateDate(),
    lastLoginTime: generateDate()
  }))
}

// 生成随机分类数据
export function generateCategories(count = 10) {
  return Array(count).fill(0).map(() => ({
    id: generateId(),
    name: `分类${generateId()}`,
    description: '这是一个分类描述...',
    sort: Math.floor(Math.random() * 100),
    createTime: generateDate()
  }))
}

// 生成随机评价数据
export function generateReviews(count = 10) {
  return Array(count).fill(0).map(() => ({
    id: generateId(),
    productName: `商品${generateId()}`,
    rating: Math.floor(Math.random() * 5 + 1),
    content: '这是一个评价内容...',
    username: `用户${generateId()}`,
    createTime: generateDate(),
    images: [
      'https://picsum.photos/200/200',
      'https://picsum.photos/200/200',
    ]
  }))
}

// 生成仪表盘数据
export function generateDashboardData() {
  // 生成最近30天的销售数据
  const salesData = Array(30).fill(0).map((_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - index))
    return {
      date: date.toISOString().split('T')[0],
      amount: generateAmount(),
      orders: Math.floor(Math.random() * 100)
    }
  })

  // 生成品类销售占比
  const categoryData = [
    { name: '补气类', value: Math.floor(Math.random() * 1000) },
    { name: '补血类', value: Math.floor(Math.random() * 1000) },
    { name: '清热类', value: Math.floor(Math.random() * 1000) },
    { name: '止咳类', value: Math.floor(Math.random() * 1000) },
    { name: '其他类', value: Math.floor(Math.random() * 1000) }
  ]

  // 生成热销商品
  const hotProducts = Array(10).fill(0).map(() => ({
    id: generateId(),
    name: `中药材${generateId()}`,
    price: generateAmount(),
    sales: Math.floor(Math.random() * 1000),
    stock: Math.floor(Math.random() * 100)
  }))

  // 生成订单状态统计
  const orderStats = {
    pending: Math.floor(Math.random() * 100),
    processing: Math.floor(Math.random() * 100),
    shipped: Math.floor(Math.random() * 100),
    completed: Math.floor(Math.random() * 100),
    refunding: Math.floor(Math.random() * 50)
  }

  // 生成最新评价
  const latestReviews = Array(5).fill(0).map(() => ({
    id: generateId(),
    productName: `中药材${generateId()}`,
    rating: Math.floor(Math.random() * 5 + 1),
    content: '这是一个评价内容，描述了对商品的使用感受和建议...',
    username: `用户${generateId()}`,
    createTime: generateDate()
  }))

  return {
    // 今日数据
    todaySales: generateAmount(),
    salesTrend: Math.floor(Math.random() * 100),
    todayOrders: Math.floor(Math.random() * 100),
    totalStock: Math.floor(Math.random() * 10000),
    lowStockCount: Math.floor(Math.random() * 20),
    pendingOrders: orderStats.pending,
    
    // 统计数据
    totalUsers: Math.floor(Math.random() * 10000),
    totalMerchants: Math.floor(Math.random() * 100),
    totalProducts: Math.floor(Math.random() * 1000),
    todayDelivered: Math.floor(Math.random() * 50),
    
    // 图表数据
    salesData,
    categoryData,
    orderStats,
    hotProducts,
    latestReviews,
    
    // 其他统计
    weeklyGrowth: (Math.random() * 100).toFixed(2),
    monthlyGrowth: (Math.random() * 100).toFixed(2),
    averageOrderAmount: generateAmount(),
    customerSatisfaction: (Math.random() * 2 + 3).toFixed(1)
  }
} 