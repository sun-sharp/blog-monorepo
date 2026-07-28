<template>
  <view class="user-page">
    <list-page
      ref="listPageRef"
      :api-fn="userApi.getPage"
      search-placeholder="搜索昵称/用户名"
      :search-key="searchKey"
      show-fab
      @fabClick="goToAdd"
      @itemLongpress="onLongPress">
      <template #default="{ list, longpress }">
        <view v-for="item in list" :key="item.userId" class="user-item card" @click="goToEdit(item.userId)" @longpress="longpress(item)">
          <view class="user-item-left">
            <u-avatar :src="item.avatar" size="76" />
            <view class="user-item-info">
              <text class="user-item-name">{{ item.nickname || item.username }}</text>
              <text class="user-item-username">@{{ item.username }}</text>
            </view>
          </view>
          <view class="user-item-right">
            <u-tag :text="item.roleCode" type="primary" size="mini" plain />
            <u-icon name="arrow-right" size="28" color="#ccc" />
          </view>
        </view>
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

  function goToAdd() {
    uni.navigateTo({ url: '/pages/system/user-edit/user-edit' });
  }

  function goToEdit(userId: string) {
    uni.navigateTo({ url: `/pages/system/user-edit/user-edit?id=${userId}` });
  }

  function onLongPress(item: ApiUserItem) {
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

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .user-page {
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
  }

  .user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    margin: 0 20rpx 16rpx;

    &:first-child {
      margin-top: 12rpx;
    }

    &:active {
      opacity: 0.85;
    }
  }

  .user-item-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;
    min-width: 0;
  }

  .user-item-info {
    flex: 1;
    min-width: 0;
  }

  .user-item-name {
    font-size: $uni-font-size-lg;
    font-weight: 500;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-item-username {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
    display: block;
  }

  .user-item-right {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;
  }
</style>
