<template>
  <div class="profile-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('profile.title') }}</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 基本信息 -->
        <el-tab-pane :label="$t('profile.basicInfo')" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="100px"
            class="profile-form"
          >
            <el-form-item :label="$t('user.username')" prop="username">
              <el-input v-model="basicForm.username" disabled />
            </el-form-item>
            <el-form-item :label="$t('user.nickname')" prop="nickname">
              <el-input v-model="basicForm.nickname" />
            </el-form-item>
            <el-form-item :label="$t('user.email')" prop="email">
              <el-input v-model="basicForm.email" />
            </el-form-item>
            <el-form-item :label="$t('user.phone')" prop="phone">
              <el-input v-model="basicForm.phone" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateBasicInfo" :loading="submitting">
                {{ $t('common.save') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 修改密码 -->
        <el-tab-pane :label="$t('profile.changePassword')" name="password">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="140px"
            class="profile-form"
          >
            <el-form-item :label="$t('profile.oldPassword')" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item :label="$t('profile.newPassword')" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item :label="$t('profile.confirmPassword')" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatePassword" :loading="submitting">
                {{ $t('common.save') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { getAdminInfo, updateAdminPassword } from '@/api/user'

const { t } = useI18n()

// 表单相关
const activeTab = ref('basic')
const basicFormRef = ref(null)
const passwordFormRef = ref(null)
const submitting = ref(false)

const basicForm = ref({
  username: '',
  nickname: '',
  email: '',
  phone: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const basicRules = {
  nickname: [
    { required: true, message: t('validate.nicknameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: t('validate.nicknameLength'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('validate.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('validate.emailFormat'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: t('validate.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('validate.phoneFormat'), trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: t('validate.oldPasswordRequired'), trigger: 'blur' },
    { min: 6, max: 20, message: t('validate.passwordLength'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('validate.newPasswordRequired'), trigger: 'blur' },
    { min: 6, max: 20, message: t('validate.passwordLength'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('validate.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error(t('validate.passwordNotMatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 获取管理员信息
const fetchAdminInfo = async () => {
  try {
    const data = await getAdminInfo()
    basicForm.value = {
      username: data.username,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone
    }
  } catch (error) {
    console.error('Failed to fetch admin info:', error)
    ElMessage.error(t('message.fetchFailed'))
  }
}

// 更新基本信息
const updateBasicInfo = async () => {
  if (!basicFormRef.value) return

  await basicFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        // TODO: 实现更新基本信息的API
        ElMessage.success(t('message.updateSuccess'))
      } catch (error) {
        console.error('Failed to update basic info:', error)
        ElMessage.error(t('message.updateFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

// 更新密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await updateAdminPassword(passwordForm.value)
        ElMessage.success(t('message.updateSuccess'))
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        console.error('Failed to update password:', error)
        ElMessage.error(t('message.updateFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchAdminInfo()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-form {
  max-width: 500px;
  margin: 20px auto;
}
</style> 