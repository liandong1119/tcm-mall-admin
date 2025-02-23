<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.totalSales') }}</span>
            </div>
          </template>
          <div class="card-body">
            <div class="card-value">¥{{ stats.totalSales }}</div>
            <div class="card-chart">
              <el-progress :percentage="stats.salesGrowth" :format="percentageFormat" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.totalOrders') }}</span>
            </div>
          </template>
          <div class="card-body">
            <div class="card-value">{{ stats.totalOrders }}</div>
            <div class="card-chart">
              <el-progress :percentage="stats.ordersGrowth" :format="percentageFormat" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.totalUsers') }}</span>
            </div>
          </template>
          <div class="card-body">
            <div class="card-value">{{ stats.totalUsers }}</div>
            <div class="card-chart">
              <el-progress :percentage="stats.usersGrowth" :format="percentageFormat" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.totalProducts') }}</span>
            </div>
          </template>
          <div class="card-body">
            <div class="card-value">{{ stats.totalProducts }}</div>
            <div class="card-chart">
              <el-progress :percentage="stats.productsGrowth" :format="percentageFormat" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.recentOrders') }}</span>
            </div>
          </template>
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="orderNo" :label="$t('order.orderNo')" width="180" />
            <el-table-column prop="amount" :label="$t('order.amount')" width="120">
              <template #default="scope">
                ¥{{ scope.row.amount }}
              </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('order.status')" width="120">
              <template #default="scope">
                <el-tag :type="getOrderStatusType(scope.row.status)">
                  {{ getOrderStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('order.createTime')" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.recentReviews') }}</span>
            </div>
          </template>
          <div v-for="review in recentReviews" :key="review.id" class="review-item">
            <el-avatar :size="32" :src="review.userAvatar">{{ review.username.charAt(0) }}</el-avatar>
            <div class="review-content">
              <div class="review-header">
                <span class="review-username">{{ review.username }}</span>
                <el-rate v-model="review.rating" disabled />
              </div>
              <div class="review-text">{{ review.content }}</div>
              <div class="review-time">{{ review.createTime }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOrderStats } from '@/api/order'

const { t } = useI18n()

const stats = ref({
  totalSales: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalProducts: 0,
  salesGrowth: 0,
  ordersGrowth: 0,
  usersGrowth: 0,
  productsGrowth: 0
})

const recentOrders = ref([])
const recentReviews = ref([])

const percentageFormat = (percentage) => {
  return percentage >= 0 ? `+${percentage}%` : `${percentage}%`
}

const getOrderStatusType = (status) => {
  const types = {
    pending: 'warning',
    paid: 'success',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'info'
  }
  return types[status] || 'info'
}

const getOrderStatusText = (status) => {
  return t(`order.status.${status}`)
}

const fetchData = async () => {
  try {
    // 模拟数据，实际项目中应该从API获取
    stats.value = {
      totalSales: 12580,
      totalOrders: 85,
      totalUsers: 256,
      totalProducts: 128,
      salesGrowth: 15.8,
      ordersGrowth: 8.5,
      usersGrowth: 12.3,
      productsGrowth: 5.6
    }

    recentOrders.value = [
      {
        orderNo: 'TCM20240223001',
        amount: 299,
        status: 'paid',
        createTime: '2024-02-23 10:25:36'
      },
      {
        orderNo: 'TCM20240223002',
        amount: 158,
        status: 'pending',
        createTime: '2024-02-23 11:30:15'
      }
    ]

    recentReviews.value = [
      {
        id: 1,
        username: '张三',
        userAvatar: '',
        rating: 5,
        content: '药材品质很好，包装也很严实，很满意！',
        createTime: '2024-02-23 09:15:23'
      },
      {
        id: 2,
        username: '李四',
        userAvatar: '',
        rating: 4,
        content: '发货速度快，服务态度好。',
        createTime: '2024-02-23 10:20:36'
      }
    ]
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-card {
  height: 180px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 40px);
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.mt-20 {
  margin-top: 20px;
}

.review-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.review-item:last-child {
  border-bottom: none;
}

.review-content {
  margin-left: 12px;
  flex: 1;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.review-username {
  margin-right: 12px;
  font-weight: bold;
}

.review-text {
  color: var(--el-text-color-regular);
  margin-bottom: 4px;
}

.review-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style> 