<template>
  <u-config-provider :dark-mode="mode">
    <view class="account-manage-page" :class="{ dark: isDark }">
      <scroll-view scroll-y class="account-manage-scroll">
        <view class="account-manage-list card" :class="{ dark: isDark }">
          <u-cell-group :border="false">
            <u-cell-item title="修改登录名" icon="account" @click="navigateTo('/pages/setting/account/account')" />
            <u-cell-item title="修改登录密码" icon="lock" @click="navigateTo('/pages/setting/password/password')" />
          </u-cell-group>
        </view>
      </scroll-view>
    </view>
  </u-config-provider>
</template>

<script lang="ts" setup>
  import { useAppTheme } from '../../../composables/useAppTheme';

  const { isDark, mode } = useAppTheme();

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

      :deep(.u-cell),
      :deep(.u-cell__title),
      :deep(.u-cell__value) {
        background-color: #2c2c30;
        color: #e5e5e6 !important;
      }
    }
  }
</style>
