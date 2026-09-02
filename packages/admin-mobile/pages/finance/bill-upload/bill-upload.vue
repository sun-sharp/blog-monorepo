<template>
  <u-config-provider :dark-mode="mode">
    <view class="bill-upload-page" :class="{ dark: isDark }">
      <list-page
        ref="listPageRef"
        :api-fn="billUploadApi.getPage"
        :show-search="false"
        :dropdown-items="dropdownItems"
        show-fab
        @fabClick="goToAdd"
        @filterChange="onFilterChange"
        @itemLongpress="onLongPress">
        <template #default="{ list, longpress }">
          <view
            v-for="item in list"
            :key="item.billUploadId"
            class="bill-upload-item card"
            :class="{ dark: isDark }"
            @click="goToEdit(item.billUploadId)"
            @longpress="longpress(item)">
            <view class="bill-upload-item-left">
              <view class="bill-upload-item-icon" :style="{ background: getIconColor(item.billUploadType) }">
                <u-icon :name="getUploadTypeIcon(item.billUploadType)" size="32" color="#fff" />
              </view>
              <view class="bill-upload-item-info">
                <text class="bill-upload-item-title">{{ billUploadTypeMap[item.billUploadType] || '未知类型' }}</text>
                <text class="bill-upload-item-desc">{{ buildLabel(item) }}</text>
              </view>
            </view>
            <view class="bill-upload-item-right">
              <view class="bill-upload-item-tags">
                <u-tag v-if="item.inflowOrOutflow" :text="String(inflowOrOutflowMap[item.inflowOrOutflow] || '')" type="success" size="mini" plain />
                <u-tag v-if="item.billType" :text="getBillTypeLabel(item.billType)" type="warning" size="mini" plain />
                <u-tag v-if="item.billMethod" :text="getBillMethodLabel(item.billMethod)" type="primary" size="mini" plain />
              </view>
              <u-icon name="arrow-right" size="28" color="#ccc" />
            </view>
          </view>
        </template>
      </list-page>
    </view>
  </u-config-provider>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { consumeRefreshFlag } from '../../../composables/useRefreshFlag';
  import { useFilterBackPress } from '../../../composables/useFilterBackPress';
  import { billUploadApi } from '../../../api';
  import {
    aliPayBillUploadType,
    bankBillUploadType,
    billUploadTypeOption,
    handleTypeOption,
    inflowOrOutflowOption,
    weChatBillUploadType,
  } from '../../../../shared/src/constants/api-type';
  import type { ApiBillUploadItem } from '/#/api/blog/bill-upload';
  import { arrEnumToObj } from '../../../../shared/src/utils/array';
  import { useApiTypeStore } from '../../../store';
  import ListPage from '../../../components/list-page/list-page.vue';
  import { useAppTheme } from '../../../composables/useAppTheme';

  const { isDark, mode } = useAppTheme();

  const listPageRef = ref();
  const apiTypeStore = useApiTypeStore();

  useFilterBackPress(listPageRef);

  const billUploadTypeMap = arrEnumToObj(billUploadTypeOption);
  const handleTypeMap = arrEnumToObj(handleTypeOption);
  const inflowOrOutflowMap = arrEnumToObj(inflowOrOutflowOption);

  const selectedHandleType = ref('');

  const dropdownItems = computed(() => {
    const items: any[] = [
      {
        title: '导入类型',
        key: 'billUploadType',
        options: [{ label: '全部', value: '' }, ...billUploadTypeOption],
        value: '',
      },
      {
        title: '处理类型',
        key: 'handleType',
        options: [{ label: '全部', value: '' }, ...handleTypeOption],
        value: selectedHandleType.value,
      },
    ];

    if (selectedHandleType.value === 'inflowOrOutflow') {
      items.push({
        title: '收支',
        key: 'inflowOrOutflow',
        options: [{ label: '全部', value: '' }, ...inflowOrOutflowOption],
        value: '',
      });
    } else if (selectedHandleType.value === 'billType') {
      items.push({
        title: '账单类型',
        key: 'billType',
        options: [{ label: '全部', value: '' }, ...apiTypeStore.getBillTypeOption],
        value: '',
      });
    } else if (selectedHandleType.value === 'billMethod') {
      items.push({
        title: '账单方式',
        key: 'billMethod',
        options: [{ label: '全部', value: '' }, ...apiTypeStore.getBillMethodOption],
        value: '',
      });
    }

    return items;
  });

  function onFilterChange(filters: Record<string, any>) {
    selectedHandleType.value = filters.handleType || '';
  }

  const billTypeLabel = computed(() => {
    const map = new Map<number, string>();
    apiTypeStore.getBillTypeOption.forEach((o) => map.set(o.value, o.label));
    return map;
  });

  const billMethodLabel = computed(() => {
    const map = new Map<number, string>();
    apiTypeStore.getBillMethodOption.forEach((o) => map.set(o.value, o.label));
    return map;
  });

  function getBillTypeLabel(value: number): string {
    return billTypeLabel.value.get(value) || '';
  }

  function getBillMethodLabel(value: number): string {
    return billMethodLabel.value.get(value) || '';
  }

  function buildLabel(item: ApiBillUploadItem): string {
    const parts: string[] = [];
    const handleLabel = handleTypeMap[item.handleType];
    parts.push(String(handleLabel || item.handleType));
    if (item.code) {
      const codePreview = item.code.length > 30 ? item.code.slice(0, 30) + '...' : item.code;
      parts.push(codePreview);
    }
    return parts.join(' · ');
  }

  function getIconColor(type: number) {
    const iconColorMaps = {};
    iconColorMaps[weChatBillUploadType] = 'linear-gradient(135deg, #4facfe, #007aff)';
    iconColorMaps[aliPayBillUploadType] = 'linear-gradient(135deg, #43e97b, #38f9d7)';
    iconColorMaps[bankBillUploadType] = 'linear-gradient(135deg, #fa709a, #fee140)';
    return iconColorMaps[type];
  }

  function getUploadTypeIcon(type: number) {
    const uploadTypeIconMaps = {};
    uploadTypeIconMaps[weChatBillUploadType] = 'weixin-fill';
    uploadTypeIconMaps[aliPayBillUploadType] = 'zhifubao';
    uploadTypeIconMaps[bankBillUploadType] = 'red-packet';
    return uploadTypeIconMaps[type];
  }

  function goToAdd() {
    uni.navigateTo({ url: '/pages/finance/bill-upload-edit/bill-upload-edit' });
  }

  function goToEdit(billUploadId: string) {
    uni.navigateTo({ url: `/pages/finance/bill-upload-edit/bill-upload-edit?id=${billUploadId}` });
  }

  function onLongPress(item: ApiBillUploadItem) {
    uni.showModal({
      title: '确认删除',
      content: '确定删除该上传规则？',
      success: async (res) => {
        if (res.confirm) {
          await billUploadApi.remove(item.billUploadId);
          listPageRef.value?.refresh();
        }
      },
    });
  }

  onMounted(() => {
    Promise.all([apiTypeStore.getBillType(), apiTypeStore.getBillMethod()]);
  });

  onShow(() => {
    if (consumeRefreshFlag('bill-upload')) listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .bill-upload-page {
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;

    &.dark {
      background-color: $uni-bg-color-dark;
    }
  }

  .bill-upload-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    margin-bottom: 16rpx;

    &:active {
      opacity: 0.85;
    }
  }

  .bill-upload-item-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;
    min-width: 0;
  }

  .bill-upload-item-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bill-upload-item-info {
    flex: 1;
    min-width: 0;
  }

  .bill-upload-item-title {
    font-size: $uni-font-size-lg;
    font-weight: 500;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bill-upload-item-desc {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bill-upload-item-right {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;
  }

  .bill-upload-item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    justify-content: flex-end;
    max-width: 200rpx;
  }
</style>
