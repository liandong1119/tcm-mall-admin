<template>
  <div class="supplier-list">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('supplier.list') }}</span>
          <el-button type="primary" @click="handleAddSupplier">{{ $t('supplier.add') }}</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item :label="$t('supplier.name')">
            <el-input v-model="searchForm.name" :placeholder="$t('supplier.searchName')" />
          </el-form-item>
          <el-form-item  :label="$t('supplier.statusName')">
            <el-select style="width: 150px;" v-model="searchForm.status" clearable :placeholder="$t('common.pleaseSelect')">
              <el-option :label="$t('supplier.status.active')" :value="1" />
              <el-option :label="$t('supplier.status.inactive')" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('common.search') }}</el-button>
            <el-button @click="resetSearch">{{ $t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="supplierList" border style="width: 100%">
        <!-- <el-table-column prop="id" label="ID" width="80" /> -->
        <el-table-column prop="name" :label="$t('supplier.name')" />
        <el-table-column prop="contactName" :label="$t('supplier.contactName')" />
        <el-table-column prop="contactPhone" :label="$t('supplier.contactPhone')" />
        <el-table-column prop="contactEmail" :label="$t('supplier.contactEmail')" />
        <el-table-column prop="address" :label="$t('supplier.address')" show-overflow-tooltip />
        <el-table-column :label="$t('supplier.statusName')" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? $t('supplier.status.active') : $t('supplier.status.inactive') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              {{ $t('common.edit') }}
            </el-button>
            <el-popconfirm :title="$t('supplier.confirmDelete')" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger" size="small">{{ $t('common.delete') }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('supplier.edit') : $t('supplier.add')"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item :label="$t('supplier.name')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('supplier.contactName')" prop="contactName">
          <el-input v-model="form.contactName" />
        </el-form-item>
        <el-form-item :label="$t('supplier.contactPhone')" prop="contactPhone">
          <el-input v-model="form.contactPhone" />
        </el-form-item>
        <el-form-item :label="$t('supplier.contactEmail')" prop="contactEmail">
          <el-input v-model="form.contactEmail" />
        </el-form-item>
        <el-form-item :label="$t('supplier.address')" prop="address">
          <el-input v-model="form.address" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item :label="$t('supplier.description')" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item :label="$t('supplier.status')" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            :active-text="$t('supplier.status.active')"
            :inactive-text="$t('supplier.status.inactive')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ $t('common.save') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { getSupplierList, addSupplier, updateSupplier, deleteSupplier } from '@/api/supplier'

const { t } = useI18n()

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const supplierList = ref([])

// 对话框数据
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  name: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  address: '',
  description: '',
  status: 1
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: t('validate.nameRequired'), trigger: 'blur' },
    { min: 2, max: 50, message: t('validate.nameLength'), trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: t('supplier.validate.contactNameRequired'), trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: t('supplier.validate.contactPhoneRequired'), trigger: 'blur' }
  ],
  contactEmail: [
    { required: true, message: t('supplier.validate.contactEmailRequired'), trigger: 'blur' },
    { type: 'email', message: t('validate.emailFormat'), trigger: 'blur' }
  ]
}

// 获取供应商列表
const fetchSuppliers = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    }
    const { data, total: totalCount } = await getSupplierList(params)
    supplierList.value = data
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch suppliers:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchSuppliers()
}

// 处理每页显示数量变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchSuppliers()
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchSuppliers()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  currentPage.value = 1
  fetchSuppliers()
}

// 添加供应商
const handleAddSupplier = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑供应商
const handleEdit = (row) => {
  resetForm()
  isEdit.value = true
  Object.keys(form).forEach(key => {
    if (key in row) {
      form[key] = row[key]
    }
  })
  dialogVisible.value = true
}

// 删除供应商
const handleDelete = async (id) => {
  try {
    await deleteSupplier(id)
    ElMessage.success(t('message.deleteSuccess'))
    if (supplierList.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    fetchSuppliers()
  } catch (error) {
    console.error('Failed to delete supplier:', error)
    ElMessage.error(t('message.deleteFailed'))
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.keys(form).forEach(key => {
    if (key === 'status') {
      form[key] = 1
    } else {
      form[key] = ''
    }
  })
  form.id = null
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (isEdit.value) {
          await updateSupplier(form.id, form)
          ElMessage.success(t('message.updateSuccess'))
        } else {
          await addSupplier(form)
          ElMessage.success(t('message.saveSuccess'))
        }
        dialogVisible.value = false
        fetchSuppliers()
      } catch (error) {
        console.error('Failed to save supplier:', error)
        ElMessage.error(isEdit.value ? t('message.updateFailed') : t('message.saveFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchSuppliers()
})
</script>

<style scoped>
.supplier-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.supplier-option {
  display: flex;
  flex-direction: column;
}

.supplier-option small {
  color: #999;
  font-size: 12px;
}

.supplier-actions {
  margin-top: 5px;
  display: flex;
  gap: 10px;
}
</style> 