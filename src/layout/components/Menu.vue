<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    background-color="#001529"
    text-color="#fff"
    active-text-color="#409EFF"
    :collapse-transition="false"
    router
  >
    <el-menu-item index="/dashboard">
      <el-icon><Odometer /></el-icon>
      <template #title>{{ $t('menu.dashboard') }}</template>
    </el-menu-item>

    <el-menu-item index="/merchant/list">
      <el-icon><Shop /></el-icon>
      <template #title>{{ $t('menu.merchant') }}</template>
    </el-menu-item>

    <el-sub-menu index="/product">
      <template #title>
        <el-icon><ShoppingBag /></el-icon>
        <span>{{ $t('menu.product') }}</span>
      </template>
      <el-menu-item index="/product/list">{{ $t('menu.productList') }}</el-menu-item>
      <el-menu-item index="/product/category">{{ $t('menu.category') }}</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="/order">
      <template #title>
        <el-icon><ShoppingCart /></el-icon>
        <span>{{ $t('menu.order') }}</span>
      </template>
      <el-menu-item index="/order/list">{{ $t('menu.orderList') }}</el-menu-item>
      <el-menu-item index="/order/refund">{{ $t('menu.refund') }}</el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/review">
      <el-icon><ChatDotRound /></el-icon>
      <template #title>{{ $t('menu.review') }}</template>
    </el-menu-item>

    <el-menu-item index="/user/list">
      <el-icon><User /></el-icon>
      <template #title>{{ $t('menu.user') }}</template>
    </el-menu-item>

    <el-menu-item index="/profile">
      <el-icon><UserFilled /></el-icon>
      <template #title>{{ $t('menu.profile') }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Odometer,
  ShoppingBag,
  Shop,
  ShoppingCart,
  ChatDotRound,
  User,
  UserFilled,
  Setting
} from '@element-plus/icons-vue'

const route = useRoute()

defineProps({
  isCollapse: {
    type: Boolean,
    required: true
  }
})

const activeMenu = computed(() => {
  const { path, meta } = route
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
  height: 100%;
  width: 100%;
  user-select: none;
}

.el-menu-item {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px !important;
  
  &:hover {
    color: #fff !important;
    background-color: #1890ff !important;
  }
  
  &.is-active {
    background-color: #1890ff !important;
    color: #fff !important;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #fff;
    }
  }
  
  .el-icon {
    width: 24px;
    height: 24px;
    font-size: 18px;
    margin-right: 10px;
  }
}

.el-sub-menu {
  &.is-active {
    > .el-sub-menu__title {
      color: #fff !important;
    }
  }
  
  .el-sub-menu__title {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 20px !important;
    
    &:hover {
      color: #fff !important;
      background-color: #1890ff !important;
    }
    
    .el-icon {
      width: 24px;
      height: 24px;
      font-size: 18px;
      margin-right: 10px;
    }
  }
  
  .el-menu {
    background-color: #000c17 !important;
    
    .el-menu-item {
      padding-left: 56px !important;
      
      &:hover {
        color: #fff !important;
        background-color: #1890ff !important;
      }
      
      &.is-active {
        background-color: #1890ff !important;
        color: #fff !important;
      }
    }
  }
}

/* 折叠时的样式 */
.el-menu--collapse {
  width: 64px !important;
  
  .el-sub-menu__title {
    span, .el-sub-menu__icon-arrow {
      display: none;
    }
  }
}

/* 悬浮菜单样式 */
:deep(.el-menu--popup) {
  min-width: 200px;
  padding: 0;
  background-color: #001529 !important;
  
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    padding: 0 20px !important;
    
    &:hover {
      color: #fff !important;
      background-color: #1890ff !important;
    }
    
    &.is-active {
      background-color: #1890ff !important;
      color: #fff !important;
    }
  }
}
</style> 