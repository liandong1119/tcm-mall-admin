<template>
  <div class="order-detail">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('order.detail') }}</span>
          <el-button @click="goBack">{{ $t('common.back') }}</el-button>
        </div>
      </template>

      <div v-loading="loading">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="$t('order.orderNo')">
            {{ orderDetail.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.status')">
            <el-tag :type="getOrderStatusType(orderDetail.status)">
              {{ $t(`order.status.${orderDetail.status}`) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.amount')">
            ¥{{ orderDetail.amount?.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.createTime')">
            {{ orderDetail.createTime }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.customerName')">
            {{ orderDetail.customerName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.phone')">
            {{ orderDetail.phone }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.address')" :span="2">
            {{ orderDetail.address }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 商品列表 -->
        <div class="section-title">{{ $t('order.items') }}</div>
        <el-table :data="orderDetail.items" border style="width: 100%">
          <el-table-column prop="productName" :label="$t('product.name')" />
          <el-table-column prop="price" :label="$t('product.price')" width="120">
            <template #default="scope">
              ¥{{ scope.row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('order.quantity')" width="120" />
          <el-table-column :label="$t('order.subtotal')" width="120">
            <template #default="scope">
              ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 物流信息 -->
        <template v-if="orderDetail.status === 'shipped' || orderDetail.status === 'completed'">
          <div class="section-title">{{ $t('order.shipping') }}</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="$t('order.carrier')">
              {{ getCarrierLabel(orderDetail.shipping?.carrier) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.trackingNo')">
              {{ orderDetail.shipping?.trackingNo }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.shipTime')">
              {{ orderDetail.shipping?.shipTime }}
            </el-descriptions-item>
          </el-descriptions>
        </template>

        <!-- 操作按钮 -->
        <div class="operation-bar">
          <el-button
            v-if="orderDetail.status === 'paid'"
            type="primary"
            @click="handleShip"
          >{{ $t('order.ship') }}</el-button>
        </div>
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
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { getOrderDetail, shipOrder } from '@/api/order'

const { t } = useI18n()
const route = useRoute()
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
  { label: t('order.carrier.sf'), value: 'SF' },
  { label: t('order.carrier.zto'), value: 'ZTO' },
  { label: t('order.carrier.yto'), value: 'YTO' },
  { label: t('order.carrier.yd'), value: 'YD' },
  { label: t('order.carrier.sto'), value: 'STO' }
]

// 页面数据
const loading = ref(false)
const orderDetail = ref({})

// 发货相关
const shipDialogVisible = ref(false)
const shipFormRef = ref(null)
const submitting = ref(false)
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

// 获取订单详情
const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const data = await getOrderDetail(route.params.id)
    orderDetail.value = data
  } catch (error) {
    console.error('Failed to fetch order detail:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 获取订单状态样式
const getOrderStatusType = (status) => {
  return orderStatus[status] || 'info'
}

// 获取快递公司名称
const getCarrierLabel = (value) => {
  const carrier = carriers.find(item => item.value === value)
  return carrier ? carrier.label : value
}

// 发货处理
const handleShip = () => {
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
        await shipOrder(orderDetail.value.id, shipForm.value)
        ElMessage.success(t('message.shipSuccess'))
        shipDialogVisible.value = false
        fetchOrderDetail()
      } catch (error) {
        console.error('Failed to ship order:', error)
        ElMessage.error(t('message.shipFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0;
  color: var(--el-text-color-primary);
}

.operation-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
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