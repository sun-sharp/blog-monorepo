<template>
  <view>
    <list-page ref="listPageRef" :api-fn="weChatApi.getPage" search-placeholder="搜索交易对方" search-key="tradeOtherPerson" :dropdown-items="dropdownItems">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.weChatId" :options="swipeOptions" @click="onSwipeClick($event, item)">
            <u-cell-item :title="item.tradeOtherPerson" :label="item.tradeOtherPersonRemarks">
              <template #value>
                <view class="money-amount">
                  <text :class="item.inflowOrOutflow === 1 ? 'money-inflow' : 'money-outflow'">
                    {{ item.inflowOrOutflow === 1 ? '+' : '-' }}¥{{ item.moneyAmount }}
                  </text>
                  <text class="money-balance">余额: ¥{{ item.balance }}</text>
                </view>
              </template>
            </u-cell-item>
          </u-swipe-action>
        </u-cell-group>
      </template>
    </list-page>

    <view class="wechat-actions">
      <u-button size="small" type="primary" plain @click="handleBalance">处理零钱</u-button>
    </view>

    <money-time-select v-model:show="showTimeSelect" @confirm="onTimeSelectConfirm" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { weChatApi } from '../../../api';
  import { inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';
  import { useApiTypeStore } from '../../../store';
  import type { ApiWeChatItem } from '/#/api/blog/money/we-chat';
  import ListPage from '../../../components/list-page/list-page.vue';
  import MoneyTimeSelect from '../../../components/money-time-select/money-time-select.vue';

  const apiTypeStore = useApiTypeStore();
  const listPageRef = ref();
  const showTimeSelect = ref(false);

  const dropdownItems = computed(() => [
    {
      title: '收支',
      key: 'inflowOrOutflow',
      options: [{ label: '全部', value: '' }, ...inflowOrOutflowOption],
      value: '',
    },
  ]);

  const swipeOptions = [{ text: '编辑', style: { backgroundColor: '#007aff' } }];

  function onSwipeClick(event: any, item: ApiWeChatItem) {
    if (event.index === 0) {
      uni.navigateTo({ url: `/pages/money/we-chat-edit/we-chat-edit?id=${item.weChatId}` });
    }
  }

  function handleBalance() {
    showTimeSelect.value = true;
  }

  async function onTimeSelectConfirm(params: { startTime: string; endTime: string }) {
    try {
      await weChatApi.updateBalance(params);
      uni.showToast({ title: '处理成功', icon: 'success' });
      listPageRef.value?.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  onMounted(() => {
    apiTypeStore.getBillType();
    apiTypeStore.getBillMethod();
  });

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .money-amount {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .money-balance {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 4rpx;
  }

  .wechat-actions {
    position: fixed;
    right: 20rpx;
    bottom: calc(40rpx + env(safe-area-inset-bottom));
    z-index: 99;
  }
</style>
