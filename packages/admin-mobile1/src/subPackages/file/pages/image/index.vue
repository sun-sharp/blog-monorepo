<template>
  <view class="page">
    <view class="search-bar">
      <u-search v-model="keyword" placeholder="搜索图片" @search="onSearch" @custom="onSearch" />
    </view>

    <scroll-view scroll-y class="list-scroll" @scrolltolower="onLoadMore">
      <view class="image-grid">
        <view class="image-item" v-for="item in dataList" :key="item.imageId" @click="onPreview(item)" @longpress="onLongPress(item)">
          <image :src="item.url" mode="aspectFill" class="image-thumb" />
          <text class="image-name">{{ item.name }}</text>
        </view>
      </view>
      <u-loadmore :status="loadStatus" />
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { imageApi } from '@/api';
import { DEFAULT_PAGESIZE } from '@/constant';
import { getImgUrl } from '../../../../../shared/src/utils/files';

const keyword = ref('');
const dataList = ref<any[]>([]);
const current = ref(1);
const total = ref(0);
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');

const fetchData = async (reset = false) => {
  if (reset) { current.value = 1; dataList.value = []; }
  loadStatus.value = 'loading';
  try {
    const res = await imageApi.getPage({ current: current.value, size: DEFAULT_PAGESIZE, name: keyword.value || undefined });
    if (reset) { dataList.value = res.list || []; } else { dataList.value.push(...(res.list || [])); }
    total.value = res.total || 0;
    loadStatus.value = dataList.value.length >= total.value ? 'nomore' : 'loadmore';
  } catch { loadStatus.value = 'loadmore'; }
};

const onSearch = () => fetchData(true);
const onLoadMore = () => { if (loadStatus.value !== 'nomore') { current.value++; fetchData(); } };

const onPreview = (item: any) => {
  uni.previewImage({ urls: [getImgUrl(item.url)], current: getImgUrl(item.url) });
};

const onLongPress = (item: any) => {
  uni.showActionSheet({
    itemList: ['删除图片及数据', '仅删除数据'],
    success: async (res) => {
      if (res.tapIndex === 0) {
        await imageApi.removePublicAndData(item.imageId);
      } else {
        await imageApi.removeData(item.imageId);
      }
      fetchData(true);
    },
  });
};

onMounted(() => fetchData(true));
</script>

<style lang="scss" scoped>
.page { padding: 20rpx; }
.search-bar { margin-bottom: 20rpx; }
.list-scroll { height: calc(100vh - 120rpx); }
.image-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.image-item { width: calc(33.33% - 12rpx); background: #fff; border-radius: 12rpx; overflow: hidden; }
.image-thumb { width: 100%; height: 200rpx; }
.image-name { display: block; font-size: 22rpx; color: #606266; padding: 8rpx 12rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
