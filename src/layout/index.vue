<template>
  <div class="app-wrapper">
    <div class="sidebar-container" :class="{ 'collapse': isCollapse }">
      <Logo :is-collapse="isCollapse" />
      <el-scrollbar>
        <Menu :is-collapse="isCollapse" />
      </el-scrollbar>
    </div>
    <div class="main-container">
      <Header v-model:is-collapse="isCollapse" />
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Logo from '@/components/Logo.vue'
import Menu from './components/Menu.vue'
import Header from './components/Header.vue'

const isCollapse = ref(false)
const cachedViews = ref(['Dashboard', 'Product', 'Order', 'User'])
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #f0f2f5;
}

.sidebar-container {
  width: 220px;
  height: 100%;
  background-color: #001529;
  transition: width 0.3s;
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  flex-shrink: 0;
  z-index: 1001;

  &.collapse {
    width: 64px;
  }

  .el-scrollbar {
    height: calc(100% - 60px);
  }
}

.main-container {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  
  :deep(.el-header) {
    height: 48px;
    padding: 0;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }
}

.app-main {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  overflow: auto;
}

/* 卡片样式 */
:deep(.el-card) {
  margin-bottom: 16px;
  border-radius: 4px;
  border: none;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  
  .el-card__header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .el-card__body {
    padding: 16px;
  }
}

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>