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
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('common.search') }}</el-button>
            <el-button @click="resetSearch">{{ $t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 评价列表 -->
      <el-table :data="reviewList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="productName" :label="$t('review.productName')" width="200" />
        <el-table-column prop="rating" :label="$t('review.rating')" width="120">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="content" :label="$t('review.content')" show-overflow-tooltip />
        <el-table-column prop="username" :label="$t('review.username')" width="120" />
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
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('review.productName')">
          {{ currentReview.productName }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.rating')">
          <el-rate v-model="currentReview.rating" disabled />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.username')">
          {{ currentReview.username }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.createTime')">
          {{ currentReview.createTime }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('review.content')" :span="2">
          {{ currentReview.content }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentReview.images" :label="$t('review.images')" :span="2">
          <el-image
            v-for="(url, index) in currentReview.images"
            :key="index"
            :src="url"
            :preview-src-list="currentReview.images"
            class="review-image"
          />
        </el-descriptions-item>
        <el-descriptions-item v-if="currentReview.reply" :label="$t('review.reply')" :span="2">
          {{ currentReview.reply }}
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="!currentReview.reply" class="reply-form">
        <el-form :model="replyForm">
          <el-form-item :label="$t('review.reply')">
            <el-input
              v-model="replyForm.content"
              type="textarea"
              :rows="3"
              :placeholder="$t('review.replyPlaceholder')"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">{{ $t('common.close') }}</el-button>
          <el-button
            v-if="!currentReview.reply"
            type="primary"
            @click="handleReply"
            :loading="submitting"
          >
            {{ $t('review.submitReply') }}
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
import { getReviewList, replyReview, deleteReview } from '@/api/review'

const { t } = useI18n()

// 列表相关
const loading = ref(false)
const reviewList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchForm = ref({
  productName: '',
  rating: ''
})

// 详情相关
const detailDialogVisible = ref(false)
const currentReview = ref({})
const submitting = ref(false)
const replyForm = ref({
  content: ''
})

// 获取评价列表
const fetchReviews = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getReviewList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    reviewList.value = list
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 搜索相关方法
const handleSearch = () => {
  currentPage.value = 1
  fetchReviews()
}

const resetSearch = () => {
  searchForm.value = {
    productName: '',
    rating: ''
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
  replyForm.value.content = ''
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
      await deleteReview(row.id)
      ElMessage.success(t('message.deleteSuccess'))
      fetchReviews()
    } catch (error) {
      console.error('Failed to delete review:', error)
      ElMessage.error(t('message.deleteFailed'))
    }
  })
}

const handleReply = async () => {
  if (!replyForm.value.content) {
    ElMessage.warning(t('review.replyRequired'))
    return
  }

  submitting.value = true
  try {
    await replyReview({
      id: currentReview.value.id,
      reply: replyForm.value.content
    })
    ElMessage.success(t('message.replySuccess'))
    detailDialogVisible.value = false
    fetchReviews()
  } catch (error) {
    console.error('Failed to reply review:', error)
    ElMessage.error(t('message.replyFailed'))
  } finally {
    submitting.value = false
  }
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.review-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  object-fit: cover;
}

.reply-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-light);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>