<template>
  <view class="workplace-page">
    <view class="workplace-stats">
      <u-grid :col="2">
        <u-grid-item v-for="(stat, index) in stats" :key="index">
          <view class="stat-item">
            <text class="stat-value">{{ stat.value }}</text>
            <text class="stat-label">{{ stat.label }}</text>
          </view>
        </u-grid-item>
      </u-grid>
    </view>

    <view class="workplace-nav card">
      <text class="section-title">快捷导航</text>
      <u-grid :col="4">
        <u-grid-item v-for="(nav, index) in navList" :key="index" @click="nav.action">
          <u-icon :name="nav.icon" size="48" :color="nav.color" />
          <text class="nav-label">{{ nav.label }}</text>
        </u-grid-item>
      </u-grid>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const stats = ref([
    { label: '访问量', value: '--' },
    { label: '销售额', value: '--' },
    { label: '订单数', value: '--' },
    { label: '交易额', value: '--' },
  ]);

  const navList = [
    { label: '文章', icon: 'file-text', color: '#007aff', action: () => uni.navigateTo({ url: '/pages/blog/article/article' }) },
    { label: '日程', icon: 'calendar', color: '#4cd964', action: () => uni.navigateTo({ url: '/pages/blog/schedule/schedule' }) },
    { label: '图片', icon: 'image', color: '#f0ad4e', action: () => uni.navigateTo({ url: '/pages/file/image/image' }) },
    { label: '财务', icon: 'pie-chart', color: '#dd524d', action: () => uni.navigateTo({ url: '/pages/money/amount-summary/amount-summary' }) },
  ];
</script>

<style lang="scss" scoped>
  .workplace-page {
    padding: 20rpx;
  }

  .workplace-stats {
    background-color: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    margin-bottom: 20rpx;
    overflow: hidden;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx 0;
  }

  .stat-value {
    font-size: 36rpx;
    font-weight: bold;
    color: $uni-text-color;
  }

  .stat-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 8rpx;
  }

  .section-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }

  .nav-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color;
    margin-top: 8rpx;
  }
</style>
