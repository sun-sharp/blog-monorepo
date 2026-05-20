<template>
  <view class="page">
    <view class="search-bar">
      <u-search v-model="keyword" placeholder="搜索微信账单" @search="onSearch" @custom="onSearch" />
    </view>

    <scroll-view scroll-y class="list-scroll" @scrolltolower="onLoadMore">
      <view class="list-item" v-for="item in dataList" :key="item.weChatId">
        <view class="item-main">
          <view class="item-info">
            <text class="item-title">{{ item.tradeOtherPerson || item.goods }}</text>
            <text class="item-desc">{{ item.tradeTime }} · {{ item.moneyAmount }}</text>
          </view>
          <text :class="['item-amount', item.inflowOrOutflow === 1 ? 'inflow' : 'outflow']">
            {{ item.inflowOrOutflow === 1 ? '+' : '-' }}{{ item.moneyAmount }}
          </text>
        </view>
      </view>
      <u-loadmore :status="loadStatus" />
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { weChatApi } from '@/api';
import { DEFAULT_PAGESIZE } from '@/constant';

const keyword = ref('');
const dataList = ref<any[]>([]);
const current = ref(1);
const total = ref(0);
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');

const fetchData = async (reset = false) => {
  if (reset) { current.value = 1; dataList.value = []; }
  loadStatus.value = 'loading';
  try {
    const res = await weChatApi.getPage({ current: current.value, size: DEFAULT_PAGESIZE, tradeOtherPerson: keyword.value || undefined });
    if (reset) { dataList.value = res.list || []; } else { dataList.value.push(...(res.list || [])); }
    total.value = res.total || 0;
    loadStatus.value = dataList.value.length >= total.value ? 'nomore' : 'loadmore';
  } catch { loadStatus.value = 'loadmore'; }
};

const onSearch = () => fetchData(true);
const onLoadMore = () => { if (loadStatus.value !== 'nomore') { current.value++; fetchData(); } };

onMounted(() => fetchData(true));
</script>

<style lang="scss" scoped>
.page { padding: 20rpx; }
.search-bar { margin-bottom: 20rpx; }
.list-scroll { height: calc(100vh - 120rpx); }
.list-item { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; }
.item-main { display: flex; align-items: center; }
.item-info { flex: 1; }
.item-title { display: block; font-size: 28rpx; color: #303133; }
.item-desc { display: block; font-size: 24rpx; color: #909399; margin-top: 4rpx; }
.item-amount { font-size: 30rpx; font-weight: bold; }
.inflow { color: #19be6b; }
.outflow { color: #fa3534; }
</style>
