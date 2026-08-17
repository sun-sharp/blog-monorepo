<template>
  <scroll-view scroll-y class="mine-page">
    <view class="mine-header card">
      <view class="mine-user" @click="goToAccount">
        <u-avatar :src="getImgUrl(userInfo.avatar) || '/static/logo.png'" size="88" />
        <view class="mine-user-info">
          <text class="mine-user-name">{{ userInfo.nickname || '未登录' }}</text>
          <text class="mine-user-role">{{ userInfo.roleName || '' }}</text>
        </view>
        <u-icon name="arrow-right" color="#999" size="32" />
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
        <u-cell-item title="财务汇总" icon="grid" @click="navigateTo('/pages/finance/summary/summary')" />
        <u-cell-item title="导入账单" icon="download" @click="navigateTo('/pages/finance/upload/upload')" />
      </u-cell-group>
    </view>

    <view class="mine-section card">
      <view class="mine-section-header">
        <u-icon name="photo" size="28" color="#a18cd1" />
        <text class="mine-section-title">文件</text>
      </view>
      <u-cell-group :border="false">
        <u-cell-item title="图片管理" icon="photo" @click="navigateTo('/pages/file/image/image')" />
      </u-cell-group>
    </view>

    <view class="mine-section card">
      <view class="mine-section-header">
        <u-icon name="setting" size="28" color="#dd524d" />
        <text class="mine-section-title">系统管理</text>
      </view>
      <u-cell-group :border="false">
        <u-cell-item title="用户管理" icon="account" @click="navigateTo('/pages/system/user/user')" />
        <u-cell-item title="角色管理" icon="account-fill" @click="navigateTo('/pages/system/role/role')" />
        <u-cell-item title="分类管理" icon="list" @click="navigateTo('/pages/system/category/category')" />
        <u-cell-item title="数据备份" icon="download" @click="navigateTo('/pages/system/backup/backup')" />
        <u-cell-item title="运行日志" icon="file-text" @click="navigateTo('/pages/system/run-log/run-log')" />
      </u-cell-group>
    </view>

    <view class="mine-logout">
      <u-button type="error" plain shape="circle" @click="handleLogout">退出登录</u-button>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '../../store';
  import { getImgUrl } from '../../../shared/src/utils/files';

  defineProps<{ active: boolean }>();

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);
  function goToAccount() {
    uni.navigateTo({ url: '/pages/setting/account/account' });
  }

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
    height: 100%;
    padding: 0 20rpx;
    padding-bottom: 20rpx;
    box-sizing: border-box;
  }

  .mine-user {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .mine-user-info {
    flex: 1;
    margin-left: 24rpx;
    display: flex;
    flex-direction: column;
  }

  .mine-user-name {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .mine-user-role {
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
