<template>
  <view class="setting-page" :class="{ dark: themeStore.isDark }">
    <scroll-view scroll-y class="setting-scroll">
      <view class="setting-list card" :class="{ dark: themeStore.isDark }">
        <u-cell-group :border="false">
          <u-cell-item title="账号管理" icon="account" @click="navigateTo('/pages/setting/account-manage/account-manage')" />
          <u-cell-item title="关于我们" icon="info-circle" @click="navigateTo('/pages/setting/about/about')" />
        </u-cell-group>
      </view>
    </scroll-view>

    <view class="setting-footer">
      <u-button type="error" plain shape="circle" @click="handleLogout">退出登录</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { useThemeStore, useUserStore } from '../../../store';

  const themeStore = useThemeStore();
  const userStore = useUserStore();

  function navigateTo(url: string) {
    uni.navigateTo({ url });
  }

  function handleLogout() {
    uni.showModal({
      title: '提示',
      content: '确定退出登录？',
      success: (res) => {
        if (res.confirm) {
          userStore.logout();
          uni.reLaunch({ url: '/pages/login/login' });
        }
      },
    });
  }
</script>

<style lang="scss" scoped>
  .setting-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $uni-bg-color-grey;
    transition: background-color 0.2s;

    &.dark {
      background-color: #1b1b1f;
    }
  }

  .setting-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    box-sizing: border-box;
  }

  .setting-list {
    padding: 0 !important;
    transition: background-color 0.2s;

    &.dark {
      background-color: #2c2c30;
    }
  }

  .setting-footer {
    flex-shrink: 0;
    padding: 20rpx 40rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }
</style>
