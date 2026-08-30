<template>
  <view class="main-page" :style="{ paddingTop: customNavHeight + 'px' }">
    <view class="main-content">
      <tab-home v-show="currentTab === 0" :active="currentTab === 0" />
      <tab-article v-show="currentTab === 1" ref="tabArticleRef" :active="currentTab === 1" />
      <tab-finance v-show="currentTab === 2" ref="tabFinanceRef" :active="currentTab === 2" />
      <tab-mine v-show="currentTab === 3" :active="currentTab === 3" />
    </view>

    <view class="custom-tabbar">
      <view v-for="(item, index) in tabs" :key="index" class="custom-tabbar__item" @tap="onTap(index)">
        <u-icon :name="index === currentTab ? item.selectedIcon : item.icon" :size="44" :color="index === currentTab ? activeColor : inactiveColor" />
        <text class="custom-tabbar__text" :style="{ color: index === currentTab ? activeColor : inactiveColor }">
          {{ item.text }}
        </text>
      </view>
    </view>

    <global-loading />
  </view>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import TabHome from '../../components/tab-content/tab-home.vue';
  import TabArticle from '../../components/tab-content/tab-article.vue';
  import TabFinance from '../../components/tab-content/tab-finance.vue';
  import TabMine from '../../components/tab-content/tab-mine.vue';
  import { getCustomNavHeight } from '../../utils/custom-nav';
  import { tabTargetRef, consumeSwitchTab } from '../../composables/useTabBus';

  const currentTab = ref(0);
  const customNavHeight = getCustomNavHeight();
  const tabArticleRef = ref();
  const tabFinanceRef = ref();

  const activeColor = '#007aff';
  const inactiveColor = '#333333';

  const tabs = [
    { icon: 'home', selectedIcon: 'home-fill', text: '首页' },
    { icon: 'file-text', selectedIcon: 'file-text-fill', text: '博客' },
    { icon: 'red-packet', selectedIcon: 'red-packet-fill', text: '财务' },
    { icon: 'account', selectedIcon: 'account-fill', text: '我的' },
  ];

  function onTap(index: number) {
    currentTab.value = index;
  }

  watch(
    (): number => {
      consumeSwitchTab();
      return tabTargetRef.value;
    },
    (target, prev) => {
      console.log(target, 'target');

      if (target >= 0 && target !== prev) currentTab.value = target;
    }
  );

  onShow(() => {
    if (currentTab.value === 1) tabArticleRef.value?.checkRefresh();
    if (currentTab.value === 2) tabFinanceRef.value?.checkRefresh();
  });
</script>

<style lang="scss" scoped>
  .main-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;
  }

  .main-content {
    flex: 1;
    overflow: hidden;
  }

  .custom-tabbar {
    display: flex;
    align-items: center;
    justify-content: space-around;
    min-height: 120rpx;
    background-color: #ffffff;
    border-top: 1rpx solid #e5e5e5;
    padding-bottom: env(safe-area-inset-bottom);
    flex-shrink: 0;
  }

  .custom-tabbar__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 10rpx 0 6rpx;
  }

  .custom-tabbar__text {
    font-size: 22rpx;
    margin-top: 4rpx;
    line-height: 1;
  }
</style>
