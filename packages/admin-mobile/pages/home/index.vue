<template>
  <view class="home-page">
    <view class="user-card" @click="goToSetting">
      <u-avatar :src="userStore.getUserInfo.avatar || ''" size="80rpx" />
      <view class="user-info">
        <text class="user-name">{{ userStore.getUserInfo.nickname || '未登录' }}</text>
        <text class="user-role">{{ userStore.getUserInfo.roleName || '' }}</text>
      </view>
      <u-icon name="arrow-right" size="20" color="#999" />
    </view>

    <view class="menu-grid">
      <view class="menu-item" v-for="item in menuList" :key="item.path" @click="navigateTo(item.path)">
        <u-icon :name="item.icon" size="28" :color="item.color" />
        <text class="menu-label">{{ item.label }}</text>
      </view>
    </view>

    <view class="wait-section" v-if="waitList.length">
      <view class="section-header">
        <text class="section-title">待办事项</text>
      </view>
      <view class="wait-item" v-for="item in waitList" :key="item.waitForDoId">
        <view class="wait-content">
          <text class="wait-title">{{ item.title }}</text>
          <text class="wait-deadline" v-if="item.deadline">截止：{{ item.deadline }}</text>
        </view>
        <u-tag :text="item.state === 1 ? '进行中' : '已完成'" :type="item.state === 1 ? 'warning' : 'success'" size="mini" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store';
import { waitForDoApi } from '@/api';

const userStore = useUserStore();
const waitList = ref<any[]>([]);

const menuList = [
  { label: '用户管理', icon: 'account', color: '#018d71', path: '/subPackages/system/pages/user/index' },
  { label: '角色管理', icon: 'lock', color: '#e6a23c', path: '/subPackages/system/pages/role/index' },
  { label: '菜单管理', icon: 'list', color: '#409eff', path: '/subPackages/system/pages/menu/index' },
  { label: '分类管理', icon: 'grid', color: '#f56c6c', path: '/subPackages/system/pages/category/index' },
  { label: '文章管理', icon: 'file-text', color: '#67c23a', path: '/subPackages/blog/pages/article/index' },
  { label: '日程管理', icon: 'calendar', color: '#909399', path: '/subPackages/blog/pages/schedule/index' },
  { label: '财务总览', icon: 'currency-cny', color: '#e6a23c', path: '/subPackages/money/pages/amountSummary/index' },
  { label: '微信账单', icon: 'chat', color: '#07c160', path: '/subPackages/money/pages/weChat/index' },
  { label: '支付宝', icon: 'alipay-circle', color: '#1677ff', path: '/subPackages/money/pages/aliPay/index' },
  { label: '银行账单', icon: 'bank-card', color: '#f56c6c', path: '/subPackages/money/pages/bank/index' },
  { label: '账单导入', icon: 'upload', color: '#909399', path: '/subPackages/money/pages/billUpload/index' },
  { label: '图片管理', icon: 'image', color: '#018d71', path: '/subPackages/file/pages/image/index' },
];

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path });
};

const goToSetting = () => {
  uni.switchTab({ url: '/pages/setting/index' });
};

const fetchWaitList = async () => {
  try {
    const data = await waitForDoApi.classifyAll(0, 1);
    waitList.value = data.slice(0, 5);
  } catch (error) {
    console.error(error);
  }
};

onShow(() => {
  fetchWaitList();
});
</script>

<style lang="scss" scoped>
.home-page {
  padding: 20rpx;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.user-info {
  flex: 1;
  margin-left: 20rpx;
}

.user-name {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #303133;
}

.user-role {
  display: block;
  font-size: 24rpx;
  color: #909399;
  margin-top: 4rpx;
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
}

.menu-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
}

.menu-label {
  font-size: 24rpx;
  color: #606266;
  margin-top: 12rpx;
}

.wait-section {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.section-header {
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #303133;
}

.wait-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
}

.wait-content {
  flex: 1;
}

.wait-title {
  display: block;
  font-size: 28rpx;
  color: #303133;
}

.wait-deadline {
  display: block;
  font-size: 22rpx;
  color: #909399;
  margin-top: 4rpx;
}
</style>
