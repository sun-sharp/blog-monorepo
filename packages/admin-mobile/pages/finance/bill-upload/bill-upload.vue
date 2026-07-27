<template>
  <view style="height: 100%">
    <list-page ref="listPageRef" :api-fn="billUploadApi.getPage" :show-search="false" :dropdown-items="dropdownItems" show-fab @fabClick="goToAdd">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.billUploadId" :options="swipeOptions" @click="onSwipeClick($event, item)">
            <u-cell-item :title="String(billUploadTypeMap[item.billUploadType] || '未知类型')" :label="buildLabel(item)" @click="goToEdit(item.billUploadId)">
              <view class="bill-upload-tags">
                <u-tag v-if="item.inflowOrOutflow" :text="String(inflowOrOutflowMap[item.inflowOrOutflow] || '')" type="success" size="mini" plain />
                <u-tag v-if="item.billType" :text="getBillTypeLabel(item.billType)" type="warning" size="mini" plain />
                <u-tag v-if="item.billMethod" :text="getBillMethodLabel(item.billMethod)" type="primary" size="mini" plain />
              </view>
            </u-cell-item>
          </u-swipe-action>
        </u-cell-group>
      </template>
    </list-page>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { billUploadApi } from '../../../api';
  import { billUploadTypeOption, handleTypeOption, inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';
  import type { ApiBillUploadItem } from '/#/api/blog/bill-upload';
  import { arrEnumToObj } from '../../../../shared/src/utils/array';
  import { useApiTypeStore } from '../../../store';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();
  const apiTypeStore = useApiTypeStore();

  const billUploadTypeMap = arrEnumToObj(billUploadTypeOption);
  const handleTypeMap = arrEnumToObj(handleTypeOption);
  const inflowOrOutflowMap = arrEnumToObj(inflowOrOutflowOption);

  const dropdownItems = [
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
      value: '',
    },
  ];

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

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

  function goToAdd() {
    uni.navigateTo({ url: '/pages/finance/bill-upload-edit/bill-upload-edit' });
  }

  function goToEdit(billUploadId: string) {
    uni.navigateTo({ url: `/pages/finance/bill-upload-edit/bill-upload-edit?id=${billUploadId}` });
  }

  function onSwipeClick(event: any, item: ApiBillUploadItem) {
    const index = event.index;
    if (index === 0) {
      goToEdit(item.billUploadId);
    } else if (index === 1) {
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
  }

  onMounted(() => {
    Promise.all([apiTypeStore.getBillType(), apiTypeStore.getBillMethod()]);
  });

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .bill-upload-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    justify-content: flex-end;
  }
</style>
