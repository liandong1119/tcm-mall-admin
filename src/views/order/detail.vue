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
            {{ orderDetail.orderCode }}
          </el-descriptions-item>
<!--          <el-descriptions-item :label="$t('order.status')">
            <el-tag :type="getOrderStatusType(orderDetail.status)">
              {{ $t(`order.statuses.${orderDetail.status}`) }}
            </el-tag>
          </el-descriptions-item>-->
          <el-descriptions-item :label="$t('order.amount')">
            ¥{{ orderDetail.totalAmount?.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.createTime')">
            {{ orderDetail.createTime }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.customerName')">
            {{ orderDetail.receipt }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.phone')">
            {{ orderDetail.contactDetailInfo }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.address')" :span="2">
            {{ orderDetail.addr }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 商品列表 -->
        <div class="section-title">{{ $t('order.items') }}</div>
        <el-table :data="orderDetail.orderProductVoList" border style="width: 100%">
          <el-table-column prop="name" :label="$t('product.name')" />
          <el-table-column prop="price" :label="$t('product.price')" width="120">
            <template #default="scope">
              ¥{{ scope.row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="num" :label="$t('order.quantity')" width="120" />
          <el-table-column :label="$t('order.subtotal')" width="120">
            <template #default="scope">
              ¥{{ (scope.row.price * scope.row.num).toFixed(2) }}
            </template>
          </el-table-column>
            <el-table-column :label="$t('order.status')">
                <template #default="scope">
                    <el-tag :type="getOrderStatusType(scope.row.status)">
                        {{ $t(`order.statuses.${scope.row.status}`) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('order.operation')">
                <template #default="scope">
                    <el-button
                        v-if="scope.row.status === 'paid'"
                        type="primary"
                        @click="handleShip(scope.row)"
                    >{{ $t('order.ship') }}</el-button>
                    <el-button v-else type="info" disabled="true">
                        无
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 物流信息 -->
<!--        <template v-if="orderDetail.status === 'shipped' || orderDetail.status === 'completed'">
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

        &lt;!&ndash; 操作按钮 &ndash;&gt;
        <div class="operation-bar">
          <el-button
            v-if="orderDetail.status === 'paid'"
            type="primary"
            @click="handleShip"
          >{{ $t('order.ship') }}</el-button>
        </div>-->
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
import {ElMessage, ElMessageBox} from 'element-plus'
import { getOrderDetail, shipOrder } from '@/api/order'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const deliverOrderId = ref(undefined)

// 订单状态
const orderStatus = {
  pending: 'warning',
  paid: 'success',
  shipped: 'primary',
  completed: 'success',
  cancelled: 'info'
}

const handleShip = (row) => {
    ElMessageBox.confirm(
        `${t('order.confirmShip')}: ${orderDetail.value.orderCode}`,
        t('common.warning'),
        {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning',
        }
    ).then(async () => {
        try {
            await shipOrder(row.orderId)
            ElMessage.success(t('order.shipSuccess'))
            fetchOrderDetail()
        } catch (error) {
            ElMessage.error(error.message)
        }
    })
}


const determineOrderStatus = (products) => {
    console.log("列表为：：： ",products)
    if (!products || products.length === 0) {
        return 'pending'
    }

    // 状态优先级: cancelled > refunded > refunding > completed > shipped > paid > pending
    const statusPriority = {
        'cancelled': 7,
        'refunded': 6,
        'refunding': 5,
        'completed': 4,
        'shipped': 2,
        'paid': 1,
        'pending': 0
    }

    // 数字状态映射到字符串
    const statusMap = {
        0: "pending",
        1: "paid",
        2: "shipped",
        4: "completed",
        5: "cancelled",
        6: "refunding",
        7: "refunded"
    }

    // 获取所有商品的状态
    const statuses = products.map(item => item.status = (statusMap[item.status] || 'pending'))

    // 按优先级排序，取最高优先级的状态
    return statuses.sort((a, b) => statusPriority[b] - statusPriority[a])[0]
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

    const data = await getOrderDetail({orderCode:route.params.orderCode})
      determineOrderStatus(data.orderProductVoList)
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
/*const handleShip = (id) => {
  deliverOrderId.value = id
  shipDialogVisible.value = true
}*/

const confirmShip = async (id) => {
    submitting.value = true
    try {
        await shipOrder(id, shipForm.value)
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