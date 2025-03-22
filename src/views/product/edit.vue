<template>
    <div class="product-edit">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>{{ $t('product.edit') }}</span>
                    <el-button @click="goBack">{{ $t('common.back') }}</el-button>
                </div>
            </template>

            <el-form
                    v-loading="loading"
                    ref="formRef"
                    :model="form"
                    :rules="rules"
                    label-width="120px"
                    class="product-form"
            >
                <el-form-item :label="$t('product.name')" prop="name">
                    <el-input v-model="form.name"/>
                </el-form-item>

                <el-form-item :label="$t('product.category')" prop="categoryId">
                    <el-select v-model="form.categoryId" class="w-100" placeholder="未选择">
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

                <el-form-item :label="$t('product.img')" prop="img">
                    <el-upload
                        :limit="1"
                        :show-file-list="true"
                        v-model:file-list="imgList"
                        :action="uploadUrl"
                        :headers="uploadHeaders"
                        list-type="picture-card"
                        :on-success="handleCoverUploadSuccess"
                        :on-error="handleUploadError"
                        :before-upload="beforeUpload"
                        :on-remove="handleRemove"
                    >
                        <el-icon>
                            <Plus/>
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item :label="$t('product.images')" prop="photos">
                    <el-upload
                            v-model:file-list="fileList"
                            :action="uploadUrl"
                            :headers="uploadHeaders"
                            list-type="picture-card"
                            :on-success="handleUploadSuccess"
                            :on-error="handleUploadError"
                            :before-upload="beforeUpload"
                            :on-remove="handleRemove"
                    >
                        <el-icon>
                            <Plus/>
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item :label="$t('product.description')" prop="description">
                    <el-input
                            v-model="form.description"
                            type="textarea"
                            :rows="4"
                    />
                </el-form-item>

                <el-form-item :label="$t('product.brand')" prop="brand">
                    <el-input v-model="form.brand"/>
                </el-form-item>

                <el-form-item :label="$t('product.supplier')" prop="supplierId">
                    <el-select 
                        v-model="form.supplier"
                        filterable 
                        remote 
                        :remote-method="searchSuppliers"
                        :loading="suppliersLoading"
                        placeholder="请选择供应商"
                        class="w-100"
                    >
                        <el-option
                            v-for="item in supplierOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                        >
                            <div class="supplier-option">
                                <span>{{ item.name }}</span>
                                <small v-if="item.contactName">
                                    ({{ item.contactName }}: {{ item.contactPhone }})
                                </small>
                            </div>
                        </el-option>
                    </el-select>
                    <div class="supplier-actions">
                        <el-button link type="primary" @click="loadAllSuppliers">
                            加载全部供应商
                        </el-button>
                        <el-button link type="success" @click="addNewSupplier">
                            新增供应商
                        </el-button>
                    </div>
                </el-form-item>

<!--                <el-form-item :label="$t('product.supplier')" prop="supplier">-->
<!--                    <el-input v-model="form.supplier"/>-->
<!--                </el-form-item>-->

                <el-form-item :label="$t('product.origin')" prop="origin">
                    <el-input v-model="form.origin"/>
                </el-form-item>

                <!-- <el-form-item :label="$t('product.weight')" prop="weight">
                    <el-input v-model="form.weight"/>
                </el-form-item> -->

                <el-form-item :label="$t('product.efficacy')" prop="efficacy">
                    <el-input
                            v-model="form.efficacy"
                            type="textarea"
                            :rows="3"
                    />
                </el-form-item>

                <el-form-item :label="$t('product.precautions')" prop="precautions">
                    <el-input
                            v-model="form.precautions"
                            type="textarea"
                            :rows="3"
                    />
                </el-form-item>

                <!-- 规格管理 -->
                <el-divider content-position="left">{{ $t('product.specifications') }}</el-divider>
                <div class="specifications-container">
                    <div v-for="(spec, specIndex) in form.specifications" :key="specIndex" class="specification-item">
                        <div class="spec-header">
                            <el-form-item :label="$t('product.specName')">
                                <el-input v-model="spec.name" :placeholder="$t('product.specNamePlaceholder')"/>
                            </el-form-item>
                            <el-button type="danger" @click="removeSpec(specIndex)" icon="Delete" circle/>
                        </div>

                        <div class="spec-options">
                            <p class="options-title">{{ $t('product.specOptions') }}</p>
                            <div v-for="(option, optionIndex) in spec.options" :key="optionIndex" class="option-item">
                                <el-input v-model="option.text" :placeholder="$t('product.optionText')"/>
                                <el-input v-model="option.value" :placeholder="$t('product.optionValue')"/>
                                <el-input-number v-model="option.price_increment"
                                                 :placeholder="$t('product.priceIncrement')" :min="-1000" :max="1000"/>
                                <el-button type="danger" @click="removeOption(spec, optionIndex)" icon="Delete"
                                           circle/>
                            </div>
                            <el-button type="primary" @click="addOption(spec)" icon="Plus">
                                {{ $t('product.addOption') }}
                            </el-button>
                        </div>
                    </div>

                    <div class="spec-actions">
                        <el-button type="primary" @click="addSpec" icon="Plus">{{ $t('product.addSpec') }}</el-button>
                    </div>
                </div>

                <!-- SKU管理 -->
                <el-divider content-position="left">{{ $t('product.skuManagement') }}</el-divider>
                <div class="sku-container">
                    <div class="sku-actions">
                        <el-button type="primary" @click="generateSkus" icon="Refresh">{{
                            $t('product.generateSkus')
                            }}
                        </el-button>
                        <el-button type="success" @click="addSku" icon="Plus">{{ $t('product.addSku') }}</el-button>
                    </div>

                    <el-table :data="form.skus" border style="width: 100%">
                        <el-table-column :label="$t('product.skuId')" width="120">
                            <template #default="{ row }">
                                <el-input v-model="row.id" :placeholder="$t('product.skuIdPlaceholder')"/>
                            </template>
                        </el-table-column>

                        <el-table-column v-for="spec in form.specifications" :key="spec.name"
                                         :label="spec.name || $t('product.unnamed')" width="150">
                            <template #default="{ row }">
                                <el-select v-model="row.specs[spec.name]" :placeholder="$t('product.selectOption')">
                                    <el-option
                                            v-for="option in spec.options"
                                            :key="option.value"
                                            :label="option.text"
                                            :value="option.value"
                                    />
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('product.price')" width="120">
                            <template #default="{ row }">
                                <el-input-number v-model="row.price" :min="0" :precision="2"/>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('product.stock')" width="120">
                            <template #default="{ row }">
                                <el-input-number v-model="row.stock" :min="0" :precision="0"/>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('product.image')" width="200">
                            <template #default="{ row }">
                                <el-select v-model="row.image" :placeholder="$t('product.selectImage')">
                                    <!-- 添加主图作为选项 -->
                                    <el-option
                                            v-if="form.img"
                                            key="main-image"
                                            :label="$t('product.mainImage')"
                                            :value="form.img"
                                    >
                                        <div class="image-option">
                                            <el-image :src="form.img" style="width: 50px; height: 50px;" fit="cover"/>
                                            <span>{{ $t('product.mainImage') }}</span>
                                        </div>
                                    </el-option>
                                    <!-- 添加商品图片作为选项 -->
                                    <el-option
                                            v-for="(url, index) in form.images"
                                            :key="'product-image-' + index"
                                            :label="`${$t('product.image')} ${index + 1}`"
                                            :value="url"
                                    >
                                        <div class="image-option">
                                            <el-image :src="url" style="width: 50px; height: 50px;" fit="cover"/>
                                            <span>{{ $t('product.image') }} {{ index + 1 }}</span>
                                        </div>
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('common.actions')" width="100">
                            <template #default="{ $index }">
                                <el-button type="danger" @click="removeSku($index)" icon="Delete" circle/>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

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
                    <el-button type="primary" @click="submitForm" :loading="submitting">
                        {{ $t('common.save') }}
                    </el-button>
                    <el-button @click="resetForm">{{ $t('common.reset') }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {ElMessage} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import {getProductDetail, updateProduct} from '@/api/product'
import {getAllCategory, getCategoryList} from '@/api/category'
import {deletePhoto} from '@/api/photo'
import {getAllSuppliers, searchSuppliers as fetchSuppliers} from '@/api/supplier'

const {t} = useI18n()
const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)
const submitting = ref(false)
const categories = ref([])
const fileList = ref([])
// 商品的封面
const imgList = ref([])
const imageIndexMap = ref(new Map()) // 用于存储图片URL和索引的映射
const supplierOptions = ref([])
const suppliersLoading = ref(false)

// 上传相关配置
const uploadUrl = import.meta.env.VITE_APP_UPLOAD_URL
const uploadHeaders = {
    token: `Bearer ${localStorage.getItem('token')}`
}

const form = ref({
    img: '', // 商品的封面图,
    photos: '',
    name: '',
    categoryId: '',
    price: 0,
    stock: 0,
    description: '',
    brand: '',
    supplier: '',
    origin: '',
    weight: '',
    efficacy: '',
    precautions: '',
    status: 1,
    specifications: [],
    skus: [],
    images: [], // 存储图片URL列表，用于SKU选择
    photoIds: [], // 存储图片ID列表
    supplierId: '',
    supplierOptions: [],
    suppliersLoading: false
})

const rules = {
    name: [
        {required: true, message: t('validate.nameRequired'), trigger: 'blur'},
        {min: 2, max: 50, message: t('validate.nameLength'), trigger: 'blur'}
    ],
    categoryId: [
        {required: true, message: t('validate.categoryRequired'), trigger: 'change'}
    ],
    img: [
        {required: true, message: t('validate.imagesRequired'), trigger: 'change'}
    ],
    photos: [
        {required: true, message: t('validate.imagesRequired'), trigger: 'change'}
    ],
    description: [
        {required: true, message: t('validate.descriptionRequired'), trigger: 'blur'}
    ],
    supplierId: [
        {required: true, message: t('product.supplierRequired'), trigger: 'change'}
    ]
}

// 获取分类列表
const fetchCategories = async () => {
    try {
        const data = await getAllCategory()
        categories.value = data
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

// 获取商品详情
const fetchProductDetail = async () => {
    loading.value = true
    try {
        const data = await getProductDetail(route.params.id)
        
        // 处理规格数据
        if (data.specifications) {
            data.specifications = JSON.parse(data.specifications)
        } else {
            data.specifications = []
        }
        
        // 处理SKU数据
        if (data.skus && data.skus.length > 0) {
            data.skus.forEach(sku => {
                if (typeof sku.specs === 'string') {
                    sku.specs = JSON.parse(sku.specs)
                } else if (!sku.specs) {
                    sku.specs = {}
                }
            })
        } else {
            data.skus = []
        }

        // 填充到表单中
        form.value = {
            ...data,
            specifications: data.specifications,
            skus: data.skus
        }
        if (form.value.photoIds === undefined){
            form.value.photoIds = []
        }
        if (form.value.images === undefined){
            form.value.images = []
        }

        // 处理主图
        if (data.img) {
            imgList.value = [{
                uid: data.img,
                url: data.img,
                name: '主图'
            }]
        }


        // 处理商品图片
        if (data.photos && data.photoUrl && data.photoUrl.length > 0) {
            // 解析photos字段，获取图片ID列表
            const photoIds = data.photos.split(',').filter(id => id);

            form.value.photoIds = photoIds;
            
            // 创建图片ID和URL的映射
            const imageFiles = [];
            data.photoUrl.forEach((url, index) => {
                if (index < photoIds.length) {
                    imageFiles.push({
                        uid: photoIds[index], // 使用实际的图片ID
                        url: url,
                        name: `商品图片${index + 1}`
                    });
                }
            });
            
            fileList.value = imageFiles;
            
            // 存储图片URL列表用于SKU选择
            form.value.images = data.photoUrl;
        }

        // 如果没有规格但有基本信息，创建一个默认SKU
        if (form.value.skus.length === 0) {
            form.value.skus.push({
                id: `sku_default`,
                specs: {},
                price: form.value.price,
                stock: form.value.stock,
                image: form.value.img || ''
            });
        }
    } catch (error) {
        console.error('Failed to fetch product detail:', error);
        ElMessage.error(t('message.fetchFailed'));
    } finally {
        loading.value = false;
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

const handleCoverUploadSuccess = (response, uploadFile) => {
    // 处理回填
    uploadFile.fileId = response.data.id;
    form.value.img = response.data.addr;
    ElMessage.success(t('message.uploadSuccess'));
}

const handleUploadSuccess = (response, uploadFile) => {
    const {id: fileId, addr} = response.data;
    uploadFile.fileId = fileId;
    form.value.photoIds.push(fileId);
    form.value.images.push(addr);
    
    // 更新photos字段
    form.value.photos = form.value.photoIds.join(',') + ',';
    ElMessage.success(t('message.uploadSuccess'));
}

const handleUploadError = () => {
    ElMessage.error(t('message.uploadFailed'))
}

const handleRemove = async (file) => {
    // 确定要删除的图片ID
    const imageId = file.uid || file.fileId;
    console.log(imageId)
    
    try {
        // 调用删除图片API
        await deletePhoto([imageId]);
        
        if (file.url === form.value.img) {
            // 如果是主图
            form.value.img = '';
            imgList.value = [];
        } else {
            // 如果是商品图片
            // 从photoIds列表中移除
            form.value.photoIds = form.value.photoIds.filter(id => id !== imageId);
            // 更新photos字段
            form.value.photos = form.value.photoIds.join(',') + ',';
            
            // 找到图片在fileList中的索引
            const fileIndex = fileList.value.findIndex(item => item.uid === imageId);
            if (fileIndex !== -1) {
                // 从URL列表中移除对应的URL
                const imageURL = fileList.value[fileIndex].url;
                const urlIndex = form.value.images.indexOf(imageURL);
                if (urlIndex !== -1) {
                    form.value.images.splice(urlIndex, 1);
                }
            }
        }
        
        ElMessage.success(t('message.deleteSuccess'));
    } catch (error) {
        console.error('删除图片失败:', error);
        ElMessage.error(t('message.deleteFailed'));
    }
}

// 表单提交
const submitForm = async () => {
    if (!formRef.value) return

    console.log(form.value)
    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                // 处理规格和SKU数据
                const formData = {
                    ...form.value,
                    specifications: JSON.stringify(form.value.specifications.map(spec => ({
                        ...spec,
                        options: spec.options.map(option => ({
                            ...option,
                            price_increment: Number(option.price_increment) || 0
                        }))
                    }))),
                    // skus: form.value.skus.map(sku => ({
                    //     ...sku,
                    //     specs: JSON.stringify(sku.specs)
                    // }))
                    skus: form.value.skus.map(sku => ({
                        id: sku.id,
                        specs: JSON.stringify(sku.specs),
                        image: sku.image,
                        price: Number(sku.price),
                        stock: Number(sku.stock)
                    }))
                }

                await updateProduct(route.params.id, formData)
                ElMessage.success(t('message.saveSuccess'))
                router.push('/product')
            } catch (error) {
                console.error('Failed to update product:', error)
                ElMessage.error(t('message.saveFailed'))
            } finally {
                submitting.value = false
            }
        }
    })
}

const resetForm = () => {
    if (!formRef.value) return
    fetchProductDetail()
}

const goBack = () => {
    router.back()
}

// 规格管理相关方法
const addSpec = () => {
    form.value.specifications.push({
        name: '',
        options: []
    })
}

const removeSpec = (specIndex) => {
    form.value.specifications.splice(specIndex, 1)
    // 删除规格后，更新SKU数据
    form.value.skus.forEach(sku => {
        const specName = form.value.specifications[specIndex]?.name
        if (specName && sku.specs[specName]) {
            delete sku.specs[specName]
        }
    })
}

const addOption = (spec) => {
    spec.options.push({
        text: '',
        value: '',
        price_increment: 0,
        available: true
    })
}

const removeOption = (spec, index) => {
    spec.options.splice(index, 1)
}

// SKU管理相关方法
const addSku = () => {
    const newSku = {
        id: `sku_${Date.now()}`,
        specs: {},
        price: form.value.price,
        stock: form.value.stock,
        image: form.value.img || ''
    }

    // 为每个规格添加默认值
    form.value.specifications.forEach(spec => {
        if (spec.options.length > 0) {
            newSku.specs[spec.name] = spec.options[0].value
        }
    })

    form.value.skus.push(newSku)
}

const removeSku = (skuIndex) => {
    form.value.skus.splice(skuIndex, 1)
}

// 根据规格自动生成所有可能的SKU组合
const generateSkus = () => {
    // 确保有规格和选项
    if (form.value.specifications.length === 0) {
        ElMessage.warning(t('product.noSpecifications'))
        return
    }

    // 获取所有规格的选项
    const specOptions = {}
    form.value.specifications.forEach(spec => {
        if (spec.name && spec.options.length > 0) {
            specOptions[spec.name] = spec.options
                .filter(option => option.text && option.value)
                .map(option => option.value)
        }
    })

    // 生成所有可能的规格组合
    const generateCombinations = (specs, current = {}, keys = Object.keys(specs), index = 0) => {
        if (index >= keys.length) {
            return [current]
        }

        const key = keys[index]
        const results = []

        specs[key].forEach(value => {
            const newCurrent = {...current, [key]: value}
            results.push(...generateCombinations(specs, newCurrent, keys, index + 1))
        })

        return results
    }

    // 检查是否有足够的规格选项
    const validSpecs = Object.keys(specOptions).filter(key => specOptions[key].length > 0)
    if (validSpecs.length === 0) {
        ElMessage.warning(t('product.noValidOptions'))
        return
    }

    // 生成所有组合
    const combinations = generateCombinations(specOptions)

    // 创建SKU
    const basePrice = form.value.price
    const baseStock = form.value.stock
    const defaultImage = form.value.img || ''

    // 清空现有SKU
    form.value.skus = []

    // 添加新生成的SKU
    combinations.forEach((combination, index) => {
        // 计算价格增量
        let priceIncrement = 0
        Object.entries(combination).forEach(([specName, specValue]) => {
            const spec = form.value.specifications.find(s => s.name === specName)
            if (spec) {
                const option = spec.options.find(o => o.value === specValue)
                if (option) {
                    priceIncrement += Number(option.price_increment) || 0
                }
            }
        })

        form.value.skus.push({
            id: `sku_${index + 1}`,
            specs: combination,
            price: Math.max(0, basePrice + priceIncrement),
            stock: baseStock,
            image: defaultImage
        })
    })

    ElMessage.success(t('product.skusGenerated', {count: form.value.skus.length}))
}

// 加载所有供应商
const loadAllSuppliers = async () => {
    suppliersLoading.value = true
    try {
        const data = await getAllSuppliers()
        supplierOptions.value = data
    } catch (error) {
        console.error('Failed to load suppliers:', error)
        ElMessage.error(t('message.fetchFailed'))
    } finally {
        suppliersLoading.value = false
    }
}

// 搜索供应商
const searchSuppliers = async (query) => {
    if (query.length < 1) return
    suppliersLoading.value = true
    try {
        const data = await fetchSuppliers(query)
        supplierOptions.value = data
    } catch (error) {
        console.error('Failed to search suppliers:', error)
    } finally {
        suppliersLoading.value = false
    }
}

// 新增供应商
const addNewSupplier = () => {
    router.push('/supplier/add')
}

onMounted(async () => {
    await fetchCategories()
    await fetchProductDetail()
    loadAllSuppliers() // 加载供应商数据
})
</script>

<style scoped>
.product-edit {
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

.upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-uploader {
    width: 150px;
    height: 150px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.image-uploader:hover {
    border-color: #409eff;
}

.image-item {
    position: relative;
    width: 150px;
    height: 150px;
    margin-right: 10px;
    margin-bottom: 10px;
}

.image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
}

.image-item .delete-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #f56c6c;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
}

/* 规格管理样式 */
.specifications-container {
    margin-bottom: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 15px;
    background-color: #f8f9fa;
}

.specification-item {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
}

.spec-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.spec-header .el-form-item {
    flex: 1;
    margin-bottom: 0;
    margin-right: 10px;
}

.spec-options {
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
}

.options-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #606266;
}

.option-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
}

.option-item .el-input,
.option-item .el-input-number {
    margin-right: 10px;
}

.spec-actions {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}

/* SKU管理样式 */
.sku-container {
    margin-bottom: 20px;
}

.sku-actions {
    margin-bottom: 15px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.image-option {
    display: flex;
    align-items: center;
    gap: 10px;
}

.el-table {
    margin-bottom: 15px;
}
</style> 