import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import i18n from '@/i18n'

const { t } = i18n.global

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { code, message, data } = response.data

    if (code === 0) {
      return data
    }

    ElMessage.error(message || 'Error')
    return Promise.reject(new Error(message || 'Error'))
  },
  error => {
    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        ElMessage.error(t('message.sessionExpired'))
        localStorage.removeItem('token')
        router.push('/login')
      } else {
        ElMessage.error(error.response.data?.message || t('message.networkError'))
      }
    } else {
      ElMessage.error(t('message.networkError'))
    }

    return Promise.reject(error)
  }
)

export default service