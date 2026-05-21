<template>
  <view>
    <list-page ref="listPageRef" :api-fn="scheduleAPi.getFindPage" search-placeholder="搜索日程" search-key="keywords" show-fab @fabClick="goToAdd">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.scheduleId" :options="swipeOptions" @click="onSwipeClick($event, item)">
            <u-cell-item :title="item.title" :label="`${item.startDate} ~ ${item.endDate}`" @click="goToEdit(item.scheduleId)">
              <template #value>
                <text class="schedule-time">{{ item.startTime }}-{{ item.endTime }}</text>
              </template>
            </u-cell-item>
          </u-swipe-action>
        </u-cell-group>
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
  .schedule-time {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
</style>
