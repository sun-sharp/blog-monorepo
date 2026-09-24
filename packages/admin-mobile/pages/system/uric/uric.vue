<template>
  <u-config-provider :dark-mode="mode">
    <view class="uric-page" :class="{ dark: isDark }">
      <list-page
        ref="listPageRef"
        :api-fn="uricApi.getPage"
        :show-search="false"
        :dropdown-items="dropdownItems"
        show-fab
        @fabClick="goToAdd"
        @itemLongpress="onLongPress">
        <template #default="{ list, longpress }">
          <view
            v-for="item in list"
            :key="item.uricId"
            class="uric-item card"
            :class="{ dark: isDark }"
            @click="goToEdit(item.uricId)"
            @longpress="longpress(item)">
            <view class="uric-item-left">
              <view class="uric-item-icon" :style="{ background: getTypeColor(item.measureType) }">
                <u-icon :name="getTypeIcon(item.measureType)" size="32" color="#fff" custom-prefix="sharp-icon" />
              </view>
              <view class="uric-item-info">
                <text class="uric-item-label">{{ item.measureTime }}</text>
                <text class="uric-item-type">{{ getTypeLabel(item.measureType) }}</text>
              </view>
            </view>
            <view class="uric-item-right">
              <view class="uric-item-values">
                <text v-if="item.uricAcid != null" :class="['uric-item-value', getUricLevelClass(item.uricAcid)]">尿酸 {{ item.uricAcid }}umol/L</text>
                <text v-if="item.bloodGlucose != null" :class="['uric-item-value', getBloodGlucoseLevelClass(item.bloodGlucose, item.bloodSugarPeriod)]">
                  血糖 {{ item.bloodGlucose }}mmol/L{{ item.bloodSugarPeriod ? `（${getPeriodLabel(item.bloodSugarPeriod)}）` : '' }}
                </text>
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
  import { ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { consumeRefreshFlag } from '../../../composables/useRefreshFlag';
  import { useFilterBackPress } from '../../../composables/useFilterBackPress';
  import { uricApi } from '../../../api';
  import {
    measureTypeOption,
    bloodSugarPeriodOption,
    HOSPITAL_MEASURE_TYPE,
    TGU210_C_MEASURE_TYPE,
    EA_19_MEASURE_TYPE,
  } from '../../../../shared/src/constants/api-type';
  import type { ApiUricItem } from '/#/api/capital/uric';
  import ListPage from '../../../components/list-page/list-page.vue';
  import { useAppTheme } from '../../../composables/useAppTheme';
  import { DARK_NAV_BAR_FRONT_COLOR, DARK_NAV_BAR_BG_COLOR, LIGHT_NAV_BAR_FRONT_COLOR, LIGHT_NAV_BAR_BG_COLOR } from '../../../../shared/src/constants';
  import { createTypeMapper } from '../../../../shared/src/utils';

  const { isDark, mode } = useAppTheme();

  const listPageRef = ref();

  useFilterBackPress(listPageRef);

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

  function getPeriodLabel(period: number) {
    const item = bloodSugarPeriodOption.find((o) => o.value === period);
    return item?.label || String(period);
  }

  const colorPool = ['linear-gradient(135deg, #4facfe, #007aff)', 'linear-gradient(135deg, #43e97b, #38f9d7)', 'linear-gradient(135deg, #fa709a, #fee140)'];
  const iconPool = ['yiyuan', 'shequxietangceliang', 'a-blooddonation'];

  const customHash = (str: string) => {
    const map: Record<string, number> = {};
    map[HOSPITAL_MEASURE_TYPE] = 0;
    map[TGU210_C_MEASURE_TYPE] = 1;
    map[EA_19_MEASURE_TYPE] = 2;
    return map[str] !== undefined ? map[str] : 0; // 默认兜底
  };
  const getTypeColor = createTypeMapper(colorPool, customHash);
  const getTypeIcon = createTypeMapper(iconPool, customHash);

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

  function getUricLevelClass(value: number): string {
    if (value < 180) return 'uric-level-warn';
    if (value <= 360) return 'uric-level-normal';
    if (value <= 420) return 'uric-level-warn';
    if (value <= 540) return 'uric-level-danger';
    return 'uric-level-critical';
  }

  function getBloodGlucoseLevelClass(value: number, period: number): string {
    if (value < 3.9) return 'uric-level-danger';
    if (period === 1) {
      // 空腹血糖
      if (value <= 6.1) return 'uric-level-normal';
      if (value < 7.0) return 'uric-level-warn';
      return 'uric-level-danger';
    } else {
      // 非空腹血糖
      if (value <= 7.8) return 'uric-level-normal';
      if (value < 11.1) return 'uric-level-warn';
      return 'uric-level-danger';
    }
  }

  onLoad(() => {
    // 根据主题设置导航栏颜色
    uni.setNavigationBarColor({
      frontColor: isDark.value ? DARK_NAV_BAR_FRONT_COLOR : LIGHT_NAV_BAR_FRONT_COLOR,
      backgroundColor: isDark.value ? DARK_NAV_BAR_BG_COLOR : LIGHT_NAV_BAR_BG_COLOR,
    });
  });

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

    &.dark {
      background-color: $dark-page-bg;
    }
  }

  .uric-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    margin-bottom: 16rpx;

    &.dark {
      background-color: $dark-card-bg;
    }

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
    color: $dark-text-color;
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
    color: $dark-text-color;
  }

  .uric-level-normal {
    color: $uni-color-success;
  }

  .uric-level-warn {
    color: $uni-color-warning;
  }

  .uric-level-danger {
    color: $uni-color-error;
  }

  .uric-level-critical {
    color: #c0392b;
    font-weight: bold;
  }
</style>
