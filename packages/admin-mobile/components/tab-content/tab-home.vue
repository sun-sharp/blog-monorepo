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
        <view v-for="item in statItems" :key="item.label" class="home-stat-card">
          <view class="home-stat-main" :class="{ 'home-stat-main-clickable': item.url || item.tab !== undefined }" @click="onStatClick(item)">
            <view :class="['home-stat-icon', item.theme]">
              <u-icon v-if="item.iconType === 'sharp-icon'" :name="item.icon" size="36" color="#fff" custom-prefix="sharp-icon" />
              <u-icon v-else :name="item.icon" size="36" color="#fff" />
            </view>
            <view class="home-stat-meta">
              <text class="home-stat-value">{{ item.value }}</text>
              <text class="home-stat-label">{{ item.label }}</text>
            </view>
            <u-icon v-if="item.url || item.tab !== undefined" name="arrow-right" size="28" color="#ccc" />
          </view>
          <view v-if="item.children && item.children.length > 0" class="home-stat-children">
            <u-grid :col="item.gridCol || 2" :border="false">
              <u-grid-item v-for="child in item.children" :key="child.label" style="background-color: none" @click="onStatChildrenClick(child)">
                <view class="home-stat-child-icon" :class="child.theme || 'nav-icon-green'">
                  <u-icon v-if="child.iconType === 'sharp-icon'" :name="child.icon" size="36" color="#fff" custom-prefix="sharp-icon" />
                  <u-icon v-else :name="child.icon" size="36" color="#fff" />
                </view>
                <text class="home-stat-child-label">{{ child.label }}</text>
                <text class="home-stat-child-value">{{ child.count }}</text>
              </u-grid-item>
            </u-grid>
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

  interface StatCardChildItem {
    label: string;
    count: number;
    icon?: string;
    iconType?: string;
    theme?: string;
    url?: string;
    tab?: number;
    source?: string;
    bankType?: number;
    query?: string;
  }

  interface StatCardItem {
    icon: string;
    iconType?: string;
    label: string;
    value: number;
    theme: string;
    url?: string;
    tab?: number;
    gridCol?: number;
    children?: StatCardChildItem[];
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
      const typeIcon = financialSourceIcon(item.source);
      const typeItem: StatCardChildItem = {
        label: item.label,
        count: item.count,
        ...typeIcon,
        tab: 2,
        source: item.source,
      };
      financialChildren.push(typeItem);
      (item.children || []).forEach((child: ApiHomeStatFinancialTypeCount) => {
        const bankType = Number(child.source.replace('bank_', ''));
        financialChildren.push({
          label: child.label,
          count: child.count,
          ...childSourceIcon(child.source),
          tab: 2,
          source: 'bank',
          bankType: Number.isNaN(bankType) ? undefined : bankType,
        });
      });
    });

    const imageCount = (d.imageTypeCount || []).reduce((sum, m) => sum + m.count, 0);
    const imageChildren: StatCardItem['children'] = (d.imageSourceCount || []).map((item: ApiHomeStatImageSourceCount) => ({
      label: item.label,
      count: item.count,
      ...imageSourceIcon(item.source),
      url: '/pages/file/image/image',
      query: `source=${item.source}`,
    }));

    return [
      {
        icon: 'red-packet',
        iconType: 'sharp-icon',
        label: '财务账单',
        value: d.financialCount,
        theme: 'theme-blue',
        tab: 2,
        gridCol: 4,
        children: financialChildren,
      },
      {
        icon: 'book',
        iconType: 'sharp-icon',
        label: '文章',
        value: d.articleCount,
        theme: 'theme-green',
        tab: 1,
      },
      {
        icon: 'tupian',
        iconType: 'sharp-icon',
        label: '图片',
        value: imageCount,
        theme: 'theme-orange',
        url: '/pages/file/image/image',
        gridCol: 2,
        children: imageChildren,
      },
      {
        icon: 'blood-sugar',
        iconType: 'sharp-icon',
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
        icon: 'role',
        iconType: 'sharp-icon',
        label: '角色',
        value: d.roleCount,
        theme: 'theme-purple',
        url: '/pages/system/role/role',
      },
      {
        icon: 'caidanguanli',
        iconType: 'sharp-icon',
        label: '菜单',
        value: d.menuCount,
        theme: 'theme-blue',
      },
      {
        icon: 'API',
        iconType: 'sharp-icon',
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

  function onStatChildrenClick(child: StatCardChildItem) {
    if (child.tab !== undefined) {
      emitSwitchTab({ target: child.tab, source: child.source, bankType: child.bankType });
      return;
    }
    if (child.url) {
      navigateTo(child.query ? `${child.url}?${child.query}` : child.url);
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

  function financialSourceIcon(source: string): { icon: string; iconType?: string; theme: string } {
    const bankMap: Record<string, { icon: string; iconType?: string; theme: string }> = {
      '1': { icon: 'gongshangyinhang', iconType: 'sharp-icon', theme: 'theme-orange' },
      '2': { icon: 'nongyeyinxing', iconType: 'sharp-icon', theme: 'theme-orange' },
      '3': { icon: 'jiansheyinxing', iconType: 'sharp-icon', theme: 'theme-orange' },
      '4': { icon: 'minshengyinxing', iconType: 'sharp-icon', theme: 'theme-orange' },
      '5': { icon: 'book', iconType: 'sharp-icon', theme: 'theme-orange' },
    };
    if (source.startsWith('bank_')) {
      const bankIcon = bankMap[source.slice(5)];
      if (bankIcon) return bankIcon;
    }
    switch (source) {
      case 'weChat':
        return { icon: 'weixin-fill', theme: 'theme-orange' };
      case 'aliPay':
        return { icon: 'zhifubao', theme: 'theme-orange' };
      case 'bank':
        return { icon: 'red-packet', theme: 'theme-orange' };
      default:
        return { icon: 'red-packet', theme: 'theme-orange' };
    }
  }

  function childSourceIcon(source: string): { icon: string; iconType?: string; theme: string } {
    return financialSourceIcon(source);
  }

  function imageSourceIcon(source: string): { icon: string; iconType?: string; theme: string } {
    switch (source) {
      case 'user':
        return { icon: 'account', theme: 'theme-green' };
      case 'article':
        return { icon: 'book', iconType: 'sharp-icon', theme: 'theme-green' };
      default:
        return { icon: 'tupian', iconType: 'sharp-icon', theme: 'theme-green' };
    }
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
    font-size: 30rpx;
    font-weight: 700;
    color: #1f2937;
  }

  .home-section-title-row {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  .nav-icon-wrap {
    width: 88rpx;
    height: 88rpx;
    border-radius: 26rpx;
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
    font-size: 26rpx;
    font-weight: 600;
    color: #374151;
    margin-top: 14rpx;
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
    // border-radius: 16rpx;
    // background-color: #f7f8fa;
  }

  .home-stat-main {
    display: flex;
    align-items: center;
    border-radius: 16rpx;
    padding: 24rpx;
    background-color: #eef1f5;
  }

  // .home-stat-main-clickable:active {
  //   background-color: #eef1f5;
  // }

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

  .home-stat-meta {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
  }

  .home-stat-value {
    font-size: 36rpx;
    font-weight: 700;
    color: $uni-text-color;
  }

  .home-stat-label {
    font-size: 24rpx;
    font-weight: 500;
    color: #6b7280;
    margin-top: 6rpx;
  }

  .home-stat-children {
    margin-top: 16rpx;
    padding: 16rpx 24rpx;
    border-top: 1rpx solid #e5e5e5;
  }

  .home-stat-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8rpx 0;
  }

  .home-stat-child-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  .home-stat-child-label {
    font-size: 24rpx;
    font-weight: 500;
    color: #6b7280;
    margin-top: 12rpx;
    text-align: center;
  }

  .home-stat-child-value {
    font-size: 26rpx;
    font-weight: 700;
    color: $uni-text-color;
    margin-top: 2rpx;
    text-align: center;
  }
</style>
