<template>
  <view class="mine-page">
    <view class="mine-header card">
      <u-avatar :src="userInfo.avatar || '/static/logo.png'" size="100" />
      <view class="mine-header-info">
        <text class="mine-header-name">{{ userInfo.nickname || '未登录' }}</text>
        <text class="mine-header-role">{{ userInfo.roleName || '' }}</text>
      </view>
    </view>

    <view class="mine-section">
      <text class="mine-section-title">个人</text>
      <u-cell-group>
        <u-cell-item title="账号设置" icon="account" @click="navigateTo('/pages/setting/account/account')" />
        <u-cell-item title="修改密码" icon="lock" @click="navigateTo('/pages/setting/password/password')" />
        <u-cell-item title="仪表盘" icon="grid" @click="navigateTo('/pages/dashboard/workplace')" />
      </u-cell-group>
    </view>

    <view class="mine-section">
      <text class="mine-section-title">博客</text>
      <u-cell-group>
        <u-cell-item title="文章管理" icon="file-text" @click="navigateTo('/pages/blog/article/article')" />
        <u-cell-item title="日程管理" icon="calendar" @click="navigateTo('/pages/blog/schedule/schedule')" />
      </u-cell-group>
    </view>

    <view class="mine-section">
      <text class="mine-section-title">财务管理</text>
      <u-cell-group>
        <u-cell-item title="银行账单" icon="list" @click="navigateTo('/pages/money/bank/bank')" />
        <u-cell-item title="支付宝账单" icon="list" @click="navigateTo('/pages/money/ali-pay/ali-pay')" />
        <u-cell-item title="微信账单" icon="list" @click="navigateTo('/pages/money/we-chat/we-chat')" />
        <u-cell-item title="上传规则" icon="setting" @click="navigateTo('/pages/money/bill-upload/bill-upload')" />
        <u-cell-item title="财务汇总" icon="pie-chart" @click="navigateTo('/pages/money/amount-summary/amount-summary')" />
      </u-cell-group>
    </view>

    <view class="mine-section">
      <text class="mine-section-title">文件</text>
      <u-cell-group>
        <u-cell-item title="图片管理" icon="image" @click="navigateTo('/pages/file/image/image')" />
      </u-cell-group>
    </view>

    <view class="mine-section">
      <text class="mine-section-title">系统管理</text>
      <u-cell-group>
        <u-cell-item title="用户管理" icon="account" @click="navigateTo('/pages/system/user/user')" />
        <u-cell-item title="角色管理" icon="manage" @click="navigateTo('/pages/system/role/role')" />
        <u-cell-item title="菜单管理" icon="menu" @click="navigateTo('/pages/system/menu/menu')" />
        <u-cell-item title="分类管理" icon="list" @click="navigateTo('/pages/system/category/category')" />
      </u-cell-group>
    </view>

    <view class="mine-logout">
      <u-button type="error" plain @click="handleLogout">退出登录</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '../../store';

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
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }

  .mine-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 30rpx;
    background-color: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    margin-bottom: 20rpx;
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
    margin-bottom: 20rpx;
  }

  .mine-section-title {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    padding: 16rpx 10rpx 8rpx;
  }

  .mine-logout {
    margin-top: 40rpx;
    padding: 0 10rpx;
  }
</style>
