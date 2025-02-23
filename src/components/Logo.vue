<template>
  <div class="logo" :class="{ 'logo-collapse': isCollapse }">
    <img src="@/assets/logo.svg" alt="TCM Mall" class="logo-img">
    <span v-show="!isCollapse" class="logo-text">中药商城管理系统</span>
  </div>
</template>

<script setup>
defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.logo {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background: #001529;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
  cursor: pointer;
  border-bottom: 1px solid #002140;

  &:hover {
    background: #002140;
  }

  .logo-img {
    height: 32px;
    width: 32px;
    margin-right: 12px;
    vertical-align: middle;
  }

  .logo-text {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
  }

  &.logo-collapse {
    padding: 0;
    justify-content: center;

    .logo-img {
      margin-right: 0;
    }

    .logo-text {
      width: 0;
      opacity: 0;
    }
  }
}
</style> 