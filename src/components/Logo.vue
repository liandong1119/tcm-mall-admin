<template>
  <div class="logo" :class="{ 'logo-collapse': isCollapse }">
    <div class="logo-container">
      <img src="@/assets/logo.svg" alt="TCM Mall" class="logo-img">
    </div>
    <h1 v-show="!isCollapse" class="logo-text">{{ $t('common.systemName') }}</h1>
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
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #001529, #002140);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: #002140;

    .logo-img {
      transform: scale(1.1) rotate(360deg);
    }

    .logo-text {
      background-size: 200% 100%;
      background-position: 100% 0;
    }
  }

  .logo-container {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  .logo-img {
    width: 100%;
    height: 100%;
    transition: all 0.6s cubic-bezier(0.2, 0, 0, 1) 0s;
  }

  .logo-text {
    margin: 0 0 0 12px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 1;
    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
    background: linear-gradient(to right, #fff, #67C23A);
    background-size: 100% 100%;
    background-position: 0 0;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-repeat: no-repeat;
    transition: background-position 0.6s cubic-bezier(0.2, 0, 0, 1) 0s,
                background-size 0.6s cubic-bezier(0.2, 0, 0, 1) 0s;
  }

  &.logo-collapse {
    padding: 0;
    justify-content: center;

    .logo-container {
      margin: 0;
    }

    .logo-text {
      width: 0;
      opacity: 0;
      margin: 0;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 