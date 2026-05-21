<template>
  <view>
    <list-page ref="listPageRef" :api-fn="userApi.getPage" search-placeholder="搜索昵称/用户名" :search-key="searchKey" show-fab @fabClick="goToAdd">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.userId" :options="swipeOptions" @click="onSwipeClick($event, item)">
            <u-cell-item :title="item.nickname || item.username" :label="item.username" @click="goToEdit(item.userId)">
              <template #icon>
                <u-avatar :src="item.avatar" size="40" />
              </template>
              <template #value>
                <u-tag :text="item.roleCode" type="primary" size="mini" plain />
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
  import { userApi } from '../../../api';
  import type { ApiUserItem } from '/#/api/capital/user';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();
  const searchKey = 'nickname';

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

  function goToAdd() {
    uni.navigateTo({ url: '/pages/system/user-edit/user-edit' });
  }

  function goToEdit(userId: string) {
    uni.navigateTo({ url: `/pages/system/user-edit/user-edit?id=${userId}` });
  }

  function onSwipeClick(event: any, item: ApiUserItem) {
    const index = event.index;
    if (index === 0) {
      goToEdit(item.userId);
    } else if (index === 1) {
      uni.showModal({
        title: '确认删除',
        content: `确定删除用户「${item.nickname || item.username}」？`,
        success: async (res) => {
          if (res.confirm) {
            await userApi.remove(item.userId);
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
