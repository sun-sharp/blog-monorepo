<template>
  <view class="uric-page">
    <list-page
      ref="listPageRef"
      :api-fn="uricApi.getPage"
      :show-search="false"
      :dropdown-items="dropdownItems"
      show-fab
      @fabClick="goToAdd"
      @itemLongpress="onLongPress">
      <template #default="{ list, longpress }">
        <view v-for="item in list" :key="item.uricId" class="uric-item card" @click="goToEdit(item.uricId)" @longpress="longpress(item)">
          <view class="uric-item-left">
            <view class="uric-item-icon" :style="{ background: getTypeColor(item.measureType) }">
              <u-icon name="arrow-down-left" size="32" color="#fff" />
            </view>
            <view class="uric-item-info">
              <text class="uric-item-label">{{ item.measureTime }}</text>
              <text class="uric-item-type">{{ getTypeLabel(item.measureType) }}</text>
            </view>
          </view>
          <view class="uric-item-right">
            <view class="uric-item-values">
              <text v-if="item.uricAcid != null" class="uric-item-value">尿酸 {{ item.uricAcid }}umol/L</text>
              <text v-if="item.bloodGlucose != null" class="uric-item-value">血糖 {{ item.bloodGlucose }}mmol/L</text>
            </view>
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
  import { consumeRefreshFlag } from '../../../composables/useRefreshFlag';
  import { uricApi } from '../../../api';
  import { measureTypeOption } from '../../../../shared/src/constants/api-type';
  import type { ApiUricItem } from '/#/api/capital/uric';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();

  const dropdownItems = [
    {
      title: '测量方式',
      key: 'measureType',
      options: [{ label: '全部测量方式', value: '' }, ...measureTypeOption],
      value: '',
    },
  ];

  const measureTypeMap: Record<string, string> = {};
  measureTypeOption.forEach((item) => {
    measureTypeMap[item.value] = item.label;
  });

  function getTypeLabel(type: string) {
    return measureTypeMap[type] || type;
  }

  const typeColorMap: Record<string, string> = {};
  const colorPool = [
    'linear-gradient(135deg, #4facfe, #007aff)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #fccb90, #d57eeb)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
  ];

  function getTypeColor(type: string) {
    if (!typeColorMap[type]) {
      typeColorMap[type] = colorPool[Object.keys(typeColorMap).length % colorPool.length];
    }
    return typeColorMap[type];
  }

  function goToAdd() {
    uni.navigateTo({ url: '/pages/system/uric-edit/uric-edit' });
  }

  function goToEdit(uricId: string) {
    uni.navigateTo({ url: `/pages/system/uric-edit/uric-edit?id=${uricId}` });
  }

  function onLongPress(item: ApiUricItem) {
    uni.showModal({
      title: '确认删除',
      content: `确定删除记录「${item.measureTime}」？`,
      success: async (res) => {
        if (res.confirm) {
          await uricApi.remove(item.uricId);
          listPageRef.value?.refresh();
        }
      },
    });
  }

  onShow(() => {
    if (consumeRefreshFlag('uric')) listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .uric-page {
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .uric-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    margin-bottom: 16rpx;

    &:active {
      opacity: 0.85;
    }
  }

  .uric-item-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;
    min-width: 0;
  }

  .uric-item-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .uric-item-info {
    flex: 1;
    min-width: 0;
  }

  .uric-item-label {
    font-size: $uni-font-size-lg;
    font-weight: 500;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .uric-item-type {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
    display: block;
  }

  .uric-item-right {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;
  }

  .uric-item-values {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4rpx;
  }

  .uric-item-value {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
</style>
