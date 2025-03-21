<template>
    <div class="forgot-password-container">
        <div class="forgot-password-box">
            <div class="login-banner">
                <img src="@/assets/login-banner.svg" alt="Login Banner">
                <div class="banner-text">
                    <h1 class="animate__animated animate__fadeInDown">{{ $t('login.systemTitle') }}</h1>
                    <p class="animate__animated animate__fadeInUp animate__delay-1s">{{ $t('login.systemSubtitle') }}</p>
                </div>
            </div>
            <!-- 右侧重置密码表单 -->
            <div class="form-section">
                <div class="form-header">
                    <div class="logo">
                        <img src="@/assets/logo.svg" alt="TCM Mall">
                        <span>{{ $t('common.systemName') }}</span>
                    </div>
                    <h2>{{ $t('findPassword.resetPassword') }}</h2>
                    <p>{{ $t('findPassword.resetPasswordTip') }}</p>
                </div>

                <el-form
                        ref="formRef"
                        :model="form"
                        :rules="rules"
                        class="reset-form"
                        @submit.prevent="handleSubmit"
                >
                    <el-form-item prop="email">
                        <el-input
                                v-model="form.email"
                                :placeholder="$t('findPassword.emailPlaceholder')"
                                prefix-icon="Message"
                        />
                    </el-form-item>

                    <el-form-item prop="verificationCode">
                        <div class="verification-container">
                            <el-input
                                    v-model="form.verificationCode"
                                    :placeholder="$t('findPassword.verificationCodePlaceholder')"
                                    prefix-icon="Key"
                            />
                            <el-button
                                    :disabled="countdown > 0"
                                    @click="handleSendCode"
                            >
                                {{ countdown > 0 ? `${countdown}s` : $t('findPassword.sendCode') }}
                            </el-button>
                        </div>
                    </el-form-item>

                    <el-form-item prop="newPassword">
                        <el-input
                                v-model="form.newPassword"
                                type="password"
                                :placeholder="$t('findPassword.newPasswordPlaceholder')"
                                prefix-icon="Lock"
                                show-password
                        />
                    </el-form-item>

                    <el-form-item prop="confirmPassword">
                        <el-input
                                v-model="form.confirmPassword"
                                type="password"
                                :placeholder="$t('findPassword.confirmPasswordPlaceholder')"
                                prefix-icon="Lock"
                                show-password
                        />
                    </el-form-item>

                    <el-form-item>
                        <el-button
                                type="primary"
                                :loading="loading"
                                class="submit-btn"
                                @click="handleSubmit"
                        >
                            {{ $t('findPassword.resetPassword') }}
                        </el-button>
                    </el-form-item>

                    <div class="form-footer">
                        <router-link to="/user/login">
                            {{ $t('findPassword.backToLogin') }}
                        </router-link>
                    </div>
                </el-form>

                <!-- 底部语言切换 -->
                <div class="login-footer">
                    <el-dropdown trigger="click" @command="handleSetLanguage">
            <span class="language-switch">
              {{ currentLang === 'zh' ? '中文' : 'English' }}
              <el-icon class="el-icon--right"><arrow-down/></el-icon>
            </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="zh">中文</el-dropdown-item>
                                <el-dropdown-item command="en">English</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'
import {useRouter} from 'vue-router'

import {ElMessage} from 'element-plus'
import {resetPassword, sendEmailCode} from "@/api/user";
import {useI18n} from "vue-i18n";
import {ArrowDown} from "@element-plus/icons-vue";
const {t,locale} = useI18n()
const router = useRouter()

const formRef = ref(null)
const loading = ref(false)
const countdown = ref(0)
const currentLang = computed(() => locale.value)

const form = reactive({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
})

const rules = {
    email: [
        {required: true, message: () => t('validate.emailRequired'), trigger: 'blur'},
        {type: 'email', message: () => t('validate.emailInvalid'), trigger: 'blur'}
    ],
    verificationCode: [
        {required: true, message: () => t('validate.verificationCodeRequired'), trigger: 'blur'},
        {len: 6, message: () => t('validate.verificationCodeLength'), trigger: 'blur'}
    ],
    newPassword: [
        {required: true, message: () => t('validate.passwordRequired'), trigger: 'blur'},
        {min: 6, max: 20, message: () => t('validate.passwordLength'), trigger: 'blur'}
    ],
    confirmPassword: [
        {required: true, message: () => t('validate.confirmPasswordRequired'), trigger: 'blur'},
        {
            validator: (rule, value, callback) => {
                if (value !== form.newPassword) {
                    callback(new Error(t('validate.passwordNotMatch')))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}
const handleSetLanguage = (lang) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
}

// 发送验证码后倒计时操作
const startCountdown = () => {
    countdown.value = 60
    const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
        }
    }, 1000)
}

// 发送邮箱验证码
const handleSendCode = async () => {
    try {
        await formRef.value.validateField('email')
        await sendEmailCode(form.email)
        ElMessage.success(t('message.verificationCodeSent'))
        startCountdown()
    } catch (error) {
        console.error('Send verification code failed:', error)
    }
}

const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        loading.value = true
        const findPasswordForm = {
            email: form.email,
            code: form.verificationCode,
            newPwd: form.newPassword,
        }
        await resetPassword(findPasswordForm)

        ElMessage.success(t('message.resetPasswordSuccess'))
        router.push('/user/login')
    } catch (error) {
        console.error('Reset password failed:', error)
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>



.login-banner {
    position: relative;
    flex: 1;
    min-width: 550px;
    background: #001529;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(0, 21, 41, 0.1) 100%);
        z-index: 1;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .banner-text {
        position: absolute;
        text-align: center;
        color: #fff;
        z-index: 2;

        h1 {
            font-size: 48px;
            font-weight: 600;
            margin-bottom: 16px;
            letter-spacing: 2px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        p {
            font-size: 24px;
            opacity: 0.8;
            letter-spacing: 1px;
        }
    }
}

.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 0;
}

.forgot-password-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #fff;
  overflow: hidden;
}

.banner-section {
  flex: 1;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;

    h2 {
      font-size: 32px;
      margin-bottom: 16px;
    }

    p {
      font-size: 16px;
      opacity: 0.8;
    }
  }
}

.form-section {
  width: 480px;
  padding: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;

  .form-header {
    text-align: center;
    margin-bottom: 40px;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;

      img {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }

      span {
        font-size: 24px;
        color: var(--el-color-primary);
        font-weight: bold;
      }
    }

    h2 {
      font-size: 28px;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }

    p {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }

  .reset-form {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;

    .verification-container {
      display: flex;
      gap: 12px;

      .el-input {
        flex: 1;
      }

      .el-button {
        width: 120px;
      }
    }

    .submit-btn {
      width: 100%;
      height: 44px;
      font-size: 16px;
    }

    .form-footer {
      margin-top: 24px;
      text-align: center;

      a {
        color: var(--el-color-primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .lang-switch {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}

@media (max-width: 768px) {
  .forgot-password-box {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .banner-section {
    display: none;
  }

  .form-section {
    width: 100%;
    padding: 20px;
    min-height: 100vh;
  }
}
</style> 