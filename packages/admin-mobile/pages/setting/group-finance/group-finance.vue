<template>
  <view class="group-page" :class="{ dark: themeStore.isDark }">
    <scroll-view scroll-y class="group-scroll">
      <view class="group-list card" :class="{ dark: themeStore.isDark }">
        <u-cell-group :border="false">
          <u-cell-item title="上传规则" icon="setting" @click="navigateTo('/pages/finance/bill-upload/bill-upload')" />
          <u-cell-item title="财务汇总" icon="grid" @click="navigateTo('/pages/finance/summary/summary')" />
          <u-cell-item title="导入账单" icon="download" @click="navigateTo('/pages/finance/upload/upload')" />
        </u-cell-group>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { useThemeStore } from '../../../store';

  const themeStore = useThemeStore();

  function navigateTo(url: string) {
    uni.navigateTo({ url });
  }
</script>

<style lang="scss" scoped>
  .group-page {
    height: 100vh;
    background-color: $uni-bg-color-grey;
    transition: background-color 0.2s;

    &.dark {
      background-color: #1b1b1f;
    }
  }

  .group-scroll {
    height: 100%;
    padding: 20rpx;
    box-sizing: border-box;
  }

  .group-list {
    padding: 0 !important;
    transition: background-color 0.2s;

    &.dark {
      background-color: #2c2c30;
    }
  }
</style>
