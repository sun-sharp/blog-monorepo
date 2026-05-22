<template>
  <view class="custom-tabbar">
    <view v-for="(item, index) in tabs" :key="index" class="custom-tabbar__item" @tap="onTap(index)">
      <u-icon :name="index === current ? item.selectedIcon : item.icon" :size="44" :color="index === current ? activeColor : inactiveColor" />
      <text class="custom-tabbar__text" :style="{ color: index === current ? activeColor : inactiveColor }">
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  defineProps<{
    current: number;
  }>();

  const activeColor = '#007aff';
  const inactiveColor = '#999999';

  const tabs = [
    { icon: 'home', selectedIcon: 'home-fill', text: '首页', url: '/pages/home/home' },
    { icon: 'file-text', selectedIcon: 'file-text-fill', text: '博客', url: '/pages/blog/article/article' },
    { icon: 'wallet', selectedIcon: 'wallet-fill', text: '财务', url: '/pages/finance/finance' },
    { icon: 'account', selectedIcon: 'account-fill', text: '我的', url: '/pages/mine/mine' },
  ];

  function onTap(index: number) {
    const url = tabs[index]?.url;
    if (!url) return;
    uni.reLaunch({ url });
  }
</script>

<style lang="scss" scoped>
  .custom-tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100rpx;
    background-color: #ffffff;
    border-top: 1rpx solid #e5e5e5;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 998;
  }

  .custom-tabbar__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 8rpx 0;
  }

  .custom-tabbar__text {
    font-size: 22rpx;
    margin-top: 4rpx;
    line-height: 1;
  }
</style>
