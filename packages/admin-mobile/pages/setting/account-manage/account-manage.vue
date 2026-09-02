<template>
  <view class="account-manage-page" :class="{ dark: themeStore.isDark }">
    <scroll-view scroll-y class="account-manage-scroll">
      <view class="account-manage-list card" :class="{ dark: themeStore.isDark }">
        <u-cell-group :border="false">
          <u-cell-item title="修改登录名" icon="account" @click="navigateTo('/pages/setting/account/account')" />
          <u-cell-item title="修改登录密码" icon="lock" @click="navigateTo('/pages/setting/password/password')" />
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
  .account-manage-page {
    height: 100vh;
    background-color: $uni-bg-color-grey;
    transition: background-color 0.2s;

    &.dark {
      background-color: #1b1b1f;
    }
  }

  .account-manage-scroll {
    height: 100%;
    padding: 20rpx;
    box-sizing: border-box;
  }

  .account-manage-list {
    padding: 0 !important;
    transition: background-color 0.2s;

    &.dark {
      background-color: #2c2c30;
    }
  }
</style>
