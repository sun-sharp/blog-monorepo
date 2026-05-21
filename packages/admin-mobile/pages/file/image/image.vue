<template>
  <view>
    <list-page ref="listPageRef" :api-fn="imageApi.getPage" search-placeholder="搜索图片名称" search-key="name" :dropdown-items="dropdownItems">
      <template #default="{ list }">
        <view class="image-grid">
          <view v-for="item in list" :key="item.imageId" class="image-grid-item">
            <u-swipe-action :options="swipeOptions" @click="onSwipeClick($event, item)">
              <view class="image-card">
                <u-image :src="item.url" width="100%" height="200rpx" mode="aspectFill" :fade="true" />
                <view class="image-card-info">
                  <text class="image-card-name text-ellipsis">{{ item.name }}</text>
                  <text class="image-card-meta">{{ item.imageType }} · {{ item.uploadTime?.slice(0, 10) }}</text>
                </view>
              </view>
            </u-swipe-action>
          </view>
        </view>
      </template>
    </list-page>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { imageApi } from '../../../api';
  import { useApiTypeStore } from '../../../store';
  import type { ApiImageItem } from '/#/api/capital/image';
  import ListPage from '../../../components/list-page/list-page.vue';

  const apiTypeStore = useApiTypeStore();
  const listPageRef = ref();

  const imageSourceOption = computed(() => apiTypeStore.getImageSourceOption);

  const dropdownItems = computed(() => [
    {
      title: '来源',
      key: 'source',
      options: [{ label: '全部来源', value: '' }, ...imageSourceOption.value],
      value: '',
    },
  ]);

  const swipeOptions = [{ text: '删除', style: { backgroundColor: '#dd524d' } }];

  function onSwipeClick(event: any, item: ApiImageItem) {
    if (event.index === 0) {
      uni.showModal({
        title: '确认删除',
        content: item.exists ? '将删除图片文件和数据' : '仅删除数据记录',
        success: async (res) => {
          if (res.confirm) {
            if (item.exists) {
              await imageApi.removePublicAndData(item.imageId);
            } else {
              await imageApi.removeData(item.imageId);
            }
            listPageRef.value?.refresh();
          }
        },
      });
    }
  }

  onMounted(() => {
    apiTypeStore.getImageSource();
  });

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    padding: 0 10rpx;
  }

  .image-grid-item {
    width: calc(50% - 8rpx);
  }

  .image-card {
    background-color: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    overflow: hidden;
  }

  .image-card-info {
    padding: 12rpx 16rpx;
  }

  .image-card-name {
    font-size: $uni-font-size-sm;
    display: block;
  }

  .image-card-meta {
    font-size: 20rpx;
    color: $uni-text-color-grey;
    display: block;
    margin-top: 4rpx;
  }
</style>
