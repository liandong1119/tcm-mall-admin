<template>
  <el-dropdown @command="handleCommand">
    <span class="lang-switch">
      {{ currentLang === 'zh' ? '中文' : 'English' }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh">中文</el-dropdown-item>
        <el-dropdown-item command="en">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'

const { locale } = useI18n()
const currentLang = computed(() => locale.value)

const handleCommand = (command) => {
  locale.value = command
  localStorage.setItem('locale', command)
  // 刷新页面以确保所有组件都重新渲染
  window.location.reload()
}
</script>

<style scoped>
.lang-switch {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--el-text-color-primary);
}

.el-icon--right {
  margin-left: 4px;
}
</style> 