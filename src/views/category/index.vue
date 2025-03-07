<template>
  <div class="category-container">
    <el-card class="box-card">
      <!-- 操作按钮 -->
      <div class="operation-bar">
        <el-button type="primary" @click="handleAdd">{{ $t('common.add') }}</el-button>
      </div>

      <!-- 分类列表 -->
      <el-table :data="categoryList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" :label="$t('category.name')" width="200" />
        <el-table-column prop="description" :label="$t('category.description')" show-overflow-tooltip />
        <el-table-column prop="sort" :label="$t('category.sort')" width="100" />
        <el-table-column prop="createTime" :label="$t('category.createTime')" width="180" />
        <el-table-column :label="$t('common.operation')" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              size="small"
              @click="handleEdit(scope.row)"
            >{{ $t('common.edit') }}</el-button>
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

    <!-- 分类编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('category.edit') : $t('category.add')"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="$t('category.name')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('category.description')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item :label="$t('category.sort')" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
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
import { getCategoryList, addCategory, updateCategory, deleteCategory } from '@/api/category'

const { t } = useI18n()

// 列表相关
const loading = ref(false)
const categoryList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表单相关
const dialogVisible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const submitting = ref(false)
const form = ref({
  name: '',
  description: '',
  sort: 0
})

const rules = {
  name: [
    { required: true, message: t('validate.categoryNameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: t('validate.categoryNameLength'), trigger: 'blur' }
  ],
  description: [
    { required: true, message: t('validate.categoryDescriptionRequired'), trigger: 'blur' }
  ],
  sort: [
    { required: true, message: t('validate.categorySortRequired'), trigger: 'blur' }
  ]
}

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getCategoryList({
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })

    categoryList.value = list
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 分页相关方法
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchCategories()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchCategories()
}

// 分类操作方法
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  form.value = {
    name: '',
    description: '',
    sort: 0
  }
}

const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    t('category.confirmDelete'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteCategory(row.id)
      ElMessage.success(t('message.deleteSuccess'))
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      ElMessage.error(t('message.deleteFailed'))
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (isEdit.value) {
          await updateCategory(form.value.id, form.value)
        } else {
          await addCategory(form.value)
        }
        ElMessage.success(t('message.saveSuccess'))
        dialogVisible.value = false
        fetchCategories()
      } catch (error) {
        console.error('Failed to save category:', error)
        ElMessage.error(t('message.saveFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-container {
  padding: 20px;
}

.operation-bar {
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