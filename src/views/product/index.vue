<template>
    <div class="product-list">
        <el-card>
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item :label="$t('product.name')">
                    <el-input v-model="searchForm.name" :placeholder="$t('common.search')"/>
                </el-form-item>
                <el-form-item :label="$t('product.category')">
                    <el-select v-model="searchForm.category" :placeholder="$t('common.all')">
                        <el-option :label="$t('common.all')" value=""/>
                        <el-option
                                v-for="category in categories"
                                :key="category.id"
                                :label="category.name"
                                :value="category.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('product.status')">
                    <el-select v-model="searchForm.status" :placeholder="$t('common.all')">
                        <el-option :label="$t('common.all')" value=""/>
                        <el-option :label="$t('common.enabled')" :value="1"/>
                        <el-option :label="$t('common.disabled')" :value="0"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">{{ $t('common.search') }}</el-button>
                    <el-button @click="resetSearch">{{ $t('common.reset') }}</el-button>
                    <el-button type="success" @click="handleAdd">{{ $t('product.add') }}</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="productList" v-loading="loading" style="width: 100%">
                <el-table-column type="selection" width="55"/>
                <el-table-column prop="name" :label="$t('product.name')" min-width="200">
                    <template #default="scope">
                        <div class="product-info">
                            <el-image
                                    :src="scope.row.img"
                                    fit="cover"
                                    class="product-image"
                            />
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('product.category')" width="120">
                    <template #default="scope">
                        {{ categories.length > 0 && (categories.find(item => item.id === scope.row.categoryId)).name}}
                    </template>
                </el-table-column>

                <el-table-column prop="price" :label="$t('product.price')" width="120">
                    <template #default="scope">
                        ¥{{ scope.row.price.toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column prop="stock" :label="$t('product.stock')" width="120">
                    <template #default="scope">
                        <el-tag :type="scope.row.stock < 10 ? 'danger' : 'success'" effect="plain">
                            {{ scope.row.stock }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('product.status')" width="100">
                    <template #default="scope">
                        <el-switch
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="0"
                                @change="handleStatusChange(scope.row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('common.createTime')" width="180"/>
                <el-table-column :label="$t('common.operation')" width="200" fixed="right">
                    <template #default="scope">
                        <el-button
                                size="small"
                                @click="handleEdit(scope.row)"
                        >{{ $t('common.edit') }}
                        </el-button>
                        <el-button
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.row)"
                        >{{ $t('common.delete') }}
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
import {getProductList, updateProductStatus} from "@/api/product.js";
import {getAllCategory} from "@/api/category.js";
// import {getProductList} from "@/api/mock.js";
// import { getProductList, getCategoryList } from '@/api/mock'

const {t} = useI18n()
const router = useRouter()

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const productList = ref([])
const categories = ref([])

const searchForm = ref({
    name: '',
    category: '',
    status: ''
})

const fetchData = async () => {
    loading.value = true
    try {
        const pageParam = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            status: searchForm.value.status,
            categoryId: searchForm.value.category,
            name: searchForm.value.name
        }
        const {total: totalCount, list} = await getProductList(pageParam);
        productList.value = list
        total.value = totalCount
    } catch (error) {
        console.error('Failed to fetch product list:', error)
        ElMessage.error(error.message)
    } finally {
        loading.value = false
    }
}

const fetchCategories = async () => {
    try {
        categories.value = await getAllCategory()
        const name = categories.value.find(item => item.id === 1)
        console.log(name)
        console.log(name.name)
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const handleSearch = () => {
    currentPage.value = 1
    fetchData()
}

const resetSearch = () => {
    searchForm.value = {
        name: '',
        category: '',
        status: ''
    }
    handleSearch()
}

const handleAdd = () => {
    router.push('/product/add')
}

const handleEdit = (row) => {
    router.push(`/product/edit/${row.id}`)
}

const handleDelete = (row) => {
    ElMessageBox.confirm(
        `${t('common.deleteConfirm')}: ${row.name}`,
        t('common.warning'),
        {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning',
        }
    ).then(async () => {
        try {
            await handleSuccess()
            ElMessage.success(t('common.deleteSuccess'))
            fetchData()
        } catch (error) {
            ElMessage.error(error.message)
        }
    })
}

const handleStatusChange = async (row) => {
    try {
        console.log("状态。。。。。。。。。。。。。",row)
        console.log(row.status)
        await updateProductStatus(row.id,row.status)
        ElMessage.success(t('common.updateSuccess'))
    } catch (error) {
        console.log(error)
        row.status = row.status === 1 ? 0 : 1
        ElMessage.error(error.message)
    }
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
    fetchCategories()
})
</script>

<style lang="scss" scoped>

// 调整el-select宽度
.el-select {
    --el-select-width: 150px !important;
}

@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-list {
  padding: 20px;
}

.search-form {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>