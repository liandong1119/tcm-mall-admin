<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.todaySales') }}</span>
              <el-tag type="success" effect="plain">
                +{{ data.salesTrend || 0 }}%
              </el-tag>
            </div>
          </template>
          <div class="card-value">¥{{ (data.todaySales || 0).toFixed(2) }}</div>
          <div class="card-footer">
            <div>{{ $t('dashboard.weeklyGrowth') }}: +{{ data.weeklyGrowth || 0 }}%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.todayOrders') }}</span>
            </div>
          </template>
          <div class="card-value">{{ data.todayOrders || 0 }}</div>
          <div class="card-footer">
            <div>{{ $t('dashboard.avgOrderAmount') }}: ¥{{ (data.averageOrderAmount || 0).toFixed(2) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.totalStock') }}</span>
            </div>
          </template>
          <div class="card-value">{{ data.totalStock || 0 }}</div>
          <div class="card-footer">
            <div class="warning-text">{{ $t('dashboard.lowStock') }}: {{ data.lowStockCount || 0 }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.pendingOrders') }}</span>
            </div>
          </template>
          <div class="card-value">{{ data.pendingOrders || 0 }}</div>
          <div class="card-footer">
            <div>{{ $t('dashboard.todayDelivered') }}: {{ data.todayDelivered || 0 }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.salesTrend') }}</span>
              <div class="chart-actions">
                <el-radio-group v-model="timeRange" size="small">
                  <el-radio-button label="week">{{ $t('dashboard.lastWeek') }}</el-radio-button>
                  <el-radio-button label="month">{{ $t('dashboard.lastMonth') }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <v-chart :option="salesChartOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.categorySales') }}</span>
            </div>
          </template>
          <v-chart :option="categoryChartOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 热销商品和订单状态 -->
    <el-row :gutter="20" class="data-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.hotProducts') }}</span>
            </div>
          </template>
          <el-table :data="data.hotProducts" stripe style="width: 100%">
            <el-table-column prop="name" :label="$t('product.name')" min-width="200" />
            <el-table-column prop="price" :label="$t('product.price')" width="120">
              <template #default="scope">
                ¥{{ scope.row.price.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="sales" :label="$t('product.sales')" width="120" />
            <el-table-column prop="stock" :label="$t('product.stock')" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.stock < 10 ? 'danger' : 'success'" effect="plain">
                  {{ scope.row.stock }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.orderStats') }}</span>
            </div>
          </template>
          <v-chart :option="orderChartOption" autoresize />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getDashboardData } from '@/api/mock'

const { t } = useI18n()
const data = ref({
  todaySales: 0,
  salesTrend: 0,
  todayOrders: 0,
  totalStock: 0,
  lowStockCount: 0,
  pendingOrders: 0,
  todayDelivered: 0,
  weeklyGrowth: 0,
  monthlyGrowth: 0,
  averageOrderAmount: 0,
  salesData: [],
  categoryData: [],
  orderStats: {},
  hotProducts: []
})
const timeRange = ref('week')

// 获取仪表盘数据
const fetchData = async () => {
  try {
    const response = await getDashboardData()
    // 使用解构赋值并提供默认值
    data.value = {
      todaySales: 0,
      salesTrend: 0,
      todayOrders: 0,
      totalStock: 0,
      lowStockCount: 0,
      pendingOrders: 0,
      todayDelivered: 0,
      weeklyGrowth: 0,
      monthlyGrowth: 0,
      averageOrderAmount: 0,
      salesData: [],
      categoryData: [],
      orderStats: {},
      hotProducts: [],
      ...response
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

// 销售趋势图表配置
const salesChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: data.value.salesData?.slice(-7).map(item => item.date) || [],
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: [
    {
      type: 'value',
      name: t('dashboard.amount'),
      position: 'left'
    },
    {
      type: 'value',
      name: t('dashboard.orders'),
      position: 'right'
    }
  ],
  series: [
    {
      name: t('dashboard.amount'),
      type: 'bar',
      data: data.value.salesData?.slice(-7).map(item => item.amount) || []
    },
    {
      name: t('dashboard.orders'),
      type: 'line',
      yAxisIndex: 1,
      data: data.value.salesData?.slice(-7).map(item => item.orders) || []
    }
  ]
}))

// 品类销售占比图表配置
const categoryChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center'
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        }
      },
      data: data.value.categoryData || []
    }
  ]
}))

// 订单状态图表配置
const orderChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center'
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [
        { value: data.value.orderStats?.pending || 0, name: t('order.status.pending') },
        { value: data.value.orderStats?.processing || 0, name: t('order.status.processing') },
        { value: data.value.orderStats?.shipped || 0, name: t('order.status.shipped') },
        { value: data.value.orderStats?.completed || 0, name: t('order.status.completed') },
        { value: data.value.orderStats?.refunding || 0, name: t('order.status.refunding') }
      ]
    }
  ]
}))

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;

  .stat-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--el-text-color-primary);
      margin: 10px 0;
    }

    .card-footer {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    .warning-text {
      color: var(--el-color-danger);
    }
  }

  .chart-row {
    margin-top: 20px;

    .chart-actions {
      display: flex;
      align-items: center;
    }

    :deep(.el-card__body) {
      height: 350px;
    }
  }

  .data-row {
    margin-top: 20px;

    :deep(.el-card__body) {
      height: 400px;
      overflow: auto;
    }
  }

  :deep(.echarts) {
    width: 100%;
    height: 100%;
  }
}
</style> 