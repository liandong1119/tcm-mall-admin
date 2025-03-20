<template>
  <div class="user-container">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item :label="$t('user.username')">
            <el-input v-model="searchForm.username" :placeholder="$t('common.search')" />
          </el-form-item>
          <el-form-item :label="$t('user.status')">
            <el-select v-model="searchForm.status" :placeholder="$t('common.all')">
              <el-option :label="$t('common.all')" value="" />
              <el-option
                v-for="(label, value) in userStatus"
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

      <!-- 用户列表 -->
      <el-table :data="userList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="account" :label="$t('user.username')" width="150" />
        <el-table-column prop="nickname" :label="$t('user.nickname')" width="150" />
        <el-table-column prop="phone" :label="$t('user.phone')" width="150" />
        <el-table-column prop="email" :label="$t('user.email')" width="200" />
        <el-table-column prop="status" :label="$t('user.status')" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ userStatus[scope.row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('user.createTime')" width="180" />
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
            >{{ $t('user.disable') }}</el-button>
            <el-button
              size="small"
              type="success"
              @click="handleEnable(scope.row)"
              v-else
            >{{ $t('user.enable') }}</el-button>
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

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="$t('user.detail')"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('user.username')">
          {{ currentUser.account }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.nickname')">
          {{ currentUser.nickname }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.phone')">
          {{ currentUser.phone }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.email')">
          {{ currentUser.email }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.status')">
          <el-tag :type="currentUser.status === 1 ? 'success' : 'info'">
            {{ userStatus[currentUser.status] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.createTime')">
          {{ currentUser.createTime }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.lastLoginTime')" :span="2">
          {{ currentUser.lastLoginTime }}
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">{{ $t('common.close') }}</el-button>
          <el-button type="primary" @click="handleResetPassword">
            {{ $t('user.resetPassword') }}
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
import { getUserList, updateUserStatus, resetUserPassword } from '@/api/user'

const { t } = useI18n()

// 用户状态
const userStatus = {
  0: t('user.disabled'),
  1: t('user.enabled')
}

// 列表相关
const loading = ref(false)
const userList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchForm = ref({
  username: '',
  status: ''
})

// 详情相关
const detailDialogVisible = ref(false)
const currentUser = ref({})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getUserList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    userList.value = list
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch users:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 搜索相关方法
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const resetSearch = () => {
  searchForm.value = {
    username: '',
    status: ''
  }
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUsers()
}

// 用户操作方法
const handleDetail = (row) => {
  currentUser.value = row
  detailDialogVisible.value = true
}

const handleDisable = (row) => {
  ElMessageBox.confirm(
    t('user.confirmDisable'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await updateUserStatus(row.id, 0)
      ElMessage.success(t('message.updateSuccess'))
      fetchUsers()
    } catch (error) {
      console.error('Failed to disable user:', error)
      ElMessage.error(t('message.updateFailed'))
    }
  })
}

const handleEnable = (row) => {
  ElMessageBox.confirm(
    t('user.confirmEnable'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await updateUserStatus(row.id, 1)
      ElMessage.success(t('message.updateSuccess'))
      fetchUsers()
    } catch (error) {
      console.error('Failed to enable user:', error)
      ElMessage.error(t('message.updateFailed'))
    }
  })
}

const handleResetPassword = () => {
  ElMessageBox.confirm(
    t('user.confirmResetPassword'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await resetUserPassword(currentUser.value.id)
      ElMessage.success(t('message.resetSuccess'))
    } catch (error) {
      console.error('Failed to reset password:', error)
      ElMessage.error(t('message.resetFailed'))
    }
  })
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss" scoped>


.el-select {
    --el-select-width: 150px !important;
}
.user-container {
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