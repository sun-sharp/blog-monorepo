<template>
  <scroll-view scroll-y class="home-page">
    <view class="home-quick-nav card">
      <text class="home-section-title">快捷功能</text>
      <u-grid :col="3" :border="false">
        <u-grid-item @click="navigateTo('/pages/blog/schedule/schedule')">
          <view class="nav-icon-wrap nav-icon-green">
            <u-icon name="calendar" size="40" color="#fff" />
          </view>
          <text class="nav-label">日程</text>
        </u-grid-item>
        <u-grid-item @click="navigateTo('/pages/finance/upload/upload')">
          <view class="nav-icon-wrap nav-icon-orange">
            <u-icon name="download" size="40" color="#fff" />
          </view>
          <text class="nav-label">导入</text>
        </u-grid-item>
        <u-grid-item @click="navigateTo('/pages/finance/summary/summary')">
          <view class="nav-icon-wrap nav-icon-blue">
            <u-icon name="grid" size="40" color="#fff" />
          </view>
          <text class="nav-label">汇总</text>
        </u-grid-item>
      </u-grid>
    </view>

    <view class="home-stats card">
      <view class="home-stats-header">
        <view class="home-section-title-row">
          <u-icon name="trending-up" size="32" color="#007aff" />
          <text class="home-section-title">数据统计</text>
        </view>
      </view>
      <view v-if="statLoading" class="home-stats-center">
        <u-loading mode="circle" />
      </view>
      <view v-else-if="statItems.length === 0" class="home-stats-center">
        <u-empty mode="data" text="暂无统计数据" icon-size="120" />
      </view>
      <view v-else class="home-stats-list">
        <view
          v-for="item in statItems"
          :key="item.label"
          class="home-stat-card"
          :class="{ 'home-stat-card-clickable': item.url || item.tab !== undefined }"
          @click="onStatClick(item)">
          <view class="home-stat-main">
            <view :class="['home-stat-icon', item.theme]">
              <u-icon :name="item.icon" size="36" color="#fff" />
            </view>
            <view class="home-stat-meta">
              <text class="home-stat-value">{{ item.value }}</text>
              <text class="home-stat-label">{{ item.label }}</text>
            </view>
            <u-icon v-if="item.url || item.tab !== undefined" name="arrow-right" size="28" color="#ccc" />
          </view>
          <view v-if="item.children && item.children.length > 0" class="home-stat-children">
            <view v-for="child in item.children" :key="child.label" class="home-stat-child">
              <text class="home-stat-child-label">{{ child.label }}</text>
              <text class="home-stat-child-value">{{ child.count }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useUserStore } from '../../store';
  import { homeStatisticsApi } from '../../api';
  import { emitSwitchTab } from '../../composables/useTabBus';
  import type { ApiHomeStatistics, ApiHomeStatFinancialTypeCount, ApiHomeStatImageSourceCount } from '/#/api/blog/home-statistics';

  interface StatCardItem {
    icon: string;
    label: string;
    value: number;
    theme: string;
    url?: string;
    tab?: number;
    children?: { label: string; count: number }[];
  }

  const props = defineProps<{ active: boolean }>();

  const userStore = useUserStore();

  const userInfo = computed(() => userStore.getUserInfo);
  const statData = ref<ApiHomeStatistics | null>(null);
  const statLoading = ref(false);
  const inited = ref(false);

  const statItems = computed<StatCardItem[]>(() => {
    const d = statData.value;
    if (!d) return [];

    const financialChildren: StatCardItem['children'] = [];
    const financialTypeCount = d.financialTypeCount || [];
    financialTypeCount.forEach((item: ApiHomeStatFinancialTypeCount) => {
      financialChildren.push({ label: item.label, count: item.count });
      (item.children || []).forEach((child: ApiHomeStatFinancialTypeCount) => {
        financialChildren.push({ label: child.label, count: child.count });
      });
    });

    const imageCount = (d.imageTypeCount || []).reduce((sum, m) => sum + m.count, 0);
    const imageChildren: StatCardItem['children'] = (d.imageSourceCount || []).map((item: ApiHomeStatImageSourceCount) => ({
      label: item.label,
      count: item.count,
    }));

    return [
      {
        icon: 'red-packet',
        label: '财务账单',
        value: d.financialCount,
        theme: 'theme-blue',
        tab: 2,
        children: financialChildren,
      },
      {
        icon: 'file-text',
        label: '文章',
        value: d.articleCount,
        theme: 'theme-green',
        tab: 1,
      },
      {
        icon: 'pic',
        label: '图片',
        value: imageCount,
        theme: 'theme-orange',
        url: '/pages/file/image/image',
        children: imageChildren,
      },
      {
        icon: 'level',
        label: '测量',
        value: d.uricCount,
        theme: 'theme-purple',
        url: '/pages/system/uric/uric',
      },
      {
        icon: 'account',
        label: '用户',
        value: d.userCount,
        theme: 'theme-cyan',
        url: '/pages/system/user/user',
      },
      {
        icon: 'tags',
        label: '角色',
        value: d.roleCount,
        theme: 'theme-grey',
        url: '/pages/system/role/role',
      },
      {
        icon: 'grid',
        label: '菜单',
        value: d.menuCount,
        theme: 'theme-blue',
      },
      {
        icon: 'server-man',
        label: '接口',
        value: d.apiCount,
        theme: 'theme-green',
      },
    ];
  });

  function onStatClick(item: StatCardItem) {
    if (item.tab !== undefined) {
      emitSwitchTab(item.tab);
      return;
    }
    if (item.url) {
      navigateTo(item.url);
    }
  }

  async function loadStatistics() {
    if (!userInfo.value.userId) return;
    statLoading.value = true;
    try {
      statData.value = await homeStatisticsApi.homeStatistics();
    } catch {
      statData.value = null;
    } finally {
      statLoading.value = false;
    }
  }

  function navigateTo(url: string) {
    uni.navigateTo({ url });
  }

  onMounted(() => {
    loadStatistics();
    inited.value = true;
  });

  watch(
    () => props.active,
    (val) => {
      if (val && inited.value && userInfo.value.userId) {
        loadStatistics();
      }
    }
  );
</script>

<style lang="scss" scoped>
  .home-page {
    height: 100%;
    padding: 0 20rpx;
    padding-bottom: 20rpx;
    box-sizing: border-box;
  }

  .home-section-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .home-section-title-row {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }

  .nav-icon-wrap {
    width: 80rpx;
    height: 80rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-icon-blue {
    background: linear-gradient(135deg, #4facfe, #007aff);
  }

  .nav-icon-green {
    background: linear-gradient(135deg, #43e97b, #38f9d7);
  }

  .nav-icon-orange {
    background: linear-gradient(135deg, #fa709a, #fee140);
  }

  .nav-label {
    font-size: $uni-font-size-sm;
    margin-top: 12rpx;
  }

  .home-stats {
    margin-top: 20rpx;
  }

  .home-stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  .home-stats-center {
    display: flex;
    justify-content: center;
    padding: 60rpx 0;
  }

  .home-stats-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .home-stat-card {
    background-color: #f7f8fa;
    border-radius: 16rpx;
    padding: 24rpx;
  }

  .home-stat-card-clickable:active {
    background-color: #eef1f5;
  }

  .home-stat-main {
    display: flex;
    align-items: center;
  }

  .home-stat-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .theme-blue {
    background: linear-gradient(135deg, #4facfe, #007aff);
  }

  .theme-green {
    background: linear-gradient(135deg, #43e97b, #38f9d7);
  }

  .theme-orange {
    background: linear-gradient(135deg, #fa709a, #fee140);
  }

  .theme-purple {
    background: linear-gradient(135deg, #a18cd1, #fbc2eb);
  }

  .theme-cyan {
    background: linear-gradient(135deg, #43e97b, #38bdf8);
  }

  .theme-grey {
    background: linear-gradient(135deg, #bdc3c7, #7f8c8d);
  }

  .home-stat-meta {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
  }

  .home-stat-value {
    font-size: $uni-font-size-title;
    font-weight: bold;
    color: $uni-text-color;
  }

  .home-stat-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 4rpx;
  }

  .home-stat-children {
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #e5e5e5;
  }

  .home-stat-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8rpx 0;
  }

  .home-stat-child-label {
    font-size: 26rpx;
    color: $uni-text-color;
  }

  .home-stat-child-value {
    font-size: 26rpx;
    font-weight: bold;
    color: $uni-text-color;
  }
</style>
