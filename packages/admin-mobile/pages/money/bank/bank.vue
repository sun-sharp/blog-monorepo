<template>
  <view>
    <list-page ref="listPageRef" :api-fn="bankApi.getPage" search-placeholder="搜索交易对方" search-key="tradeOtherPerson" :dropdown-items="dropdownItems">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.bankId" :options="swipeOptions" @click="onSwipeClick($event, item)">
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
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { bankApi } from '../../../api';
  import { inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';
  import { useApiTypeStore } from '../../../store';
  import type { ApiBankItem } from '/#/api/blog/money/bank';
  import ListPage from '../../../components/list-page/list-page.vue';

  const apiTypeStore = useApiTypeStore();
  const listPageRef = ref();

  const bankTypeOption = computed(() => apiTypeStore.getBankTypeOption);

  const dropdownItems = computed(() => [
    {
      title: '收支',
      key: 'inflowOrOutflow',
      options: [{ label: '全部', value: '' }, ...inflowOrOutflowOption],
      value: '',
    },
    {
      title: '银行',
      key: 'bankType',
      options: [{ label: '全部', value: '' }, ...bankTypeOption.value],
      value: '',
    },
  ]);

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

  function onSwipeClick(event: any, item: ApiBankItem) {
    const index = event.index;
    if (index === 0) {
      uni.navigateTo({ url: `/pages/money/bank-edit/bank-edit?id=${item.bankId}` });
    } else if (index === 1) {
      uni.showModal({
        title: '确认删除',
        content: '确定删除该银行账单？',
        success: async (res) => {
          if (res.confirm) {
            await bankApi.remove(item.bankId);
            listPageRef.value?.refresh();
          }
        },
      });
    }
  }

  onMounted(() => {
    apiTypeStore.getBankType();
    apiTypeStore.getBillType();
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
</style>
