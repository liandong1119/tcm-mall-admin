<template>
    <div class="order-list">
        <el-card>
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item :label="$t('order.orderNo')">
                    <el-input v-model="searchForm.orderNo" :placeholder="$t('common.search')"/>
                </el-form-item>
                <el-form-item :label="$t('order.status')">
                    <el-select v-model="searchForm.status" :placeholder="$t('common.all')">
                        <el-option
                            v-for="status in orderStatuses"
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

            <el-table :data="orderList" v-loading="loading" style="width: 100%">
                <el-table-column prop="orderCode" :label="$t('order.orderNo')" width="180"/>
                <el-table-column :label="$t('order.items')" min-width="300">
                    <template #default="scope">
                        <div class="order-item">
                            <el-image
                                    :src="scope.row.img"
                                    fit="cover"
                                    class="product-image"
                            />
                            <div class="item-info">
                                <div class="item-name">{{ scope.row.name }}</div>
                                <div class="item-price">¥{{ scope.row.price.toFixed(2) }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="price" :label="$t('order.amount')" width="120">
                    <template #default="scope">
                        ¥{{ scope.row.price.toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column prop="customerName" :label="$t('order.customer')" width="120"/>
                <el-table-column prop="status" :label="$t('order.status')" width="120">
                    <template #default="scope">
                        <el-tag :type="getOrderStatusType(scope.row.status)">
                            {{ $t(`order.statuses.${scope.row.status}`) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('order.createTime')" width="180"/>
                <el-table-column :label="$t('common.operation')" width="200" fixed="right">
                    <template #default="scope">
                        <el-button
                                size="small"
                                @click="handleDetail(scope.row)"
                        >{{ $t('common.detail') }}
                        </el-button>
                        <el-button
                                v-if="scope.row.status === 'paid'"
                                size="small"
                                type="success"
                                @click="handleShip(scope.row)"
                        >{{ $t('order.ship') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :total="total"
                        :page-sizes="[10, 20, 50, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {ElMessage, ElMessageBox} from 'element-plus'
import {getOrderList, shipOrder} from "@/api/order.js";

const {t} = useI18n()
const router = useRouter()

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const orderList = ref([])

const searchForm = ref({
    orderNo: '',
    status: ''
})

const getOrderStatusType = (status) => {
    const types = {
        pending: 'warning',
        paid: 'success',
        shipped: 'primary',
        completed: 'success',
        cancelled: 'info',
        refunding: 'warning',
        refunded: 'info',
        processing: 'warning'
    }
    return types[status] || 'info'
}

// 订单状态
const orderStatuses = [
    {value: 'all', label: t('common.all'),numVal: ''},
    {value: 'pending', label: t('order.statuses.pending'),numVal: 0},
    {value: 'paid', label: t('order.statuses.paid'),numVal: 1  },
    {value: 'shipped', label: t('order.statuses.shipped'),numVal: 2},
    {value: 'completed', label: t('order.statuses.completed'),numVal: 4},
    {value: 'cancelled', label: t('order.statuses.cancelled'),numVal: 5},
    {value: 'refunding', label: t('order.statuses.refunding'),numVal: 6},
    {value: 'refunded', label: t('order.statuses.refunded'),numVal: 7},
]


const statusMap = {
    0: "pending",
    1: "paid",
    2: "shipped",
    4: "completed",
    5: "cancelled",
    6: "refunding",
    7: "refunded",
    // 其他状态的映射
}


const fetchData = async () => {
    loading.value = true
    try {
        const pageRequest = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            orderCode: searchForm.value.orderNo,
            status: searchForm.value.status
        }
        console.log("分页参数：：",pageRequest)
        const {total: totalCount, list} = await getOrderList(pageRequest)
        list.forEach((order) => {
            order.status = statusMap[order.status]
        })
        orderList.value = list
        total.value = totalCount
    } catch (error) {
        console.error('Failed to fetch order list:', error)
        ElMessage.error(error.message)
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    currentPage.value = 1
    fetchData()
}

const resetSearch = () => {
    searchForm.value = {
        orderNo: '',
        status: ''
    }
    handleSearch()
}

const handleDetail = (row) => {
    router.push(`/order/${row.id}`)
}

const handleShip = (row) => {
    ElMessageBox.confirm(
        `${t('order.confirmShip')}: ${row.orderNo}`,
        t('common.warning'),
        {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning',
        }
    ).then(async () => {
        try {
            await shipOrder(row.id)
            ElMessage.success(t('order.shipSuccess'))
            fetchData()
        } catch (error) {
            ElMessage.error(error.message)
        }
    })
}

const handleSizeChange = (val) => {
    pageSize.value = val
    fetchData()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchData()
}

onMounted(() => {
    fetchData()
})
</script>

<style lang="scss" scoped>
// 调整el-select宽度
.el-select {
    --el-select-width: 150px !important;
}

.order-list {
    padding: 20px;
}

.search-form {
    margin-bottom: 20px;
}

.order-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 0;
}

.order-item:not(:last-child) {
    border-bottom: 1px solid #ebeef5;
}

.product-image {
    width: 50px;
    height: 50px;
    border-radius: 4px;
}

.item-info {
    flex: 1;
    min-width: 0;
}

.item-name {
    font-size: 14px;
    color: #303133;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-price {
    font-size: 13px;
    color: #f56c6c;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>