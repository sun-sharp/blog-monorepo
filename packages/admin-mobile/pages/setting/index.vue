<template>
  <view class="setting-page">
    <view class="user-section">
      <u-avatar :src="userStore.getUserInfo.avatar || ''" size="120rpx" />
      <text class="user-name">{{ userStore.getUserInfo.nickname }}</text>
      <text class="user-role">{{ userStore.getUserInfo.roleName }}</text>
    </view>

    <view class="setting-group">
      <view class="setting-item" @click="goToAccount">
        <u-icon name="account" size="20" />
        <text class="setting-label">个人设置</text>
        <u-icon name="arrow-right" size="16" color="#999" />
      </view>
      <view class="setting-item" @click="goToPassword">
        <u-icon name="lock" size="20" />
        <text class="setting-label">密码修改</text>
        <u-icon name="arrow-right" size="16" color="#999" />
      </view>
    </view>

    <view class="setting-group">
      <view class="setting-item" @click="handleLock">
        <u-icon name="eye-off" size="20" />
        <text class="setting-label">锁屏</text>
        <u-icon name="arrow-right" size="16" color="#999" />
      </view>
    </view>

    <view class="setting-group">
      <u-button type="error" text="退出登录" @click="handleLogout" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore, useLockScreenStore } from '@/store';

const userStore = useUserStore();
const lockScreenStore = useLockScreenStore();

const goToAccount = () => {
  uni.$u.toast('个人设置功能开发中');
};

const goToPassword = () => {
  uni.$u.toast('密码修改功能开发中');
};

const handleLock = () => {
  lockScreenStore.setLock(true);
};

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.reLaunch({ url: '/pages/login/index' });
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.setting-page {
  padding: 20rpx;
}

.user-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.user-name {
  font-size: 34rpx;
  font-weight: bold;
  color: #303133;
  margin-top: 16rpx;
}

.user-role {
  font-size: 24rpx;
  color: #909399;
  margin-top: 8rpx;
}

.setting-group {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f3f4f6;
}

.setting-label {
  flex: 1;
  margin-left: 16rpx;
  font-size: 28rpx;
  color: #303133;
}
</style>
