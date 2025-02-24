<template>
  <div class="review-container">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item :label="$t('review.productName')">
            <el-input v-model="searchForm.productName" :placeholder="$t('common.search')" />
          </el-form-item>
          <el-form-item :label="$t('review.rating')">
            <el-select v-model="searchForm.rating" :placeholder="$t('common.all')">
              <el-option :label="$t('common.all')" value="" />
              <el-option
                v-for="i in 5"
                :key="i"
                :label="i"
                :value="i"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('review.status')">
            <el-select v-model="searchForm.status" :placeholder="$t('common.all')">
              <el-option :label="$t('common.all')" value="" />
              <el-option
                v-for="(label, value) in reviewStatus"
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

      <!-- 评价列表 -->
      <el-table :data="reviewList" v-loading="loading" style="width: 100%">
        <el-table-column prop="productName" :label="$t('review.productName')" min-width="200">
          <template #default="scope">
            <div class="product-info">
              <el-image 
                :src="scope.row.images[0]" 
                fit="cover"
                class="product-image"
              />
              <span>{{ scope.row.productName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rating" :label="$t('review.rating')" width="120">
          <template #default="scope">
            <el-rate
              v-model="scope.row.rating"
              disabled
              show-score
              text-color="#ff9900"
            />
          </template>
        </el-table-column>
        <el-table-column prop="content" :label="$t('review.content')" show-overflow-tooltip />
        <el-table-column prop="username" :label="$t('review.username')" width="120" />
        <el-table-column prop="status" :label="$t('review.status')" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ reviewStatus[scope.row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('review.createTime')" width="180" />
        <el-table-column :label="$t('common.operation')" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              size="small"
              @click="handleDetail(scope.row)"
            >{{ $t('common.detail') }}</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >{{ $t('common.delete') }}</el-button>
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

    <!-- 评价详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="$t('review.detail')"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('review.productName')">
          {{ currentReview.productName }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('merchant.name')">
          {{ currentReview.merchantName }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.username')">
          {{ currentReview.username }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.rating')">
          <el-rate
            v-model="currentReview.rating"
            disabled
            show-score
            text-color="#ff9900"
          />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.createTime')">
          {{ currentReview.createTime }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.status')">
          <el-tag :type="getStatusType(currentReview.status)">
            {{ reviewStatus[currentReview.status] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.content')" :span="2">
          {{ currentReview.content }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.images')" :span="2" v-if="currentReview.images?.length">
          <el-image
            v-for="(url, index) in currentReview.images"
            :key="index"
            :src="url"
            :preview-src-list="currentReview.images"
            fit="cover"
            class="review-image"
          />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.reply')" :span="2" v-if="currentReview.reply">
          {{ currentReview.reply }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="dialog-footer">
        <el-button @click="detailDialogVisible = false">{{ $t('common.close') }}</el-button>
        <el-button
          v-if="!currentReview.reply"
          type="primary"
          @click="handleReply"
        >{{ $t('review.reply') }}</el-button>
      </div>
    </el-dialog>

    <!-- 回复对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      :title="$t('review.reply')"
      width="500px"
    >
      <el-form
        ref="replyFormRef"
        :model="replyForm"
        :rules="replyRules"
      >
        <el-form-item :label="$t('review.replyContent')" prop="content">
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="4"
            :placeholder="$t('review.replyPlaceholder')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="replyDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="confirmReply" :loading="submitting">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getReviewList } from '@/api/mock'

const { t } = useI18n()

// 评价状态
const reviewStatus = {
  pending: t('review.pending'),
  replied: t('review.replied'),
  hidden: t('review.hidden')
}

// 列表相关
const loading = ref(false)
const reviewList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchForm = ref({
  productName: '',
  rating: '',
  status: ''
})

// 详情相关
const detailDialogVisible = ref(false)
const currentReview = ref({})

// 回复相关
const replyDialogVisible = ref(false)
const replyFormRef = ref(null)
const submitting = ref(false)
const replyForm = ref({
  content: ''
})

const replyRules = {
  content: [
    { required: true, message: t('validate.replyRequired'), trigger: 'blur' },
    { min: 5, max: 500, message: t('validate.replyLength'), trigger: 'blur' }
  ]
}

// 获取评价列表
const fetchReviews = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getReviewList()
    reviewList.value = list
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 获取状态样式
const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    replied: 'success',
    hidden: 'info'
  }
  return types[status] || 'info'
}

// 搜索相关方法
const handleSearch = () => {
  currentPage.value = 1
  fetchReviews()
}

const resetSearch = () => {
  searchForm.value = {
    productName: '',
    rating: '',
    status: ''
  }
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchReviews()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchReviews()
}

// 评价操作方法
const handleDetail = (row) => {
  currentReview.value = row
  detailDialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    t('review.confirmDelete'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await handleSuccess()
      ElMessage.success(t('message.deleteSuccess'))
      fetchReviews()
    } catch (error) {
      ElMessage.error(t('message.deleteFailed'))
    }
  })
}

const handleReply = () => {
  replyForm.value.content = ''
  replyDialogVisible.value = true
}

const confirmReply = async () => {
  if (!replyFormRef.value) return

  await replyFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await handleSuccess()
        ElMessage.success(t('message.replySuccess'))
        replyDialogVisible.value = false
        detailDialogVisible.value = false
        fetchReviews()
      } catch (error) {
        ElMessage.error(t('message.replyFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
.review-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

.review-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>