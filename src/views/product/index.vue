<template>
  <div class="product-container">
    <el-card class="box-card">
      <!-- Search Bar -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item :label="$t('product.name')">
            <el-input v-model="searchForm.name" :placeholder="$t('common.search')" />
          </el-form-item>
          <el-form-item :label="$t('product.status')">
            <el-select v-model="searchForm.status" :placeholder="$t('common.search')">
              <el-option :label="$t('common.all')" value="" />
              <el-option :label="$t('product.onSale')" value="1" />
              <el-option :label="$t('product.offSale')" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('common.search') }}</el-button>
            <el-button @click="resetSearch">{{ $t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Operation Buttons -->
      <div class="operation-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          {{ $t('product.add') }}
        </el-button>
      </div>

      <!-- Product Table -->
      <el-table :data="productList" style="width: 100%" v-loading="loading">
        <!-- 左侧：商品名称和图片 -->
        <el-table-column width="400">
          <template #default="scope">
            <div class="product-info">
              <el-image
                class="product-image"
                :src="scope.row.images[0]"
                :preview-src-list="scope.row.images"
                fit="cover"
              />
              <div class="product-detail">
                <div class="product-name">{{ scope.row.name }}</div>
                <div class="product-price">{{ formatPrice(scope.row.price) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 右侧：编辑区域 -->
        <el-table-column>
          <template #default="scope">
            <div class="product-actions">
              <!-- 库存编辑 -->
              <div class="action-item">
                <span class="label">{{ $t('product.stock') }}:</span>
                <el-input-number 
                  v-model="scope.row.stock" 
                  :min="0" 
                  controls-position="right"
                  size="small"
                  @change="handleStockChange(scope.row)"
                />
              </div>

              <!-- 基本信息展示 -->
              <div class="action-item">
                <span class="label">{{ $t('product.origin') }}:</span>
                <span>{{ scope.row.origin }}</span>
              </div>
              <div class="action-item">
                <span class="label">{{ $t('product.supplier') }}:</span>
                <span>{{ scope.row.supplier }}</span>
              </div>

              <!-- 操作按钮 -->
              <div class="button-group">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="$t('product.onSale')"
                  :inactive-text="$t('product.offSale')"
                  @change="handleStatusChange(scope.row)"
                />
                <el-button 
                  size="small" 
                  type="primary"
                  @click="handleEdit(scope.row)"
                >{{ $t('common.edit') }}</el-button>
                <el-button 
                  size="small" 
                  type="danger"
                  @click="handleDelete(scope.row)"
                >{{ $t('common.delete') }}</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getProductList, updateProductStatus, updateProduct, deleteProduct } from '@/api/product'

const { t } = useI18n()
const router = useRouter()

// Search form
const searchForm = ref({
  name: '',
  status: ''
})

// Table data
const productList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// Methods
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
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
  fetchData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()
}

const handleAdd = () => {
  router.push('/product/add')
}

const handleEdit = (row) => {
  router.push(`/product/edit/${row.id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deleteProduct(row.id)
      ElMessage.success(t('message.deleteSuccess'))
      fetchData()
    } catch (error) {
      console.error('Failed to delete product:', error)
      ElMessage.error(t('message.deleteFailed'))
    }
  })
}

const handleStatusChange = async (row) => {
  try {
    await updateProductStatus(row.id, row.status)
    ElMessage.success(t('message.updateSuccess'))
  } catch (error) {
    console.error('Failed to update product status:', error)
    ElMessage.error(t('message.updateFailed'))
    row.status = row.status === 1 ? 0 : 1 // Revert on failure
  }
}

const handleStockChange = async (row) => {
  try {
    await updateProduct(row.id, { stock: row.stock })
    ElMessage.success(t('message.updateSuccess'))
  } catch (error) {
    console.error('Failed to update stock:', error)
    ElMessage.error(t('message.updateFailed'))
    fetchData() // Refresh data on failure
  }
}

const formatPrice = (price) => {
  return `¥${price.toFixed(2)}`
}

const fetchData = async () => {
  loading.value = true
  try {
    // 模拟数据
    const mockData = {
      list: [
        {
          id: 1,
          name: '太子参 (1斤装)',
          images: ['https://img.alicdn.com/imgextra/i4/2200726057983/O1CN01LKoRvw1TiKBJ5LDxe_!!2200726057983.jpg'],
          price: 128.00,
          stock: 500,
          origin: '广东省',
          supplier: '广州中药材有限公司',
          status: 1,
          effect: '益气养阴，补脾润肺',
          usage: '煎服，3-9克',
          precautions: '不宜与藜芦同用'
        },
        {
          id: 2,
          name: '西洋参 (500g装) 优质野山参片 花旗参片',
          images: ['https://img.alicdn.com/imgextra/i1/2200726057983/O1CN01KtQjcf1TiKBMF7Uxv_!!2200726057983.jpg'],
          price: 298.00,
          stock: 200,
          origin: '吉林省',
          supplier: '长白山药材基地',
          status: 1,
          effect: '补气养阴，清热生津',
          usage: '泡服或煎服，3-9克',
          precautions: '阴虚火旺者慎用'
        },
        {
          id: 3,
          name: '金银花 (500g装) 野生无硫',
          images: ['https://img.alicdn.com/imgextra/i2/2200726057983/O1CN01q5wOxf1TiKBLGK5Hs_!!2200726057983.jpg'],
          price: 76.00,
          stock: 0,
          origin: '河南省',
          supplier: '河南道地药材基地',
          status: 0,
          effect: '清热解毒，疏散风热',
          usage: '煎服，6-15克',
          precautions: '脾胃虚寒者慎用'
        },
        {
          id: 4,
          name: '当归 (250g装) 甘肃岷县',
          images: ['https://img.alicdn.com/imgextra/i3/2200726057983/O1CN01XYx0Tn1TiKBLGJyGL_!!2200726057983.jpg'],
          price: 58.00,
          stock: 300,
          origin: '甘肃省',
          supplier: '岷县道地药材基地',
          status: 1,
          effect: '补血活血，调经止痛',
          usage: '煎服，6-12克',
          precautions: '月经过多者慎用'
        }
      ],
      total: 4
    }

    productList.value = mockData.list
    total.value = mockData.total
  } catch (error) {
    console.error('Failed to fetch products:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);

  .box-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    
    :deep(.el-card__body) {
      padding: 24px;
    }
  }
}

.search-bar {
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  .el-form-item {
    margin-bottom: 0;
  }
}

.operation-bar {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-button {
    padding: 12px 24px;
    font-weight: 500;
    
    .el-icon {
      margin-right: 8px;
    }
  }
}

.pagination-container {
  margin-top: 24px;
  padding-top: 24px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;

  .product-image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  .product-detail {
    flex: 1;
    min-width: 0;

    .product-name {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 12px;
      @include text-ellipsis;
      max-width: 240px;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .product-price {
      font-size: 18px;
      color: #f56c6c;
      font-weight: 600;
    }
  }
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;

  .action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;

    .label {
      width: 80px;
      color: #606266;
      font-size: 14px;
      font-weight: 500;
    }

    span:not(.label) {
      color: #1a1a1a;
      font-size: 14px;
    }
  }

  .button-group {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 12px;
    padding-top: 16px;
    border-top: 1px dashed #ebeef5;

    .el-switch {
      margin-right: auto;
    }

    .el-button {
      padding: 8px 16px;
      font-size: 13px;
    }
  }
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  
  .el-table__header-wrapper {
    th {
      background-color: #f5f7fa;
      font-weight: 600;
    }
  }

  .el-input-number {
    width: 130px;
  }

  .el-table__row {
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}

:deep(.el-pagination) {
  .el-pagination__total,
  .el-pagination__sizes {
    margin-right: 16px;
  }
}

:deep(.el-input),
:deep(.el-select) {
  width: 220px;
}

:deep(.el-switch) {
  --el-switch-on-color: #67c23a;
}
</style>