import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '../../api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),

  actions: {
    // 登录
    async login(loginData) {
      try {
        const token = await login(loginData)
        this.token = token
        localStorage.setItem('token', token)
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 获取用户信息
    async getInfo() {
      try {
        const userInfo = await getUserInfo()
        this.userInfo = userInfo
        return Promise.resolve(userInfo)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 退出登录
    async logout() {
      try {
        await logout()
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})