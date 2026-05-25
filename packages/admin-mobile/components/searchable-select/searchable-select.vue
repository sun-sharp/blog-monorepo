<template>
  <u-popup :model-value="modelValue" mode="bottom" length="70%" :safe-area-inset-bottom="true" :border-radius="24" :z-index="10075" @close="handleClose">
    <view class="ss-popup">
      <view class="ss-header">
        <text class="ss-title">{{ title }}</text>
        <view class="ss-close" @click="handleClose">
          <u-icon name="close" size="36" color="#999" />
        </view>
      </view>
      <view class="ss-search">
        <u-search
          v-model="searchText"
          placeholder="搜索选项"
          shape="round"
          :show-action="false"
          @search="onSearch"
          @clear="onSearchClear"
          @change="onSearchChange" />
      </view>
      <scroll-view scroll-y class="ss-list">
        <view
          v-for="item in filteredList"
          :key="item.value"
          class="ss-list-item"
          :class="{ 'ss-list-item--selected': isSelected(item) }"
          @click="onSelect(item)">
          <text class="ss-list-item-label">{{ item.label }}</text>
          <u-icon v-if="isSelected(item)" name="checkmark" size="36" color="#007aff" />
        </view>
        <view v-if="filteredList.length === 0" class="ss-empty">
          <u-empty mode="search" text="无匹配选项" icon-size="80" />
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';

  interface SelectOption {
    label: string;
    value: number | string;
    [key: string]: string | number;
  }

  const props = withDefaults(
    defineProps<{
      modelValue: boolean;
      title?: string;
      list?: SelectOption[];
      currentValue?: number | string;
      labelKey?: string;
      valueKey?: string;
    }>(),
    {
      title: '请选择',
      list: () => [],
      labelKey: 'label',
      valueKey: 'value',
    }
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'confirm', item: SelectOption): void;
  }>();

  const searchText = ref('');

  const filteredList = computed(() => {
    if (!searchText.value) return props.list;
    const keyword = searchText.value.toLowerCase();
    return props.list.filter((item) =>
      String(item.label || '')
        .toLowerCase()
        .includes(keyword)
    );
  });

  function isSelected(item: SelectOption) {
    return item.value === props.currentValue;
  }

  function onSelect(item: SelectOption) {
    emit('confirm', item);
    emit('update:modelValue', false);
  }

  function handleClose() {
    emit('update:modelValue', false);
  }

  function onSearch() {
    // search already handled by computed
  }

  function onSearchChange() {
    // search already handled by computed
  }

  function onSearchClear() {
    searchText.value = '';
  }

  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        searchText.value = '';
      }
    }
  );
</script>

<style lang="scss" scoped>
  .ss-popup {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;
    overflow: hidden;
  }

  .ss-header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 32rpx 30rpx 16rpx;
  }

  .ss-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;
  }

  .ss-close {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f5f5f5;
  }

  .ss-search {
    padding: 0 24rpx 12rpx;
  }

  .ss-list {
    flex: 1;
    height: 0;
  }

  .ss-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:active {
      background-color: #f8f8f8;
    }

    &--selected {
      background-color: #e8f4fd;

      .ss-list-item-label {
        color: #007aff;
        font-weight: 500;
      }
    }
  }

  .ss-list-item-label {
    font-size: 30rpx;
    color: $uni-text-color;
  }

  .ss-empty {
    padding-top: 120rpx;
  }
</style>
