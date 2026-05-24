<template>
  <view>
    <list-page ref="listPageRef" :api-fn="billUploadApi.getPage" :show-search="false" :dropdown-items="dropdownItems" show-fab @fabClick="goToAdd">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.billUploadId" :options="swipeOptions" @click="onSwipeClick($event, item)">
            <u-cell-item
              :title="billUploadTypeMap[item.billUploadType] || '未知类型'"
              :label="`${handleTypeMap[item.handleType] || item.handleType} · ${item.billJudgeKey}`"
              @click="goToEdit(item.billUploadId)">
              <u-tag :text="item.judgeWay" type="info" size="mini" plain />
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
  import { billUploadApi } from '../../../api';
  import { billUploadTypeOption, handleTypeOption, judgeWayOption } from '../../../../shared/src/constants/api-type';
  import type { ApiBillUploadItem } from '/#/api/blog/bill-upload';
  import { arrEnumToObj } from '../../../../shared/src/utils/array';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();

  const billUploadTypeMap = arrEnumToObj(billUploadTypeOption);
  const handleTypeMap = arrEnumToObj(handleTypeOption);

  const dropdownItems = [
    {
      title: '账单类型',
      key: 'billUploadType',
      options: [{ label: '全部', value: '' }, ...billUploadTypeOption],
      value: '',
    },
    {
      title: '判断方式',
      key: 'judgeWay',
      options: [{ label: '全部', value: '' }, ...judgeWayOption],
      value: '',
    },
  ];

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

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

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>
