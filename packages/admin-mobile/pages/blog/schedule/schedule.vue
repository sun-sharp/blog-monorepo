<template>
  <view class="schedule-page">
    <list-page ref="listPageRef" :api-fn="scheduleAPi.getFindPage" search-placeholder="搜索日程" search-key="keywords" show-fab @fabClick="goToAdd">
      <view class="schedule-list">
        <u-swipe-action v-for="item in list" :key="item.scheduleId" :options="swipeOptions" @click="onSwipeClick($event, item)">
          <view class="schedule-item card" @click="goToEdit(item.scheduleId)">
            <view class="schedule-item-header">
              <text class="schedule-item-title">{{ item.title }}</text>
            </view>
            <view class="schedule-item-time">
              <u-icon name="calendar" size="24" color="#007aff" />
              <text class="schedule-item-date">{{ item.startDate }} ~ {{ item.endDate }}</text>
            </view>
            <view v-if="item.startTime || item.endTime" class="schedule-item-time">
              <u-icon name="clock" size="24" color="#f0ad4e" />
              <text class="schedule-item-date">{{ item.startTime }} - {{ item.endTime }}</text>
            </view>
          </view>
        </u-swipe-action>
      </view>
    </list-page>
  </view>
</template>

<script lang="ts" setup>
  import { ref, inject } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { scheduleAPi } from '../../../api';
  import type { ApiScheduleItem } from '/#/api/blog/schedule';
  import ListPage from '../../../components/list-page/list-page.vue';
  import { listPageListKey } from '../../../components/list-page/list-page-key';

  const listPageRef = ref();
  const list = inject(listPageListKey, ref([]));

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

  function goToAdd() {
    uni.navigateTo({ url: '/pages/blog/schedule-edit/schedule-edit' });
  }

  function goToEdit(scheduleId: string) {
    uni.navigateTo({ url: `/pages/blog/schedule-edit/schedule-edit?id=${scheduleId}` });
  }

  function onSwipeClick(event: any, item: ApiScheduleItem) {
    const index = event.index;
    if (index === 0) {
      goToEdit(item.scheduleId);
    } else if (index === 1) {
      uni.showModal({
        title: '确认删除',
        content: `确定删除日程「${item.title}」？`,
        success: async (res) => {
          if (res.confirm) {
            await scheduleAPi.remove(item.scheduleId);
            listPageRef.value?.refresh();
          }
        },
      });
    }
  }

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .schedule-page {
    background-color: $uni-bg-color-grey;
  }

  .schedule-list {
    padding: 0 10rpx;
  }

  .schedule-item {
    margin-bottom: 16rpx;
  }

  .schedule-item-header {
    display: flex;
    align-items: center;
  }

  .schedule-item-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    flex: 1;
  }

  .schedule-item-time {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-top: 12rpx;
  }

  .schedule-item-date {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
</style>
