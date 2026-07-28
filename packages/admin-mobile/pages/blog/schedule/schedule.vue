<template>
  <view class="schedule-page">
    <list-page
      ref="listPageRef"
      :api-fn="scheduleAPi.getFindPage"
      search-placeholder="搜索日程"
      search-key="keywords"
      show-fab
      @fabClick="goToAdd"
      @itemLongpress="onLongPress">
      <template #default="{ list, longpress }">
        <view v-for="item in list" :key="item.scheduleId" class="schedule-item card" @click="goToEdit(item.scheduleId)" @longpress="longpress(item)">
          <view class="schedule-item-header">
            <view class="schedule-item-icon">
              <u-icon name="calendar" size="32" color="#fff" />
            </view>
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
      </template>
    </list-page>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { scheduleAPi } from '../../../api';
  import type { ApiScheduleItem } from '/#/api/blog/schedule';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();

  function goToAdd() {
    uni.navigateTo({ url: '/pages/blog/schedule-edit/schedule-edit' });
  }

  function goToEdit(scheduleId: string) {
    uni.navigateTo({ url: `/pages/blog/schedule-edit/schedule-edit?id=${scheduleId}` });
  }

  function onLongPress(item: ApiScheduleItem) {
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

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .schedule-page {
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .schedule-item {
    margin-bottom: 16rpx;

    &:active {
      opacity: 0.85;
    }
  }

  .schedule-item-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  .schedule-item-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 16rpx;
    background: linear-gradient(135deg, #4facfe, #007aff);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .schedule-item-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
