<template>
  <div class="header">
    <div class="left">
      <el-icon class="menu-icon" @click="toggleSidebar">
        <component :is="isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
      <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">{{ $t('menu.dashboard') }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="route.meta?.title">{{ $t(route.meta.title) }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="right">
      <div class="action-item">
        <el-tooltip :content="isFullscreen ? $t('common.exitFullscreen') : $t('common.fullscreen')" placement="bottom">
          <el-icon class="action-icon" @click="toggleFullScreen">
            <component :is="isFullscreen ? 'Aim' : 'FullScreen'" />
          </el-icon>
        </el-tooltip>
      </div>

      <div class="action-item">
        <LangSwitch />
      </div>

      <div class="action-item">
        <el-dropdown trigger="click">
          <span class="avatar-wrapper">
            <el-avatar :size="32" :src="userAvatar">{{ username.charAt(0).toUpperCase() }}</el-avatar>
            <span class="username">{{ username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/profile')">
                <el-icon><User /></el-icon>
                <span>{{ $t('menu.profile') }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                <span>{{ $t('common.logout') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import LangSwitch from '@/components/LangSwitch.vue'
import {
  Expand,
  Fold,
  FullScreen,
  Aim,
  User,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const props = defineProps({
  isCollapse: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:isCollapse'])

const username = ref(localStorage.getItem('username') || 'Admin')
const userAvatar = ref('')
const isFullscreen = ref(false)
const currentLang = computed(() => locale.value)

const toggleSidebar = () => {
  emit('update:isCollapse', !props.isCollapse)
}

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleSetLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const handleLogout = () => {
  ElMessageBox.confirm(
    t('message.confirmLogout'),
    t('common.tips'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  })
}
</script>

<style lang="scss" scoped>
.header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .left {
    display: flex;
    align-items: center;
    padding-left: 16px;

    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      font-size: 20px;
      cursor: pointer;
      border-radius: 4px;
      color: #333;
      transition: all 0.3s;

      :deep(svg) {
        width: 1em;
        height: 1em;
      }

      &:hover {
        color: var(--el-color-primary);
        background-color: rgba(64, 158, 255, 0.1);
      }
    }

    .breadcrumb-container {
      margin-left: 8px;
      
      :deep(.el-breadcrumb) {
        line-height: 48px;
        font-size: 14px;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    height: 100%;
    padding-right: 16px;

    .action-item {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 12px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }

      .action-icon {
        font-size: 18px;
        color: #000;
      }

      .language-switch {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #000;

        .svg-icon {
          margin-right: 8px;
          font-size: 16px;
        }
      }

      .avatar-wrapper {
        display: flex;
        align-items: center;
        
        .username {
          margin-left: 8px;
          margin-right: 4px;
          font-size: 14px;
          color: #000;
        }
      }
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  
  .el-icon {
    margin-right: 8px;
    font-size: 16px;
  }
}
</style> 