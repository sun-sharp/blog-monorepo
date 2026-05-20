<template>
  <view class="page">
    <text class="page-title">财务总览</text>
    <view class="stat-cards">
      <view class="stat-card" v-for="item in balanceList" :key="item.name">
        <text class="stat-name">{{ item.name }}</text>
        <text class="stat-value">{{ item.value }}</text>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item" v-for="item in moneyMenus" :key="item.path" @click="navigateTo(item.path)">
        <u-icon :name="item.icon" size="24" :color="item.color" />
        <text class="menu-label">{{ item.label }}</text>
        <u-icon name="arrow-right" size="16" color="#999" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { moneyApi } from '@/api';

const balanceList = ref<any[]>([]);

const moneyMenus = [
  { label: '微信账单', icon: 'chat', color: '#07c160', path: '/subPackages/money/pages/weChat/index' },
  { label: '支付宝账单', icon: 'alipay-circle', color: '#1677ff', path: '/subPackages/money/pages/aliPay/index' },
  { label: '银行账单', icon: 'bank-card', color: '#f56c6c', path: '/subPackages/money/pages/bank/index' },
  { label: '账单导入', icon: 'upload', color: '#909399', path: '/subPackages/money/pages/billUpload/index' },
];

const navigateTo = (path: string) => { uni.navigateTo({ url: path }); };

const fetchData = async () => {
  try { balanceList.value = await moneyApi.statisticsMoneyBalance(); } catch { console.error; }
};

onMounted(() => fetchData());
</script>

<style lang="scss" scoped>
.page { padding: 20rpx; }
.page-title { display: block; font-size: 34rpx; font-weight: bold; color: #303133; margin-bottom: 24rpx; }
.stat-cards { display: flex; flex-wrap: wrap; gap: 16rpx; margin-bottom: 24rpx; }
.stat-card { width: calc(50% - 8rpx); background: #fff; border-radius: 12rpx; padding: 24rpx; }
.stat-name { display: block; font-size: 24rpx; color: #909399; }
.stat-value { display: block; font-size: 32rpx; font-weight: bold; color: #303133; margin-top: 8rpx; }
.menu-list { background: #fff; border-radius: 12rpx; overflow: hidden; }
.menu-item { display: flex; align-items: center; padding: 28rpx 24rpx; border-bottom: 1rpx solid #f3f4f6; }
.menu-label { flex: 1; margin-left: 16rpx; font-size: 28rpx; color: #303133; }
</style>
