<template>
  <view class="mine-page">
    <view class="mine-header card">
      <u-avatar :src="userInfo.avatar || '/static/logo.png'" size="100" />
      <view class="mine-header-info">
        <text class="mine-header-name">{{ userInfo.nickname || '未登录' }}</text>
        <text class="mine-header-role">{{ userInfo.roleName || '' }}</text>
      </view>
    </view>

    <view class="mine-section card">
      <view class="mine-section-header">
        <u-icon name="account" size="28" color="#007aff" />
        <text class="mine-section-title">个人</text>
      </view>
      <u-cell-group :border="false">
        <u-cell-item title="账号设置" icon="account" @click="navigateTo('/pages/setting/account/account')" />
        <u-cell-item title="修改密码" icon="lock" @click="navigateTo('/pages/setting/password/password')" />
      </u-cell-group>
    </view>

    <view class="mine-section card">
      <view class="mine-section-header">
        <u-icon name="file-text" size="28" color="#4cd964" />
        <text class="mine-section-title">博客</text>
      </view>
      <u-cell-group :border="false">
        <u-cell-item title="日程管理" icon="calendar" @click="navigateTo('/pages/blog/schedule/schedule')" />
      </u-cell-group>
    </view>

    <view class="mine-section card">
      <view class="mine-section-header">
        <u-icon name="red-packet" size="28" color="#f0ad4e" />
        <text class="mine-section-title">财务</text>
      </view>
      <u-cell-group :border="false">
        <u-cell-item title="上传规则" icon="setting" @click="navigateTo('/pages/finance/bill-upload/bill-upload')" />
        <u-cell-item title="财务汇总" icon="pie-chart" @click="navigateTo('/pages/finance/summary/summary')" />
        <u-cell-item title="导入账单" icon="upload" @click="navigateTo('/pages/finance/upload/upload')" />
      </u-cell-group>
    </view>

    <view class="mine-section card">
      <view class="mine-section-header">
        <u-icon name="image" size="28" color="#a18cd1" />
        <text class="mine-section-title">文件</text>
      </view>
      <u-cell-group :border="false">
        <u-cell-item title="图片管理" icon="image" @click="navigateTo('/pages/file/image/image')" />
        <u-cell-item title="上传图片" icon="camera" @click="navigateTo('/pages/file/upload/upload')" />
      </u-cell-group>
    </view>

    <view class="mine-section card">
      <view class="mine-section-header">
        <u-icon name="manage" size="28" color="#dd524d" />
        <text class="mine-section-title">系统管理</text>
      </view>
      <u-cell-group :border="false">
        <u-cell-item title="用户管理" icon="account" @click="navigateTo('/pages/system/user/user')" />
        <u-cell-item title="角色管理" icon="manage" @click="navigateTo('/pages/system/role/role')" />
        <u-cell-item title="分类管理" icon="list" @click="navigateTo('/pages/system/category/category')" />
      </u-cell-group>
    </view>

    <view class="mine-logout">
      <u-button type="error" plain shape="circle" @click="handleLogout">退出登录</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '../../store';

  defineProps<{ active: boolean }>();

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);

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
  .mine-page {
    padding: 20rpx;
    padding-bottom: 20rpx;
  }

  .mine-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: linear-gradient(135deg, #e8f4fd, #f0f7ff);
  }

  .mine-header-info {
    flex: 1;
    margin-left: 24rpx;
    display: flex;
    flex-direction: column;
  }

  .mine-header-name {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .mine-header-role {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
  }

  .mine-section {
    margin-bottom: 16rpx;
    padding: 0 !important;
  }

  .mine-section-header {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 20rpx 24rpx 8rpx;
  }

  .mine-section-title {
    font-size: $uni-font-size-base;
    font-weight: bold;
  }

  .mine-logout {
    margin-top: 30rpx;
    padding: 0 10rpx;
  }
</style>
