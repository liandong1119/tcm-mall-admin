<template>
  <div class="product-add">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('product.add') }}</span>
          <el-button @click="goBack">{{ $t('common.back') }}</el-button>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="product-form"
      >
        <el-form-item :label="$t('product.name')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item :label="$t('product.category')" prop="categoryId">
          <el-select v-model="form.categoryId" class="w-100">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('product.price')" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-100"
          />
        </el-form-item>

        <el-form-item :label="$t('product.stock')" prop="stock">
          <el-input-number
            v-model="form.stock"
            :min="0"
            :precision="0"
            :step="1"
            class="w-100"
          />
        </el-form-item>

        <el-form-item :label="$t('product.images')" prop="images">
          <el-upload
            v-model:file-list="fileList"
            :action="uploadUrl"
            :headers="uploadHeaders"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('product.description')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>

        <el-form-item :label="$t('product.status')" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            :active-text="$t('product.onSale')"
            :inactive-text="$t('product.offSale')"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            {{ $t('common.save') }}
          </el-button>
          <el-button @click="resetForm">{{ $t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { addProduct } from '@/api/product'
import { getCategoryList } from '@/api/category'

const { t } = useI18n()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const categories = ref([])
const fileList = ref([])

// 上传相关配置
const uploadUrl = import.meta.env.VITE_APP_UPLOAD_URL
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
}

const form = ref({
  name: '',
  categoryId: '',
  price: 0,
  stock: 0,
  images: [],
  description: '',
  status: 1
})

const rules = {
  name: [
    { required: true, message: t('validate.nameRequired'), trigger: 'blur' },
    { min: 2, max: 50, message: t('validate.nameLength'), trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: t('validate.categoryRequired'), trigger: 'change' }
  ],
  price: [
    { required: true, message: t('validate.priceRequired'), trigger: 'blur' }
  ],
  stock: [
    { required: true, message: t('validate.stockRequired'), trigger: 'blur' }
  ],
  images: [
    { required: true, message: t('validate.imagesRequired'), trigger: 'change' }
  ],
  description: [
    { required: true, message: t('validate.descriptionRequired'), trigger: 'blur' }
  ]
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const data = await getCategoryList()
    categories.value = data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// 上传相关方法
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error(t('validate.imageTypeError'))
    return false
  }
  if (!isLt2M) {
    ElMessage.error(t('validate.imageSizeError'))
    return false
  }
  return true
}

const handleUploadSuccess = (response, uploadFile) => {
  form.value.images.push(response.url)
}

const handleUploadError = () => {
  ElMessage.error(t('message.uploadFailed'))
}

// 表单提交
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await addProduct(form.value)
        ElMessage.success(t('message.saveSuccess'))
        router.push('/product')
      } catch (error) {
        console.error('Failed to add product:', error)
        ElMessage.error(t('message.saveFailed'))
      } finally {
        loading.value = false
      }
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  fileList.value = []
  form.value.images = []
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.product-add {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-form {
  max-width: 800px;
  margin: 0 auto;
}

.w-100 {
  width: 100%;
}

:deep(.el-upload--picture-card) {
  width: 150px;
  height: 150px;
  line-height: 150px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 150px;
  height: 150px;
}
</style> 