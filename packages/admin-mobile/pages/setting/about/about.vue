<template>
  <view class="about-page" :class="{ dark: themeStore.isDark }">
    <view class="about-body">
      <image class="about-logo" src="/static/logo.png" mode="aspectFit" />
      <text class="about-name">{{ appName }}</text>
      <text class="about-version">版本 v{{ version }}</text>
      <text class="about-desc">个人博客与财务管理助手</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useThemeStore } from '../../../store';

  const themeStore = useThemeStore();

  const appName = ref('阳之锐');
  const version = ref('1.0.0');

  try {
    // 读取 manifest.json 的 versionName（跨端）
    const baseInfo = (uni as any).getAppBaseInfo?.();
    if (baseInfo?.appVersion) {
      version.value = baseInfo.appVersion;
    } else {
      // #ifdef APP-PLUS
      version.value = plus?.runtime?.version || version.value;
      // #endif
    }
  } catch {
    // ignore
  }
</script>

<style lang="scss" scoped>
  .about-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $uni-bg-color-grey;
    transition: background-color 0.2s;

    &.dark {
      background-color: #1b1b1f;
    }
  }

  .about-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
  }

  .about-logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 32rpx;
  }

  .about-name {
    margin-top: 24rpx;
    font-size: 40rpx;
    font-weight: bold;
    color: $uni-text-color;
  }

  .about-version {
    margin-top: 12rpx;
    font-size: 26rpx;
    color: $uni-text-color-grey;
  }

  .about-desc {
    margin-top: 40rpx;
    font-size: 26rpx;
    color: $uni-text-color-grey;
    text-align: center;
  }
</style>
