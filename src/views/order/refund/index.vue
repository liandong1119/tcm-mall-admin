<template>
    <div class="refund-container">
        <el-card class="box-card">
            <!-- 搜索区域 -->
            <div class="search-bar">
                <el-form :inline="true" :model="searchForm">
                    <el-form-item :label="$t('order.orderNo')">
                        <el-input v-model="searchForm.orderNo" :placeholder="$t('common.search')"/>
                    </el-form-item>
                    <el-form-item :label="$t('refund.status')">
                        <el-select v-model="searchForm.status" :placeholder="$t('common.all')">
                            <el-option :label="$t('common.all')" value=""/>
                            <el-option
                                    v-for="status in refundStatus"
                                    :key="status.numVal"
                                    :label="status.label"
                                    :value="status.numVal"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">{{ $t('common.search') }}</el-button>
                        <el-button @click="resetSearch">{{ $t('common.reset') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 退款列表 -->
            <el-table :data="refundList" v-loading="loading" style="width: 100%">
                <el-table-column prop="orderCode" :label="$t('order.orderNo')" width="180"/>
                <el-table-column prop="orderAmount" :label="$t('refund.amount')" width="120">
                    <template #default="scope">
                        ¥{{ scope.row.orderAmount.toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column prop="reason" :label="$t('refund.reason')" show-overflow-tooltip/>
                <el-table-column prop="status" :label="$t('refund.status')" width="100">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            {{ $t(`refund.${scope.row.status}`) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('refund.createTime')" width="180"/>
                <el-table-column :label="$t('common.operation')" width="200" fixed="right">
                    <template #default="scope">
                        <el-button
                                size="small"
                                @click="handleDetail(scope.row)"
                        >{{ $t('common.detail') }}
                        </el-button>
                        <el-button
                                v-if="scope.row.status === 'pending'"
                                size="small"
                                type="success"
                                @click="handleApprove(scope.row)"
                        >{{ $t('refund.approve') }}
                        </el-button>
                        <el-button
                                v-if="scope.row.status === 'pending'"
                                size="small"
                                type="danger"
                                @click="handleReject(scope.row)"
                        >{{ $t('refund.reject') }}
                        </el-button>
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

        <!-- 退款详情对话框 -->
        <el-dialog
                v-model="detailDialogVisible"
                :title="$t('refund.detail')"
                width="700px"
        >
            <el-descriptions :column="2" border>
                <el-descriptions-item :label="$t('order.orderNo')">
                    {{ currentRefund.orderCode }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('refund.amount')">
                    ¥{{ currentRefund.orderAmount?.toFixed(2) }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.name')">
                    {{ currentRefund.productName }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('refund.status')">
                    <el-tag :type="getStatusType(currentRefund.status)">
                        {{ $t(`refund.${currentRefund.status}`) }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item :label="$t('refund.createTime')">
                    {{ currentRefund.createTime }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('refund.handleTime')" v-if="currentRefund.handleTime">
                    {{ currentRefund.handleTime }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('refund.reason')" :span="2">
                    {{ currentRefund.reason }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('refund.description')" :span="2">
                    {{ currentRefund.description }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('refund.evidence')" :span="2">
                    <el-image
                            v-for="(url, index) in currentRefund.evidence"
                            :key="index"
                            :src="url"
                            :preview-src-list="currentRefund.evidence"
                            fit="cover"
                            class="evidence-image"
                    />
                </el-descriptions-item>
                <el-descriptions-item :label="$t('refund.rejectReason')" :span="2" v-if="currentRefund.rejectReason">
                    {{ currentRefund.rejectReason }}
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>

        <!-- 拒绝退款对话框 -->
        <el-dialog
                v-model="rejectDialogVisible"
                :title="$t('refund.reject')"
                width="500px"
        >
            <el-form
                    ref="rejectFormRef"
                    :model="rejectForm"
                    :rules="rejectRules"
            >
                <el-form-item :label="$t('refund.rejectReason')" prop="reason">
                    <el-input
                            v-model="rejectForm.reason"
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('refund.rejectReasonPlaceholder')"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="confirmReject" :loading="submitting">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {ElMessage, ElMessageBox} from 'element-plus'
import {getRefundList, handleRefund, rejectRefund} from "@/api/refund.js";

const {t} = useI18n()

// 订单状态
const refundStatus = [
    {value: 'pending', label: t('refund.pending'),numVal: 0},
    {value: 'approved', label: t('refund.approved'),numVal: 1  },
    {value: 'rejected', label: t('refund.rejected'),numVal: 2},
    {value: 'completed', label: t('refund.completed'),numVal: 3}
]
// 列表相关
const loading = ref(false)
const refundList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchForm = ref({
    orderNo: '',
    status: ''
})

// 详情相关
const detailDialogVisible = ref(false)
const currentRefund = ref({})

// 拒绝相关
const rejectDialogVisible = ref(false)
const rejectFormRef = ref(null)
const submitting = ref(false)
const rejectForm = ref({
    reason: ''
})

const rejectRules = {
    reason: [
        {required: true, message: t('validate.rejectReasonRequired'), trigger: 'blur'},
        {min: 5, max: 200, message: t('validate.rejectReasonLength'), trigger: 'blur'}
    ]
}

const statusMap = {
    0: "pending",
    1: "approved",
    2: "rejected",
    3: "completed"
    // 其他状态的映射
}
// 获取退款列表
const fetchRefunds = async () => {
    loading.value = true
    try {
        const pageRequest = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            orderCode: searchForm.value.orderNo,
            status: searchForm.value.status
        }
        const {list, total: totalCount} = await getRefundList(pageRequest)
         list.forEach((order) => {
            order.status = statusMap[order.status]
        })
        refundList.value = list
        total.value = totalCount
    } catch (error) {
        console.error('Failed to fetch refunds:', error)
        ElMessage.error(t('message.fetchFailed'))
    } finally {
        loading.value = false
    }
}

// 获取状态样式
const getStatusType = (status) => {
    const types = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
        completed: 'info'
    }
    return types[status] || 'info'
}

// 搜索相关方法
const handleSearch = () => {
    currentPage.value = 1
    fetchRefunds()
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
    fetchRefunds()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchRefunds()
}

// 退款操作方法
const handleDetail = (row) => {
    currentRefund.value = row
    detailDialogVisible.value = true
}

const handleApprove = (orderRefund) => {
    ElMessageBox.confirm(
        t('refund.confirmApprove'),
        t('common.warning'),
        {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
        }
    ).then(async () => {
        try {
            const refundRequest = {
                refundId: orderRefund.id,
                goodsId: orderRefund.productId,
                orderCode: orderRefund.orderCode
            }
            await handleRefund(refundRequest)
            ElMessage.success(t('message.approveSuccess'))
            fetchRefunds()
        } catch (error) {
            ElMessage.error(t('message.approveFailed'))
        }
    })
}

const handleReject = (row) => {
    currentRefund.value = row
    rejectForm.value.reason = ''
    rejectDialogVisible.value = true
}

const confirmReject = async () => {
    if (!rejectFormRef.value) return

    await rejectFormRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                // TODO 处理退款操作
                const refundRequest = {
                    refundId: currentRefund.value.id,
                    refuseReason: rejectForm.value.reason,
                    goodsId: currentRefund.value.productId,
                    orderCode: currentRefund.value.orderCode
                }
                await rejectRefund(refundRequest);
                ElMessage.success(t('message.rejectSuccess'))
                rejectDialogVisible.value = false
                fetchRefunds()
            } catch (error) {
                ElMessage.error(t('message.rejectFailed'))
            } finally {
                submitting.value = false
            }
        }
    })
}

onMounted(() => {
    fetchRefunds()
})
</script>

<style lang="scss" scoped >

//调整el-select宽度
.el-select {
    --el-select-width: 150px !important;
}

.refund-container {
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

.evidence-image {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    border-radius: 4px;
    cursor: pointer;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style> 