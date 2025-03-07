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
      config.headers['token'] = `Bearer ${token}`
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
    const { code, msg, data } = response.data

    if (code === 200) {
      return data
    }
    if (code === 1013 || code === 1014|| code === 1002) {
      ElMessage.error(msg || 'Error')
      localStorage.removeItem('token')
      router.push('/login')
      return
    }
    ElMessage.error(msg || 'Error')
    return Promise.reject(new Error(msg || 'Error'))
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