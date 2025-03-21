<template>
  <div class="merchant-container">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item :label="$t('supplier.name')">
            <el-input v-model="searchForm.name" :placeholder="$t('common.search')" />
          </el-form-item>
          <el-form-item :label="$t('supplier.status')">
            <el-select v-model="searchForm.status" :placeholder="$t('common.all')">
              <el-option :label="$t('common.all')" value="" />
              <el-option
                v-for="(label, value) in supplierStatus"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('common.search') }}</el-button>
            <el-button @click="resetSearch">{{ $t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 商家列表 -->
      <el-table :data="supplierList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" :label="$t('supplier.name')" width="200" />
        <el-table-column prop="contact" :label="$t('supplier.contact')" width="120" />
        <el-table-column prop="phone" :label="$t('supplier.phone')" width="150" />
        <el-table-column prop="addr" :label="$t('supplier.address')" show-overflow-tooltip />
        <el-table-column prop="status" :label="$t('supplier.status')" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ supplierStatus[scope.row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('merchant.createTime')" width="180" />
        <el-table-column :label="$t('common.operation')" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              size="small"
              @click="handleDetail(scope.row)"
            >{{ $t('common.detail') }}</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDisable(scope.row)"
              v-if="scope.row.status === 1"
            >{{ $t('merchant.disable') }}</el-button>
            <el-button
              size="small"
              type="success"
              @click="handleEnable(scope.row)"
              v-else
            >{{ $t('merchant.enable') }}</el-button>
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

    <!-- 商家详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="$t('merchant.detail')"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('merchant.name')">
          {{ currentMerchant.name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('merchant.contact')">
          {{ currentMerchant.contact }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('merchant.phone')">
          {{ currentMerchant.phone }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('merchant.email')">
          {{ currentMerchant.email }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('merchant.status')">
          <el-tag :type="currentMerchant.status === 1 ? 'success' : 'info'">
            {{ supplierStatus[currentMerchant.status] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('merchant.createTime')">
          {{ currentMerchant.createTime }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('merchant.address')" :span="2">
          {{ currentMerchant.address }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('merchant.description')" :span="2">
          {{ currentMerchant.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSupplierList, updateMerchantStatus } from '@/api/supplier.js'

const { t } = useI18n()

// 商家状态
const supplierStatus = {
  0: t('supplier.disabled'),
  1: t('supplier.enabled')
}

// 列表相关
const loading = ref(false)
const supplierList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchForm = ref({
  name: '',
  status: ''
})

// 详情相关
const detailDialogVisible = ref(false)
const currentMerchant = ref({})

// 获取供应商列表
const fetchSupplierList = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getSupplierList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    supplierList.value = list
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch merchants:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 搜索相关方法
const handleSearch = () => {
  currentPage.value = 1
  fetchSupplierList()
}

const resetSearch = () => {
  searchForm.value = {
    name: '',
    status: ''
  }
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchSupplierList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchSupplierList()
}

// 商家操作方法
const handleDetail = (row) => {
  currentMerchant.value = row
  detailDialogVisible.value = true
}

const handleDisable = (row) => {
  ElMessageBox.confirm(
    t('merchant.confirmDisable'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await updateMerchantStatus(row.id, 0)
      ElMessage.success(t('message.updateSuccess'))
      fetchSupplierList()
    } catch (error) {
      console.error('Failed to disable merchant:', error)
      ElMessage.error(t('message.updateFailed'))
    }
  })
}

const handleEnable = (row) => {
  ElMessageBox.confirm(
    t('merchant.confirmEnable'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await updateMerchantStatus(row.id, 1)
      ElMessage.success(t('message.updateSuccess'))
      fetchSupplierList()
    } catch (error) {
      console.error('Failed to enable merchant:', error)
      ElMessage.error(t('message.updateFailed'))
    }
  })
}

onMounted(() => {
  fetchSupplierList()
})
</script>

<style scoped>
.merchant-container {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 