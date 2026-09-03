<template>
  <view class="finance-page">
    <view class="finance-header card">
      <view class="finance-summary-row">
        <view class="finance-summary-item">
          <text class="finance-summary-label">总收入</text>
          <text class="finance-summary-value money-inflow">¥{{ inflowTotal }}</text>
        </view>
        <view class="finance-summary-divider" />
        <view class="finance-summary-item">
          <text class="finance-summary-label">总支出</text>
          <text class="finance-summary-value money-outflow">¥{{ outflowTotal }}</text>
        </view>
      </view>
    </view>

    <view class="finance-toolbar">
      <u-search
        v-model="keyword"
        placeholder="搜索交易对方/说明"
        shape="round"
        :show-action="true"
        action-text="搜索"
        @search="handleSearch"
        @custom="handleSearch"
        @clear="handleClear" />
      <view class="finance-toolbar-actions">
        <view class="finance-toolbar-btn" @click="showTimeSelect = true">
          <u-icon name="calendar" size="36" :color="timeLabel ? '#007aff' : '#666'" />
        </view>
        <view class="finance-toolbar-btn" @click="openFilterPopup">
          <u-icon name="setting" size="36" :color="hasActiveFilter ? '#007aff' : '#666'" />
        </view>
      </view>
    </view>

    <view v-if="timeLabel || hasActiveFilter" class="finance-filter">
      <view v-if="timeLabel" class="finance-filter-time-tag" @click="clearTimeRange">
        <u-icon name="calendar" size="24" color="#007aff" />
        <text class="finance-filter-time-text">{{ timeLabel }}</text>
        <u-icon name="close" size="24" color="#999" />
      </view>
      <view v-for="tag in activeFilterTags" :key="tag.field" class="finance-filter-time-tag" @click="clearFilterTag(tag.field)">
        <text class="finance-filter-time-text">{{ tag.label }}</text>
        <u-icon name="close" size="24" color="#999" />
      </view>
    </view>

    <scroll-view
      scroll-y
      class="finance-list-scroll"
      :style="scrollStyle"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      refresher-default-style="black"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom">
      <view v-if="loading && list.length === 0" class="finance-loading">
        <u-loading mode="circle" size="60" />
        <text class="finance-loading-text">加载中...</text>
      </view>
      <view v-if="!loading && list.length === 0" class="finance-empty">
        <u-empty mode="data" text="暂无账单" icon-size="160" />
      </view>
      <view v-if="list.length > 0" class="finance-list">
        <template v-for="(group, date) in groupedByDate" :key="date">
          <view class="finance-date-header">
            <text class="finance-date-text">{{ date }}</text>
          </view>
          <view v-for="item in group" :key="`${item.source}_${item.billId}`" class="finance-bill-item card" @click="goToDetail(item)">
            <view class="finance-bill-left">
              <view :class="['finance-bill-icon', item.inflowOrOutflow === 1 ? 'finance-bill-icon-in' : 'finance-bill-icon-out']">
                <u-icon :name="getSourceIcon(item.source)" size="32" color="#fff" />
              </view>
              <view class="finance-bill-info">
                <text class="finance-bill-title">{{ item.tradeOtherPerson || item.explain || '--' }}</text>
                <view class="finance-bill-sub-row">
                  <text class="finance-bill-sub">{{ getSourceLabel(item.source) }} · {{ item.tradeTime?.slice(11, 19) || '' }}</text>
                </view>
                <view class="finance-bill-sub-row">
                  <text v-if="getBalanceLabel(item)" class="finance-bill-balance">余额 ¥{{ formatMoney(getBalanceValue(item)) }}</text>
                  <text v-if="getBalanceBabyLabel(item)" class="finance-bill-balance">余额宝 ¥{{ formatMoney(getBalanceBabyValue(item)) }}</text>
                </view>
                <view
                  v-if="['aliPay', 'weChat'].includes(item.source) && (getBillTypeLabel(item) || getBillMethodLabel(item))"
                  class="finance-bill-sub-tag-row">
                  <text v-if="getBillTypeLabel(item)" class="finance-bill-tag">{{ getBillTypeLabel(item) }}</text>
                  <text v-if="getBillMethodLabel(item)" class="finance-bill-tag">{{ getBillMethodLabel(item) }}</text>
                </view>
                <view v-if="['bank'].includes(item.source) && (getBillTypeLabel(item) || getBillBankTypeLabel(item))" class="finance-bill-sub-tag-row">
                  <text v-if="getBillTypeLabel(item)" class="finance-bill-tag">{{ getBillTypeLabel(item) }}</text>
                  <text v-if="getBillBankTypeLabel(item)" class="finance-bill-tag">{{ getBillBankTypeLabel(item) }}</text>
                </view>
                <view v-if="['manual'].includes(item.source) && (getBillTypeLabel(item) || getBillMethodLabel(item))" class="finance-bill-sub-tag-row">
                  <text v-if="getBillTypeLabel(item)" class="finance-bill-tag">{{ getBillTypeLabel(item) }}</text>
                  <text v-if="getBillMethodLabel(item)" class="finance-bill-tag">{{ getBillMethodLabel(item) }}</text>
                </view>
              </view>
            </view>
            <view class="finance-bill-right">
              <text :class="item.inflowOrOutflow === 1 ? 'money-inflow' : 'money-outflow'" class="finance-bill-amount">
                {{ item.inflowOrOutflow === 1 ? '+' : '-' }}¥{{ formatMoney(item.moneyAmount) }}
              </text>
            </view>
          </view>
        </template>
        <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
      </view>
    </scroll-view>

    <view class="tab-finance-fab" @click="showFabMenu = !showFabMenu">
      <u-icon name="plus" size="44" color="#fff" />
    </view>
    <u-popup :model-value="showFabMenu" mode="bottom" :border-radius="24" :safe-area-inset-bottom="true" @close="showFabMenu = false">
      <view class="finance-fab-popup">
        <view class="finance-fab-popup-header">
          <text class="finance-fab-popup-title">快捷操作</text>
          <view class="finance-fab-popup-close" @click="showFabMenu = false">
            <u-icon name="close" size="36" color="#999" />
          </view>
        </view>
        <view class="finance-fab-popup-body">
          <view class="finance-fab-action-item" @click="onFabAction('manual')">
            <view class="finance-fab-action-icon" style="background-color: #eef2ff">
              <u-icon name="edit-pen" size="40" color="#6366f1" />
            </view>
            <view class="finance-fab-action-content">
              <text class="finance-fab-action-label">录入账单</text>
              <text class="finance-fab-action-desc">人工录入一条账单</text>
            </view>
            <u-icon name="arrow-right" size="32" color="#ccc" />
          </view>
          <view class="finance-fab-action-item" @click="onFabAction('upload')">
            <view class="finance-fab-action-icon" style="background-color: #e8f4fd">
              <u-icon name="download" size="40" color="#007aff" />
            </view>
            <view class="finance-fab-action-content">
              <text class="finance-fab-action-label">导入账单</text>
              <text class="finance-fab-action-desc">上传银行/支付宝/微信账单</text>
            </view>
            <u-icon name="arrow-right" size="32" color="#ccc" />
          </view>
          <view class="finance-fab-action-item" @click="onFabAction('summary')">
            <view class="finance-fab-action-icon" style="background-color: #fef5e0">
              <u-icon name="grid" size="40" color="#f0ad4e" />
            </view>
            <view class="finance-fab-action-content">
              <text class="finance-fab-action-label">财务汇总</text>
              <text class="finance-fab-action-desc">查看收支统计与图表分析</text>
            </view>
            <u-icon name="arrow-right" size="32" color="#ccc" />
          </view>
          <view class="finance-fab-action-item" @click="onFabAction('weChatBalance')">
            <view class="finance-fab-action-icon" style="background-color: #e8faf0">
              <u-icon name="weixin-fill" size="40" color="#07c160" />
            </view>
            <view class="finance-fab-action-content">
              <text class="finance-fab-action-label">处理零钱余额</text>
              <text class="finance-fab-action-desc">按时间范围处理微信零钱余额</text>
            </view>
            <u-icon name="arrow-right" size="32" color="#ccc" />
          </view>
          <view class="finance-fab-action-item" @click="onFabAction('aliPayBalance')">
            <view class="finance-fab-action-icon" style="background-color: #e8f4fd">
              <u-icon name="zhifubao" size="40" color="#1677ff" />
            </view>
            <view class="finance-fab-action-content">
              <text class="finance-fab-action-label">处理支付宝余额</text>
              <text class="finance-fab-action-desc">按时间范围处理支付宝余额</text>
            </view>
            <u-icon name="arrow-right" size="32" color="#ccc" />
          </view>
          <view class="finance-fab-action-item" @click="onFabAction('aliPayBalanceBaby')">
            <view class="finance-fab-action-icon" style="background-color: #fff3e0">
              <u-icon name="rmb-circle" size="40" color="#ff9900" />
            </view>
            <view class="finance-fab-action-content">
              <text class="finance-fab-action-label">处理余额宝</text>
              <text class="finance-fab-action-desc">按时间范围处理支付宝余额宝</text>
            </view>
            <u-icon name="arrow-right" size="32" color="#ccc" />
          </view>
        </view>
      </view>
    </u-popup>

    <u-popup :model-value="showFilterPopup" mode="bottom" :border-radius="24" :safe-area-inset-bottom="true" @close="showFilterPopup = false">
      <view class="finance-filter-popup">
        <view class="finance-filter-popup-header">
          <text class="finance-filter-popup-title">筛选</text>
          <view class="finance-filter-popup-close" @click="showFilterPopup = false">
            <u-icon name="close" size="36" color="#999" />
          </view>
        </view>
        <scroll-view scroll-y class="finance-filter-popup-body">
          <view class="finance-filter-popup-row">
            <text class="finance-filter-popup-label">来源</text>
            <u-subsection
              :list="sourceOptions"
              :current="currentSource"
              mode="button"
              active-color="#007aff"
              inactive-color="#666666"
              bg-color="#f5f5f5"
              size="mini"
              @change="onSourceChange" />
          </view>
          <view class="finance-filter-popup-row">
            <text class="finance-filter-popup-label">收支</text>
            <u-subsection
              :list="flowOptions"
              :current="currentFlow"
              mode="button"
              active-color="#007aff"
              inactive-color="#666666"
              bg-color="#f5f5f5"
              size="mini"
              @change="onFlowChange" />
          </view>
          <view v-if="currentSource !== 1" class="finance-filter-popup-row">
            <view class="finance-filter-popup-label-row">
              <text class="finance-filter-popup-label">账单类型</text>
              <u-icon v-if="filterBillType" name="close-circle-fill" size="28" color="#999" @click="filterBillType = undefined" />
            </view>
            <view class="finance-filter-popup-select" @click="openFilterSelect('billType')">
              <text :class="['finance-filter-popup-select-value', !filterBillType && 'placeholder']">
                {{ filterBillType ? getBillTypeOptionLabel(filterBillType) : '全部' }}
              </text>
              <u-icon name="arrow-right" size="24" color="#999" />
            </view>
          </view>
          <view v-if="currentSource !== 1" class="finance-filter-popup-row">
            <view class="finance-filter-popup-label-row">
              <text class="finance-filter-popup-label">账单方式</text>
              <u-icon v-if="filterBillMethod" name="close-circle-fill" size="28" color="#999" @click="filterBillMethod = undefined" />
            </view>
            <view class="finance-filter-popup-select" @click="openFilterSelect('billMethod')">
              <text :class="['finance-filter-popup-select-value', !filterBillMethod && 'placeholder']">
                {{ filterBillMethod ? getBillMethodOptionLabel(filterBillMethod) : '全部' }}
              </text>
              <u-icon name="arrow-right" size="24" color="#999" />
            </view>
          </view>
          <view v-if="currentSource === 0 || currentSource === 1" class="finance-filter-popup-row">
            <view class="finance-filter-popup-label-row">
              <text class="finance-filter-popup-label">银行类型</text>
              <u-icon v-if="filterBankType" name="close-circle-fill" size="28" color="#999" @click="filterBankType = undefined" />
            </view>
            <view class="finance-filter-popup-select" @click="openFilterSelect('bankType')">
              <text :class="['finance-filter-popup-select-value', !filterBankType && 'placeholder']">
                {{ filterBankType ? getBankTypeOptionLabel(filterBankType) : '全部' }}
              </text>
              <u-icon name="arrow-right" size="24" color="#999" />
            </view>
          </view>
          <view v-if="currentSource === 0 || currentSource === 1" class="finance-filter-popup-row">
            <view class="finance-filter-popup-label-row">
              <text class="finance-filter-popup-label">银行账单类型</text>
              <u-icon v-if="filterBankBillType" name="close-circle-fill" size="28" color="#999" @click="filterBankBillType = undefined" />
            </view>
            <view class="finance-filter-popup-select" @click="openFilterSelect('bankBillType')">
              <text :class="['finance-filter-popup-select-value', !filterBankBillType && 'placeholder']">
                {{ filterBankBillType ? getBillTypeOptionLabel(filterBankBillType) : '全部' }}
              </text>
              <u-icon name="arrow-right" size="24" color="#999" />
            </view>
          </view>
        </scroll-view>
        <view class="finance-filter-popup-footer">
          <u-button @click="clearAllFilters">重置</u-button>
          <u-button type="primary" @click="onFilterConfirm">确定</u-button>
        </view>
      </view>
    </u-popup>

    <money-time-select v-model:show="showTimeSelect" @confirm="onTimeConfirm" />
    <money-time-select v-model:show="showBalanceTimeSelect" @confirm="onBalanceTimeConfirm" />
    <searchable-select
      v-model="filterSelectVisible"
      :title="filterSelectTitle"
      :list="filterSelectList"
      :current-value="filterSelectCurrent"
      @confirm="onFilterSelectConfirm" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { consumeRefreshFlag } from '../../composables/useRefreshFlag';
  import { aggregateBillApi, weChatApi, aliPayApi } from '../../api';
  import { useApiTypeStore } from '../../store';
  import type { ApiAggregateBillItem } from '/#/api/blog/money/aggregate';
  import MoneyTimeSelect from '../money-time-select/money-time-select.vue';
  import SearchableSelect from '../searchable-select/searchable-select.vue';

  const props = defineProps<{ active: boolean; externalFilter?: { source?: string; bankType?: number } | null }>();

  const apiTypeStore = useApiTypeStore();

  const keyword = ref('');
  const list = ref<ApiAggregateBillItem[]>([]);
  const loading = ref(false);
  const isRefreshing = ref(false);
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = 20;
  const currentSource = ref(0);
  const currentFlow = ref(0);
  const showTimeSelect = ref(false);
  const showFabMenu = ref(false);
  const showFilterPopup = ref(false);
  const showBalanceTimeSelect = ref(false);
  const balanceAction = ref('');
  const balanceLoading = ref(false);
  const timeRange = ref<{ startTime: string; endTime: string } | null>(null);
  const inflowTotal = ref('0.00');
  const outflowTotal = ref('0.00');
  const inited = ref(false);

  const filterBillType = ref<number | undefined>(undefined);
  const filterBillMethod = ref<number | undefined>(undefined);
  const filterBankType = ref<number | undefined>(undefined);
  const filterBankBillType = ref<number | undefined>(undefined);
  const appliedBillType = ref<number | undefined>(undefined);
  const appliedBillMethod = ref<number | undefined>(undefined);
  const appliedBankType = ref<number | undefined>(undefined);
  const appliedBankBillType = ref<number | undefined>(undefined);
  const appliedSource = ref(0);
  const appliedFlow = ref(0);
  const filterSelectVisible = ref(false);
  const filterSelectTitle = ref('');
  const filterSelectList = ref<{ label: string; value: number | string }[]>([]);
  const filterSelectField = ref('');

  const scrollTopOffset = ref(0);
  const scrollStyle = computed(() => {
    const offset = scrollTopOffset.value;
    if (offset > 0) {
      return { height: `calc(100vh - ${offset}px)` };
    }
    return {};
  });

  const sourceOptions = ['全部', '银行', '支付宝', '微信', '人工录入'];
  const flowOptions = ['全部', '收入', '支出'];

  const sourceValueMap: (undefined | 'bank' | 'aliPay' | 'weChat' | 'manual')[] = [undefined, 'bank', 'aliPay', 'weChat', 'manual'];

  const timeLabel = computed(() => {
    if (!timeRange.value) return '';
    return `${timeRange.value.startTime} ~ ${timeRange.value.endTime}`;
  });

  const loadMoreStatus = computed(() => {
    if (loading.value) return 'loading';
    if (list.value.length >= total.value && total.value > 0) return 'nomore';
    return 'loadmore';
  });

  const groupedByDate = computed(() => {
    const groups: Record<string, ApiAggregateBillItem[]> = {};
    list.value.forEach((item) => {
      const date = item.tradeTime?.slice(0, 10) || '未知日期';
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    const sorted: Record<string, ApiAggregateBillItem[]> = {};
    Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .forEach((key) => {
        sorted[key] = groups[key];
      });
    return sorted;
  });

  function getSourceLabel(source: string) {
    const map: Record<string, string> = { bank: '银行', aliPay: '支付宝', weChat: '微信', manual: '人工录入' };
    return map[source] || source;
  }

  function getSourceIcon(source: string) {
    const map: Record<string, string> = { bank: 'red-packet', aliPay: 'zhifubao', weChat: 'weixin-fill', manual: 'edit-pen' };
    return map[source] || 'list';
  }

  function getBillTypeLabel(item: ApiAggregateBillItem): string {
    const found = apiTypeStore.getBillTypeOption.find((o) => o.value === (item.billType || item.bankBillType));
    return found ? found.label : '';
  }

  function getBillMethodLabel(item: ApiAggregateBillItem): string {
    const found = apiTypeStore.getBillMethodOption.find((o) => o.value === item.billMethod);
    return found ? found.label : '';
  }

  function getBillBankTypeLabel(item: ApiAggregateBillItem): string {
    const found = apiTypeStore.getBankTypeOption.find((o) => o.value === item.bankType);
    return found ? found.label : '';
  }

  function getBillTypeOptionLabel(value: number): string {
    return apiTypeStore.getBillTypeOption.find((o) => o.value === value)?.label || '';
  }

  function getBillMethodOptionLabel(value: number): string {
    return apiTypeStore.getBillMethodOption.find((o) => o.value === value)?.label || '';
  }

  function getBankTypeOptionLabel(value: number): string {
    return apiTypeStore.getBankTypeOption.find((o) => o.value === value)?.label || '';
  }

  const filterSelectCurrent = computed(() => {
    const field = filterSelectField.value;
    if (field === 'billType') return filterBillType.value;
    if (field === 'billMethod') return filterBillMethod.value;
    if (field === 'bankType') return filterBankType.value;
    if (field === 'bankBillType') return filterBankBillType.value;
    return undefined;
  });

  function openFilterSelect(field: 'billType' | 'billMethod' | 'bankType' | 'bankBillType') {
    filterSelectField.value = field;
    if (field === 'billType' || field === 'bankBillType') {
      filterSelectList.value = apiTypeStore.getBillTypeOption;
      filterSelectTitle.value = '选择账单类型';
    } else if (field === 'billMethod') {
      filterSelectList.value = apiTypeStore.getBillMethodOption;
      filterSelectTitle.value = '选择账单方式';
    } else if (field === 'bankType') {
      filterSelectList.value = apiTypeStore.getBankTypeOption;
      filterSelectTitle.value = '选择银行类型';
    }
    filterSelectVisible.value = true;
  }

  function onFilterSelectConfirm(item: { label: string; value: number | string }) {
    const val = item.value as number;
    const field = filterSelectField.value;
    if (field === 'billType') filterBillType.value = val;
    else if (field === 'billMethod') filterBillMethod.value = val;
    else if (field === 'bankType') filterBankType.value = val;
    else if (field === 'bankBillType') filterBankBillType.value = val;
  }

  const hasActiveFilter = computed(() => {
    return !!(
      appliedBillType.value ||
      appliedBillMethod.value ||
      appliedBankType.value ||
      appliedBankBillType.value ||
      appliedSource.value !== 0 ||
      appliedFlow.value !== 0
    );
  });

  const activeFilterTags = computed(() => {
    const tags: { field: string; label: string }[] = [];
    if (appliedSource.value !== 0) {
      tags.push({ field: 'source', label: sourceOptions[appliedSource.value] });
    }
    if (appliedFlow.value !== 0) {
      tags.push({ field: 'flow', label: flowOptions[appliedFlow.value] });
    }
    if (appliedBillType.value) {
      tags.push({ field: 'billType', label: getBillTypeOptionLabel(appliedBillType.value) });
    }
    if (appliedBillMethod.value) {
      tags.push({ field: 'billMethod', label: getBillMethodOptionLabel(appliedBillMethod.value) });
    }
    if (appliedBankType.value) {
      tags.push({ field: 'bankType', label: getBankTypeOptionLabel(appliedBankType.value) });
    }
    if (appliedBankBillType.value) {
      tags.push({ field: 'bankBillType', label: getBillTypeOptionLabel(appliedBankBillType.value) });
    }
    return tags;
  });

  function clearFilterTag(field: string) {
    if (field === 'source') {
      appliedSource.value = 0;
      currentSource.value = 0;
    } else if (field === 'flow') {
      appliedFlow.value = 0;
      currentFlow.value = 0;
    } else if (field === 'billType') {
      appliedBillType.value = undefined;
      filterBillType.value = undefined;
    } else if (field === 'billMethod') {
      appliedBillMethod.value = undefined;
      filterBillMethod.value = undefined;
    } else if (field === 'bankType') {
      appliedBankType.value = undefined;
      filterBankType.value = undefined;
    } else if (field === 'bankBillType') {
      appliedBankBillType.value = undefined;
      filterBankBillType.value = undefined;
    }
    loadData(true);
  }

  function openFilterPopup() {
    currentSource.value = appliedSource.value;
    currentFlow.value = appliedFlow.value;
    filterBillType.value = appliedBillType.value;
    filterBillMethod.value = appliedBillMethod.value;
    filterBankType.value = appliedBankType.value;
    filterBankBillType.value = appliedBankBillType.value;
    showFilterPopup.value = true;
  }

  function clearAllFilters() {
    currentSource.value = 0;
    currentFlow.value = 0;
    filterBillType.value = undefined;
    filterBillMethod.value = undefined;
    filterBankType.value = undefined;
    filterBankBillType.value = undefined;
  }

  function onFilterConfirm() {
    showFilterPopup.value = false;
    appliedSource.value = currentSource.value;
    appliedFlow.value = currentFlow.value;
    appliedBillType.value = filterBillType.value;
    appliedBillMethod.value = filterBillMethod.value;
    appliedBankType.value = filterBankType.value;
    appliedBankBillType.value = filterBankBillType.value;
    loadData(true);
  }

  async function loadData(isRefresh = false) {
    if (loading.value) return;
    if (isRefresh) {
      currentPage.value = 1;
      list.value = [];
    }
    loading.value = true;
    try {
      const params: any = {
        current: currentPage.value,
        size: pageSize,
      };
      if (keyword.value) params.tradeOtherPerson = keyword.value;
      const flowVal = appliedFlow.value;
      if (flowVal === 1) params.inflowOrOutflow = 1;
      else if (flowVal === 2) params.inflowOrOutflow = 2;
      const sourceVal = sourceValueMap[appliedSource.value];
      if (sourceVal) params.source = sourceVal;
      if (timeRange.value) {
        params.startTime = timeRange.value.startTime;
        params.endTime = timeRange.value.endTime;
      }
      if (appliedBillType.value) params.billType = appliedBillType.value;
      if (appliedBillMethod.value) params.billMethod = appliedBillMethod.value;
      if (appliedBankType.value) params.bankType = appliedBankType.value;
      if (appliedBankBillType.value) params.bankBillType = appliedBankBillType.value;

      const res = await aggregateBillApi.findAggregatePage(params);
      const newList = res.list || [];
      if (isRefresh) {
        list.value = newList;
      } else {
        list.value = [...list.value, ...newList];
      }
      total.value = res.total || 0;

      // 计算当前页的流入流出总额（用于展示）
      const inflow = list.value.filter((b) => b.inflowOrOutflow === 1).reduce((sum, b) => sum + (b.moneyAmount || 0), 0);
      const outflow = list.value.filter((b) => b.inflowOrOutflow === 2).reduce((sum, b) => sum + (b.moneyAmount || 0), 0);
      inflowTotal.value = inflow.toFixed(2);
      outflowTotal.value = outflow.toFixed(2);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
      isRefreshing.value = false;
    }
  }

  function loadMore() {
    if (list.value.length < total.value) {
      currentPage.value++;
      loadData();
    }
  }
  function onPullDownRefresh() {
    isRefreshing.value = true;
    loadData(true);
  }
  function onReachBottom() {
    if (!loading.value && list.value.length < total.value) {
      currentPage.value++;
      loadData();
    }
  }
  function handleSearch() {
    loadData(true);
  }
  function handleClear() {
    keyword.value = '';
    loadData(true);
  }
  function onSourceChange(index: number) {
    currentSource.value = index;
    filterBillType.value = undefined;
    filterBillMethod.value = undefined;
    filterBankType.value = undefined;
    filterBankBillType.value = undefined;
  }
  function onFlowChange(index: number) {
    currentFlow.value = index;
  }
  function onTimeConfirm(params: { startTime: string; endTime: string }) {
    timeRange.value = params;
    loadData(true);
  }
  function clearTimeRange() {
    timeRange.value = null;
    loadData(true);
  }

  function formatMoney(val: number | undefined | null): string {
    if (val === undefined || val === null) return '0.00';
    return Number(val).toFixed(2);
  }

  function getBalanceValue(item: ApiAggregateBillItem): number | undefined | null {
    if (item.source === 'bank') return item.balance;
    if (item.source === 'weChat') return item.balance;
    if (item.source === 'aliPay') return item.balance;
    if (item.source === 'manual') return item.balance;
    return undefined;
  }

  function getBalanceLabel(item: ApiAggregateBillItem): boolean {
    const val = getBalanceValue(item);
    return val !== undefined && val !== null;
  }

  function getBalanceBabyValue(item: ApiAggregateBillItem): number | undefined | null {
    if (item.source === 'aliPay') return item.balanceBaby;
    return undefined;
  }

  function getBalanceBabyLabel(item: ApiAggregateBillItem): boolean {
    const val = getBalanceBabyValue(item);
    return val !== undefined && val !== null;
  }

  function goToDetail(item: ApiAggregateBillItem) {
    uni.navigateTo({ url: `/pages/finance/bill-detail/bill-detail?source=${item.source}&id=${item.billId}` });
  }

  function onFabAction(action: string) {
    showFabMenu.value = false;
    switch (action) {
      case 'manual':
        uni.navigateTo({ url: '/pages/finance/manual-edit/manual-edit' });
        break;
      case 'upload':
        uni.navigateTo({ url: '/pages/finance/upload/upload' });
        break;
      case 'summary':
        uni.navigateTo({ url: '/pages/finance/summary/summary' });
        break;
      case 'weChatBalance':
      case 'aliPayBalance':
      case 'aliPayBalanceBaby':
        balanceAction.value = action;
        showBalanceTimeSelect.value = true;
        break;
    }
  }

  async function onBalanceTimeConfirm(params: { startTime: string; endTime: string }) {
    const apiParams = {
      startTime: params.startTime ? `${params.startTime} 00:00:00` : '',
      endTime: params.endTime ? `${params.endTime} 23:59:59` : '',
    };
    balanceLoading.value = true;
    uni.showLoading({ title: '处理中...' });
    try {
      if (balanceAction.value === 'weChatBalance') {
        await weChatApi.updateBalance(apiParams);
      } else if (balanceAction.value === 'aliPayBalance') {
        await aliPayApi.updateBalance(apiParams);
      } else if (balanceAction.value === 'aliPayBalanceBaby') {
        await aliPayApi.updateBalanceBaby(apiParams);
      }
      uni.hideLoading();
      uni.showToast({ title: '处理成功', icon: 'success' });
      loadData(true);
    } catch (e: any) {
      uni.hideLoading();
      const errMsg = e?.message || '处理失败';
      uni.showToast({ title: errMsg, icon: 'none' });
    } finally {
      balanceLoading.value = false;
    }
  }

  function calcScrollHeight() {
    try {
      const sysInfo = uni.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 0;
      const navBarHeight = 44;
      const headerHeight = 200;
      const tabBarHeight = 50;
      scrollTopOffset.value = statusBarHeight + navBarHeight + headerHeight + tabBarHeight;
    } catch {
      scrollTopOffset.value = 0;
    }
  }

  onMounted(async () => {
    calcScrollHeight();
    await Promise.all([apiTypeStore.getBillType(), apiTypeStore.getBillMethod(), apiTypeStore.getBankType()]);
    loadData(true);
    inited.value = true;
  });

  function checkRefresh() {
    if (inited.value && consumeRefreshFlag('bill')) loadData(true);
  }

  watch(
    () => props.externalFilter,
    (filter) => {
      if (!filter) return;
      const sourceMap: Record<string, number> = { bank: 1, aliPay: 2, weChat: 3, manual: 4 };
      if (filter.source && sourceMap[filter.source] !== undefined) {
        appliedSource.value = sourceMap[filter.source];
        currentSource.value = appliedSource.value;
        appliedBankType.value = undefined;
        filterBankType.value = undefined;
      }
      if (filter.bankType) {
        appliedSource.value = 1;
        currentSource.value = 1;
        appliedBankType.value = filter.bankType;
        filterBankType.value = filter.bankType;
      }
      if (inited.value) loadData(true);
    }
  );

  watch(
    () => props.active,
    (val) => {
      if (val && inited.value && consumeRefreshFlag('bill')) loadData(true);
    }
  );

  defineExpose({ checkRefresh });
</script>

<style lang="scss" scoped>
  .finance-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $uni-bg-color-grey;
  }

  .finance-header {
    margin: 0 20rpx 0;
  }
  .finance-summary-row {
    display: flex;
    align-items: center;
  }
  .finance-summary-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .finance-summary-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
  .finance-summary-value {
    font-size: 36rpx;
    font-weight: bold;
    margin-top: 8rpx;
  }
  .finance-summary-divider {
    width: 2rpx;
    height: 60rpx;
    background-color: $uni-border-color;
  }
  .finance-toolbar {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin: 16rpx 20rpx 0;
  }

  .finance-toolbar-actions {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex-shrink: 0;
  }

  .finance-toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rpx;
  }

  .finance-filter {
    margin: 12rpx 20rpx 0;
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-wrap: wrap;
  }

  .finance-filter-time-tag {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    background-color: #e8f4fd;
    border-radius: 20rpx;
    padding: 8rpx 20rpx;
  }

  .finance-filter-time-text {
    font-size: 24rpx;
    color: #007aff;
  }

  .finance-filter-popup {
    display: flex;
    flex-direction: column;
    max-height: 70vh;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  .finance-filter-popup-header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 32rpx 30rpx 16rpx;
  }

  .finance-filter-popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;
  }

  .finance-filter-popup-close {
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

  .finance-filter-popup-body {
    flex: 1;
    padding: 0 30rpx;
    max-height: 50vh;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .finance-filter-popup-row {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    overflow: hidden;
    &:last-child {
      border-bottom: none;
    }
  }

  .finance-filter-popup-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
  }

  .finance-filter-popup-label {
    font-size: 26rpx;
    color: #666;
  }

  .finance-filter-popup-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
  }

  .finance-filter-popup-select-value {
    font-size: 26rpx;
    color: #333;
    &.placeholder {
      color: #999;
    }
  }

  .finance-filter-popup-footer {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #f0f0f0;
  }
  .finance-list-scroll {
    flex: 1;
    height: 0;
    margin-top: 16rpx;
  }
  .finance-refresher {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    gap: 12rpx;
  }
  .finance-refresher-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
  .finance-list {
    padding: 0 20rpx;
  }
  .finance-date-header {
    padding: 16rpx 8rpx 8rpx;
  }
  .finance-date-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    font-weight: bold;
  }
  .finance-bill-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
    padding: 20rpx 24rpx;
  }
  .finance-bill-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }
  .finance-bill-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .finance-bill-icon-in {
    background: linear-gradient(135deg, #4cd964, #34c759);
  }
  .finance-bill-icon-out {
    background: linear-gradient(135deg, #ff6b6b, #ff3b30);
  }
  .finance-bill-info {
    margin-left: 20rpx;
    flex: 1;
    min-width: 0;
  }
  .finance-bill-title {
    font-size: $uni-font-size-base;
    font-weight: 500;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .finance-bill-sub {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    display: block;
  }
  .finance-bill-sub-tag-row,
  .finance-bill-sub-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6rpx;
  }

  .finance-bill-sub-tag-row {
    align-items: flex-start;
  }
  .finance-bill-balance {
    font-size: 22rpx;
    color: $uni-text-color-grey;
    flex-shrink: 0;
  }
  .finance-bill-tag {
    font-size: 20rpx;
    color: #1677ff;
    background-color: #e8f4fd;
    padding: 2rpx 12rpx;
    border-radius: 6rpx;
    max-width: 240rpx;
  }
  .finance-bill-right {
    flex-shrink: 0;
    margin-left: 20rpx;
  }
  .finance-bill-amount {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }
  .finance-loading,
  .finance-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
  }
  .finance-loading-text {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }

  .finance-fab-popup {
    padding: 0;

    .finance-fab-popup-header {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      padding: 36rpx 30rpx 24rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .finance-fab-popup-title {
        font-size: 32rpx;
        font-weight: 600;
        color: $uni-text-color;
      }

      .finance-fab-popup-close {
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
    }

    .finance-fab-popup-body {
      padding: 12rpx 0;
      padding-bottom: calc(12rpx + env(safe-area-inset-bottom));

      .finance-fab-action-item {
        display: flex;
        align-items: center;
        padding: 28rpx 30rpx;
        gap: 24rpx;

        &:active {
          background-color: #f8f8f8;
        }

        .finance-fab-action-icon {
          width: 80rpx;
          height: 80rpx;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .finance-fab-action-content {
          flex: 1;
          min-width: 0;

          .finance-fab-action-label {
            font-size: 30rpx;
            font-weight: 500;
            color: $uni-text-color;
            display: block;
          }

          .finance-fab-action-desc {
            font-size: 24rpx;
            color: $uni-text-color-placeholder;
            margin-top: 6rpx;
            display: block;
          }
        }
      }
    }
  }

  .tab-finance-fab {
    position: fixed;
    right: 60rpx;
    bottom: calc(140rpx + env(safe-area-inset-bottom));
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #007aff, #0055d5);
    box-shadow:
      0 8rpx 24rpx rgba(0, 122, 255, 0.35),
      0 2rpx 8rpx rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    &:active {
      transform: scale(0.9);
    }
  }
</style>
