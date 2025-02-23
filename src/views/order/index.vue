<template>
  <div class="order-container">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item :label="$t('order.orderNo')">
            <el-input v-model="searchForm.orderNo" :placeholder="$t('common.search')" />
          </el-form-item>
          <el-form-item :label="$t('order.status')">
            <el-select v-model="searchForm.status" :placeholder="$t('common.all')">
              <el-option :label="$t('common.all')" value="" />
              <el-option
                v-for="(value, key) in orderStatus"
                :key="key"
                :label="$t(`order.status.${key}`)"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('common.search') }}</el-button>
            <el-button @click="resetSearch">{{ $t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 订单列表 -->
      <el-table :data="orderList" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNo" :label="$t('order.orderNo')" width="180" />
        <el-table-column prop="amount" :label="$t('order.amount')" width="120">
          <template #default="scope">
            ¥{{ scope.row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('order.status')" width="120">
          <template #default="scope">
            <el-tag :type="getOrderStatusType(scope.row.status)">
              {{ $t(`order.status.${scope.row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" :label="$t('order.customerName')" width="120" />
        <el-table-column prop="phone" :label="$t('order.phone')" width="120" />
        <el-table-column prop="createTime" :label="$t('order.createTime')" width="180" />
        <el-table-column :label="$t('product.operation')" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              size="small"
              @click="handleDetail(scope.row)"
            >{{ $t('order.detail') }}</el-button>
            <el-button
              v-if="scope.row.status === 'paid'"
              size="small"
              type="success"
              @click="handleShip(scope.row)"
            >{{ $t('order.ship') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 发货对话框 -->
    <el-dialog
      v-model="shipDialogVisible"
      :title="$t('order.shipTitle')"
      width="500px"
    >
      <el-form
        ref="shipFormRef"
        :model="shipForm"
        :rules="shipRules"
        label-width="100px"
      >
        <el-form-item :label="$t('order.trackingNo')" prop="trackingNo">
          <el-input v-model="shipForm.trackingNo" />
        </el-form-item>
        <el-form-item :label="$t('order.carrier')" prop="carrier">
          <el-select v-model="shipForm.carrier" class="w-100">
            <el-option
              v-for="item in carriers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shipDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="confirmShip" :loading="submitting">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, shipOrder } from '@/api/order'

const { t } = useI18n()
const router = useRouter()

// 订单状态
const orderStatus = {
  pending: 'warning',
  paid: 'success',
  shipped: 'primary',
  completed: 'success',
  cancelled: 'info'
}

// 快递公司列表
const carriers = [
  { label: '顺丰快递', value: 'SF' },
  { label: '中通快递', value: 'ZTO' },
  { label: '圆通快递', value: 'YTO' },
  { label: '韵达快递', value: 'YD' },
  { label: '申通快递', value: 'STO' }
]

// 列表相关
const loading = ref(false)
const orderList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchForm = ref({
  orderNo: '',
  status: ''
})

// 发货相关
const shipDialogVisible = ref(false)
const shipFormRef = ref(null)
const submitting = ref(false)
const currentOrder = ref(null)
const shipForm = ref({
  trackingNo: '',
  carrier: ''
})

const shipRules = {
  trackingNo: [
    { required: true, message: t('validate.trackingNoRequired'), trigger: 'blur' }
  ],
  carrier: [
    { required: true, message: t('validate.carrierRequired'), trigger: 'change' }
  ]
}

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getOrderList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    orderList.value = list
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 搜索相关方法
const handleSearch = () => {
  currentPage.value = 1
  fetchOrders()
}

const resetSearch = () => {
  searchForm.value = {
    orderNo: '',
    status: ''
  }
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchOrders()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchOrders()
}

// 订单操作方法
const getOrderStatusType = (status) => {
  return orderStatus[status] || 'info'
}

const handleDetail = (row) => {
  router.push(`/order/${row.id}`)
}

const handleShip = (row) => {
  currentOrder.value = row
  shipForm.value = {
    trackingNo: '',
    carrier: ''
  }
  shipDialogVisible.value = true
}

const confirmShip = async () => {
  if (!shipFormRef.value) return

  await shipFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await shipOrder(currentOrder.value.id, shipForm.value)
        ElMessage.success(t('message.shipSuccess'))
        shipDialogVisible.value = false
        fetchOrders()
      } catch (error) {
        console.error('Failed to ship order:', error)
        ElMessage.error(t('message.shipFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.w-100 {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>