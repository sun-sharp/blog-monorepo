<template>
  <view class="page">
    <view class="search-bar">
      <u-search v-model="keyword" placeholder="搜索文章" @search="onSearch" @custom="onSearch" />
    </view>

    <scroll-view scroll-y class="list-scroll" @scrolltolower="onLoadMore">
      <view class="list-item" v-for="item in dataList" :key="item.articleId">
        <view class="item-main">
          <view class="item-info">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-desc">{{ item.authorNickname }} · {{ item.categoryVal }} · {{ item.isPrivate ? '加密' : '公开' }}</text>
          </view>
        </view>
        <view class="item-actions">
          <u-button type="primary" size="mini" text="编辑" @click="onEdit(item)" />
          <u-button type="error" size="mini" text="删除" @click="onRemove(item)" />
        </view>
      </view>
      <u-loadmore :status="loadStatus" />
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { articleAPi } from '@/api';
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
    const res = await articleAPi.getFindPage({ current: current.value, size: DEFAULT_PAGESIZE, keywords: keyword.value || undefined });
    if (reset) { dataList.value = res.list || []; } else { dataList.value.push(...(res.list || [])); }
    total.value = res.total || 0;
    loadStatus.value = dataList.value.length >= total.value ? 'nomore' : 'loadmore';
  } catch { loadStatus.value = 'loadmore'; }
};

const onSearch = () => fetchData(true);
const onLoadMore = () => { if (loadStatus.value !== 'nomore') { current.value++; fetchData(); } };
const onEdit = (item: any) => { uni.$u.toast('文章编辑功能开发中'); };
const onRemove = (item: any) => {
  uni.showModal({ title: '提示', content: `确定删除文章 ${item.title} 吗？`, success: async (res) => { if (res.confirm) { await articleAPi.remove(item.articleId); fetchData(true); } } });
};

onMounted(() => fetchData(true));
</script>

<style lang="scss" scoped>
.page { padding: 20rpx; }
.search-bar { margin-bottom: 20rpx; }
.list-scroll { height: calc(100vh - 120rpx); }
.list-item { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; }
.item-info { flex: 1; }
.item-title { display: block; font-size: 28rpx; color: #303133; font-weight: bold; }
.item-desc { display: block; font-size: 24rpx; color: #909399; margin-top: 4rpx; }
.item-actions { display: flex; gap: 16rpx; margin-top: 16rpx; justify-content: flex-end; }
</style>
