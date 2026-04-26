<script lang="ts" setup>
  import { firstHalfYearFormatRange, isArrayEqual, lastMonthFormatRange, lastYearFormatRange, secondHalfYearFormatRange, thisYearFormatRange } from '@/utils';
  import { computed, ref } from 'vue';

  const props = defineProps({
    format: {
      type: String,
      default: 'yyyy-MM-dd',
    },
    defaultTimeSelect: {
      type: String as PropType<'上月' | '去年' | '今年' | '上半年' | '下半年'>,
      default: '上月',
    },
    direction: {
      type: String as PropType<'vertical' | 'transverse'>,
      default: 'transverse',
    },
  });

  const emit = defineEmits(['timeSelectChange', 'datePickerChange']);

  const formatDateRange = (timeSelect: string, formatStr: string) => {
    if (timeSelect === '去年') {
      return lastYearFormatRange(formatStr);
    } else if (timeSelect === '今年') {
      return thisYearFormatRange(formatStr);
    } else if (timeSelect === '上半年') {
      return firstHalfYearFormatRange(formatStr);
    } else if (timeSelect === '下半年') {
      return secondHalfYearFormatRange(formatStr);
    }
    return lastMonthFormatRange(formatStr);
  };

  const dateRange = ref(formatDateRange(props.defaultTimeSelect, props.format));

  // 时间类型选择
  const timeSelectActive = ref<string>(props.defaultTimeSelect);
  const timeSelectOptions = computed<string[]>(() => {
    const arr = ['上月', '去年', '今年', '上半年'];
    const nowTime = new Date();
    const month = nowTime.getMonth();
    if (month > 6) {
      arr.push('下半年');
    }
    return arr;
  });

  // 时间筛选
  const datePickerChange = (val: [string, string]) => {
    dateRange.value = val;
    timeSelectActive.value = '';
    if (isArrayEqual(val, lastMonthFormatRange(props.format))) {
      timeSelectActive.value = '上月';
    } else if (isArrayEqual(val, lastYearFormatRange(props.format))) {
      timeSelectActive.value = '去年';
    } else if (isArrayEqual(val, thisYearFormatRange(props.format))) {
      timeSelectActive.value = '今年';
    } else if (isArrayEqual(val, firstHalfYearFormatRange(props.format))) {
      timeSelectActive.value = '上半年';
    } else if (isArrayEqual(val, secondHalfYearFormatRange(props.format))) {
      timeSelectActive.value = '下半年';
    }
    emit('datePickerChange', val);
  };

  // 点击改变时间
  const timeSelectChange = (it: string) => {
    timeSelectActive.value = it;
    dateRange.value = formatDateRange(it, props.format);
    emit('timeSelectChange', dateRange.value);
  };
</script>

<template>
  <div :class="['money-time-type-select', { 'flex ai-c': direction === 'transverse' }]">
    <div :class="['time-select', { 'mr-10': direction === 'transverse', 'mb-10': direction === 'vertical' }]">
      <span v-for="it in timeSelectOptions" :key="it" :class="['time-select--item', { active: it === timeSelectActive }]" @click="timeSelectChange(it)">
        {{ it }}
      </span>
    </div>
    <n-date-picker
      :formatted-value="dateRange"
      style="width: 280px"
      :format="format"
      :value-format="format"
      type="daterange"
      clearable
      @update:formatted-value="datePickerChange($event)" />
  </div>
</template>

<style lang="scss">
  .money-time-type-select {
    .time-select {
      display: flex;
      align-items: center;

      &--item {
        font-weight: normal;
        font-size: 13px;
        cursor: pointer;

        &:not(:first-child) {
          margin-left: 8px;
        }

        &.active {
          color: $theme-color;
        }
      }
    }
  }
</style>
