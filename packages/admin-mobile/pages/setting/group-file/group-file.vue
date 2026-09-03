<template>
  <u-config-provider :dark-mode="mode">
    <view class="group-page" :class="{ dark: isDark }">
      <scroll-view scroll-y class="group-scroll">
        <view class="group-list card" :class="{ dark: isDark }">
          <u-cell-group :border="false">
            <u-cell-item title="图片管理" icon="photo" @click="navigateTo('/pages/file/image/image')" />
            <u-cell-item title="数据备份" icon="download" @click="navigateTo('/pages/system/backup/backup')" />
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

      :deep(.u-cell),
      :deep(.u-cell__title),
      :deep(.u-cell__value) {
        background-color: #2c2c30;
        color: #e5e5e6 !important;
      }
    }
  }
</style>
