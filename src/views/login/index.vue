<template>
    <div class="login-container">
        <!-- 左侧海报 -->
        <div class="login-banner">
            <img src="@/assets/login-banner.svg" alt="Login Banner">
            <div class="banner-text">
                <h1 class="animate__animated animate__fadeInDown">{{ $t('login.systemTitle') }}</h1>
                <p class="animate__animated animate__fadeInUp animate__delay-1s">{{ $t('login.systemSubtitle') }}</p>
            </div>
        </div>

        <!-- 右侧登录表单 -->
        <div class="login-content">
            <div class="login-box animate__animated animate__fadeInRight">
                <div class="login-header">
                    <img src="@/assets/logo.svg" alt="Logo"
                         class="login-logo animate__animated animate__bounceIn animate__delay-1s">
                    <h2 class="login-title">{{ $t('login.title') }}</h2>
                </div>

                <!-- 登录表单 -->
                <el-form
                        ref="loginFormRef"
                        :model="loginForm"
                        :rules="loginRules"
                        class="login-form"
                        size="large"
                >
                    <el-form-item prop="username">
                        <el-input
                                v-model="loginForm.username"
                                :placeholder="$t('validate.usernameRequired')"
                                @keyup.enter="handleLogin"
                        >
                            <template #prefix>
                                <el-icon>
                                    <User/>
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input
                                v-model="loginForm.password"
                                type="password"
                                :placeholder="$t('validate.passwordRequired')"
                                show-password
                                @keyup.enter="handleLogin"
                        >
                            <template #prefix>
                                <el-icon>
                                    <Lock/>
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="verifyCode">
                        <div class="captcha-container">
                            <el-input
                                    v-model="loginForm.verifyCode"
                                    :placeholder="$t('login.verifyCode')"
                                    @keyup.enter="handleLogin"
                            >
                                <template #prefix>
                                    <el-icon>
                                        <Key/>
                                    </el-icon>
                                </template>
                            </el-input>
                            <img
                                    :src="captchaUrl"
                                    :alt="$t('login.captcha')"
                                    class="captcha-img"
                                    @click="refreshCaptcha"
                            >
                        </div>
                    </el-form-item>

                    <div class="form-operations">
                        <el-checkbox v-model="rememberMe">{{ $t('login.rememberMe') }}</el-checkbox>
                        <el-link type="primary" @click="forgotPassword">{{ $t('login.forgotPassword') }}</el-link>
                    </div>

                    <el-form-item>
                        <el-button
                                :loading="loading"
                                type="primary"
                                class="login-button"
                                @click="handleLogin"
                        >
                            <span>{{ $t('login.loginButton') }}</span>
                        </el-button>
                    </el-form-item>
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
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {User, Lock, Key, ArrowDown} from '@element-plus/icons-vue'
import {useI18n} from 'vue-i18n'
import {login} from '@/api/user'
import 'animate.css'
import {getPictureVerifyCode} from "@/api/login.js";

const {t, locale} = useI18n()
const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const currentLang = computed(() => locale.value)
const captchaUrl = ref('')
const rememberMe = ref(false)

const loginForm = ref({
    username: '',
    password: '',
    verifyCode: '',
    pictureUUID:'',
    verifyType:3,
})

const loginRules = {
    username: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
        {min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
        {min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur'}
    ],
    captcha: [
        {required: true, message: '请输入验证码', trigger: 'blur'},
        {len: 4, message: '验证码长度应为4位', trigger: 'blur'}
    ]
}
const handleLogin = () => {
    if (!loginFormRef.value) return

    loginFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                // 处理登录
                const loginData = {
                    account: loginForm.value.username,
                    password: loginForm.value.password,
                    chaptchaCode: loginForm.value.verifyCode,
                    pictureUUID: loginForm.value.pictureUUID,
                }
                const {userInfo:userInfo,token} =  await login(loginData)

                localStorage.setItem('token', token)
                localStorage.setItem('username', userInfo.username)
                if (rememberMe.value) {
                    localStorage.setItem('remember', 'true')
                    localStorage.setItem('savedUsername', loginForm.value.username)
                }
                ElMessage.success('登录成功')
                router.push('/')
            } catch (error) {
                console.error('Login failed:', error)
                ElMessage.error('登录失败')
                refreshCaptcha()
            } finally {
                loading.value = false
            }
        }
    })
}

const refreshCaptcha = async () => {
    const {code,imgUrl}  = await getPictureVerifyCode()
    captchaUrl.value = imgUrl
    loginForm.value.pictureUUID = code
}

const forgotPassword = () => {
    router.push('/seller/forgot-password')
}

const handleSetLanguage = (lang) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
}

// 检查是否记住密码
onMounted(() => {
    if (localStorage.getItem('remember') === 'true') {
        const savedUsername = localStorage.getItem('savedUsername')
        if (savedUsername) {
            loginForm.value.username = savedUsername
            rememberMe.value = true
        }
    }
    refreshCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  min-height: 600px;
  display: flex;
  background: linear-gradient(to right bottom, #EEF2F6, #E6E9F0);
  overflow: hidden;
}

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

.login-content {
  width: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5));
    z-index: 1;
  }
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .login-logo {
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .login-title {
    font-size: 28px;
    color: #1a1a1a;
    font-weight: 600;
    margin: 0;
    letter-spacing: 1px;
  }
}

.login-form {
  :deep(.el-input) {
    height: 44px;

    .el-input__wrapper {
      padding-left: 15px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:hover, &.is-focus {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .el-input__prefix {
      display: flex;
      align-items: center;
      color: #909399;
      font-size: 18px;
    }
  }

  .captcha-container {
    display: flex;
    gap: 12px;

    .el-input {
      flex: 1;
    }

    .captcha-img {
      width: 120px;
      height: 44px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .form-operations {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: -10px 0 20px;

    :deep(.el-checkbox__label) {
      color: #606266;
    }

    .el-link {
      font-size: 14px;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .login-button {
    width: 100%;
    height: 44px;
    font-size: 16px;
    letter-spacing: 4px;
    transition: all 0.3s ease;

    &:not(.is-loading):hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;

  .language-switch {
    cursor: pointer;
    color: #606266;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s ease;

    .el-icon {
      margin-left: 4px;
      font-size: 12px;
      transition: transform 0.3s ease;
    }

    &:hover {
      color: var(--el-color-primary);
      background: rgba(24, 144, 255, 0.1);

      .el-icon {
        transform: rotate(180deg);
      }
    }
  }
}

@media (max-width: 1200px) {
  .login-banner {
    min-width: 450px;
  }

  .login-content {
    width: 450px;
  }
}

@media (max-width: 992px) {
  .login-banner {
    display: none;
  }

  .login-content {
    width: 100%;

    &::before {
      display: none;
    }
  }

  .login-box {
    backdrop-filter: none;
    background: #fff;
  }
}

// 动画时长调整
.animate__animated {
  animation-duration: 0.8s;
}
</style>