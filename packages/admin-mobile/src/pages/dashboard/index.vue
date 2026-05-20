<template>
  <view class="dashboard-page">
    <text class="page-title">仪表盘</text>
    <view class="coming-soon">
      <u-icon name="calendar" size="48" color="#018d71" />
      <text class="coming-text">仪表盘功能开发中</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 20rpx;
}

.page-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #303133;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.coming-text {
  font-size: 28rpx;
  color: #909399;
  margin-top: 20rpx;
}
</style>
