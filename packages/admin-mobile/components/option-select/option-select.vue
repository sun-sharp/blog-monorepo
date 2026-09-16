<template>
  <!-- roll 模式：滚动选择框（<=阈值 且 单选） -->
  <u-picker
    v-model="rollModelValue"
    mode="selector"
    :range="list"
    :range-key="labelKey"
    :default-selector="[rollIndex]"
    :safe-area-inset-bottom="true"
    @confirm="onRollConfirm"
    @cancel="handleClose"
    @close="handleClose" />

  <!-- bottom 模式：半屏弹窗（多选 <=阈值） -->
  <u-popup
    v-if="mode === 'bottom'"
    :model-value="modelValue"
    mode="bottom"
    :length="'55%'"
    :safe-area-inset-bottom="true"
    :border-radius="24"
    :z-index="10080"
    @close="handleClose">
    <view class="bottom-filter" :class="{ dark: isDark }">
      <view class="bottom-filter__header">
        <text class="bottom-filter__title">{{ title }}</text>
        <view class="bottom-filter__close" @click="handleClose">
          <u-icon name="close" size="36" color="#999" />
        </view>
      </view>
      <scroll-view scroll-y class="bottom-filter__body">
        <view class="bottom-filter__chips">
          <view v-for="opt in list" :key="opt[valueKey]" class="option-chip" :class="{ 'option-chip--selected': isSelected(opt) }" @click="onToggle(opt)">
            <text class="option-chip__text">{{ opt[labelKey] }}</text>
          </view>
        </view>
        <view v-if="list.length === 0" class="bottom-filter__empty">
          <u-empty mode="data" text="无可用选项" icon-size="80" />
        </view>
      </scroll-view>
      <view class="bottom-filter__footer">
        <u-button :plain="true" @click="onCancel">取消</u-button>
        <u-button type="primary" @click="onConfirm">确定</u-button>
      </view>
    </view>
  </u-popup>

  <!-- full 模式：全屏弹窗（>阈值 单选或多选） -->
  <u-popup
    v-if="mode === 'full' && fullGroups.length > 0"
    :model-value="modelValue"
    mode="right"
    :length="'100%'"
    :safe-area-inset-bottom="true"
    @close="handleClose">
    <view class="full-filter" :class="{ dark: isDark }" :style="fullFilterStyle">
      <view class="full-filter__search-row">
        <view class="full-filter__search">
          <u-search v-model="fullKeyword" placeholder="搜索选项" shape="round" :show-action="false" @clear="fullKeyword = ''" />
        </view>
        <view class="full-filter__close" @click="handleClose">
          <u-icon name="close" size="36" color="#999" />
        </view>
      </view>
      <scroll-view scroll-y scroll-with-animation class="full-filter__scroll" :scroll-into-view="fullScrollIntoView">
        <view v-for="group in visibleFullGroups" :key="group._letter" class="full-filter__group">
          <view :id="`full-group-${group._letter}`" class="full-filter__group-title">{{ group._letter }}</view>
          <view class="full-filter__chips">
            <view
              v-for="opt in group._options"
              :key="opt[valueKey]"
              class="option-chip"
              :class="{ 'option-chip--selected': isSelected(opt) }"
              @click="onToggle(opt)">
              <text class="option-chip__text">{{ opt[labelKey] }}</text>
            </view>
          </view>
        </view>
        <view v-if="visibleFullGroups.length === 0" class="full-filter__empty">
          <u-empty mode="search" text="无匹配选项" icon-size="80" />
        </view>
      </scroll-view>
      <view class="full-filter__index">
        <text v-for="letter in fullIndexLetters" :key="letter" class="full-filter__index-item" @click="jumpToLetter(letter)">{{ letter }}</text>
      </view>
      <view v-if="multiple && selectedList.length > 0" class="full-filter__selected">
        <text class="full-filter__selected-label">已选</text>
        <view class="full-filter__selected-wrapper">
          <view v-for="s in selectedList" :key="s[valueKey]" class="selected-chip" @click="onToggle(s)">
            <text class="selected-chip__text">{{ s[labelKey] }}</text>
            <u-icon name="close" size="22" color="#999" />
          </view>
        </view>
        <text class="full-filter__selected-count">{{ selectedList.length }} 项</text>
      </view>
      <view class="full-filter__footer">
        <u-button :plain="true" @click="onCancel">取消</u-button>
        <u-button type="primary" @click="onConfirm">确定</u-button>
      </view>
    </view>
  </u-popup>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { getPinyinInitial } from '../../../shared/src/utils';
  import { useAppTheme } from '../../composables/useAppTheme';

  const { isDark } = useAppTheme();

  export interface SelectOption {
    label: string;
    value: number | string;
    [key: string]: string | number;
  }

  type Mode = 'auto' | 'roll' | 'bottom' | 'full';

  const props = withDefaults(
    defineProps<{
      modelValue: boolean;
      title?: string;
      list?: SelectOption[];
      currentValue?: number | string;
      currentValues?: (number | string)[];
      multiple?: boolean;
      labelKey?: string;
      valueKey?: string;
      threshold?: number;
      mode?: Mode;
    }>(),
    {
      title: '请选择',
      list: () => [],
      multiple: false,
      labelKey: 'label',
      valueKey: 'value',
      threshold: 15,
      mode: 'auto',
    }
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'confirm', item: SelectOption | SelectOption[]): void;
  }>();

  // ---- 模式推断 ----
  const mode = computed<Mode>(() => {
    if (props.mode !== 'auto') return props.mode;
    const count = props.list.length;
    if (props.multiple) {
      return count > props.threshold ? 'full' : 'bottom';
    }
    return count > props.threshold ? 'full' : 'roll';
  });

  // ---- 选态集合（草稿） ----
  const selectedSet = ref<Set<any>>(new Set());

  function initSelectedSet() {
    const set = new Set<any>();
    if (props.multiple) {
      (props.currentValues || []).forEach((v) => set.add(v));
    } else if (props.currentValue !== undefined && props.currentValue !== null && props.currentValue !== '') {
      set.add(props.currentValue);
    }
    selectedSet.value = set;
  }

  function isSelected(opt: SelectOption): boolean {
    return selectedSet.value.has(opt[props.valueKey]);
  }

  function onToggle(opt: SelectOption) {
    const val = opt[props.valueKey];
    const set = new Set(selectedSet.value);
    if (set.has(val)) {
      set.delete(val);
    } else if (props.multiple) {
      set.add(val);
    } else {
      set.clear();
      set.add(val);
    }
    selectedSet.value = set;
  }

  // ---- roll 模式 ----
  const rollModelValue = computed({
    get: () => mode.value === 'roll' && props.modelValue,
    set: (val: boolean) => {
      if (props.modelValue !== val) emit('update:modelValue', val);
    },
  });

  const rollIndex = computed(() => {
    const idx = props.list.findIndex((o) => String(o[props.valueKey]) === String(props.currentValue));
    return idx >= 0 ? idx : 0;
  });

  function onRollConfirm(e: any) {
    const index = Array.isArray(e) ? e[0] : e?.value;
    const item = props.list[index];
    if (item) {
      emit('confirm', item);
      emit('update:modelValue', false);
    }
  }

  // ---- bottom / full 共用：取消 / 确定 ----
  const selectedList = computed(() => props.list.filter((o) => selectedSet.value.has(o[props.valueKey])));

  function onCancel() {
    emit('update:modelValue', false);
  }

  function onConfirm() {
    if (props.multiple) {
      emit('confirm', selectedList.value);
    } else {
      const first = selectedList.value[0];
      if (first) emit('confirm', first);
    }
    emit('update:modelValue', false);
  }

  function handleClose() {
    emit('update:modelValue', false);
  }

  // ---- 全屏弹窗：顶部留白。
  // 当页面为自定义导航栏(navigationStyle=custom)时，全屏弹窗会顶到状态栏，需按状态栏高度下移；
  // 当页面为原生导航栏时，弹窗已从导航栏下方开始，无需再加状态栏高度，避免输入框下移过多。
  const fullFilterStyle = computed(() => {
    let statusBarHeight = 0;
    let navBarHeight = 0;
    try {
      const info = uni.getSystemInfoSync();
      statusBarHeight = info.statusBarHeight || 0;
      navBarHeight = info.navigationBarHeight || 0;
    } catch {
      // ignore
    }
    const top = navBarHeight > 0 ? 24 : statusBarHeight + 24;
    return { paddingTop: `${top}rpx` };
  });

  // ---- full 模式：拼音分组 + 搜索 + 索引 ----
  const fullKeyword = ref('');
  const fullScrollIntoView = ref('');

  const fullGroups = computed(() => {
    const map: Record<string, SelectOption[]> = {};
    props.list.forEach((opt) => {
      const letter = getPinyinInitial(String(opt[props.labelKey]));
      if (!map[letter]) map[letter] = [];
      map[letter].push(opt);
    });
    return Object.keys(map)
      .sort()
      .map((letter) => ({ _letter: letter, _options: map[letter] }));
  });

  const visibleFullGroups = computed(() => {
    const kw = fullKeyword.value.trim().toLowerCase();
    if (!kw) return fullGroups.value;
    return fullGroups.value
      .map((g) => ({
        ...g,
        _options: g._options.filter((o) => String(o[props.labelKey]).toLowerCase().includes(kw)),
      }))
      .filter((g) => g._options.length > 0);
  });

  const fullIndexLetters = computed(() => visibleFullGroups.value.map((g) => g._letter));

  function jumpToLetter(letter: string) {
    fullScrollIntoView.value = `full-group-${letter}`;
  }

  // ---- 打开时重置 ----
  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        initSelectedSet();
        fullKeyword.value = '';
        fullScrollIntoView.value = '';
      }
    }
  );

  // ---- 暴露给页面 (onBackPress 关闭全屏) ----
  function isFullFilterVisible(): boolean {
    return props.modelValue && mode.value === 'full';
  }
  function closeFullFilter(): boolean {
    if (isFullFilterVisible()) {
      emit('update:modelValue', false);
      return true;
    }
    return false;
  }

  defineExpose({ isFullFilterVisible, closeFullFilter });
</script>

<style lang="scss" scoped>
  /* ---- 通用选项 chip（bottom/full 共用） ---- */
  .option-chip {
    display: inline-flex;
    align-items: center;
    gap: 6rpx;
    padding: 10rpx 20rpx;
    background-color: #f5f6f8;
    border-radius: 28rpx;
    border: 1rpx solid #f5f6f8;
    font-size: 26rpx;
    color: #333;
    flex-shrink: 0;

    &--selected {
      background-color: #e8f4fd;
      color: #007aff;
      border: 1rpx solid #007aff;

      .dark & {
        background-color: rgba(0, 122, 255, 0.2);
        color: #8ab4ff;
        border-color: #007aff;
      }
    }

    .dark & {
      background-color: #2a2a2e;
      color: #cfd3dc;
      border-color: #2a2a2e;
    }

    &:active {
      opacity: 0.85;
    }
  }

  .option-chip__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300rpx;
  }

  /* ---- 半屏弹窗 ---- */
  .bottom-filter__body {
    max-height: 60vh;
  }

  .bottom-filter__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    padding: 8rpx 4rpx;
  }

  .bottom-filter__empty {
    padding-top: 80rpx;
  }

  .bottom-filter__footer {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 24rpx 0;
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));

    :deep(.u-btn) {
      flex: 1;
    }
  }

  /* ---- 全屏弹窗 ---- */
  .full-filter {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24rpx 24rpx 0;
    background-color: $uni-bg-color;
    box-sizing: border-box;

    &.dark {
      background-color: $uni-bg-color-dark-2;
    }
  }

  .full-filter__search-row {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding-bottom: 16rpx;
  }

  .full-filter__search {
    flex: 1;
  }

  .full-filter__close {
    flex-shrink: 0;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .full-filter__scroll {
    flex: 1;
    height: 0;
    padding-right: 48rpx;
  }

  .full-filter__group {
    margin-bottom: 24rpx;
  }

  .full-filter__group-title {
    font-size: 26rpx;
    font-weight: 700;
    color: #007aff;
    padding: 8rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    margin-bottom: 16rpx;
  }

  .full-filter__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .full-filter__empty {
    padding-top: 120rpx;
  }

  .full-filter__index {
    position: fixed;
    right: 8rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    z-index: 20;
    max-height: 80%;
  }

  .full-filter__index-item {
    font-size: 20rpx;
    color: #007aff;
    padding: 3rpx 2rpx;
    text-align: center;
    line-height: 2;
  }

  .full-filter__footer {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 20rpx 0;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

    :deep(.u-btn) {
      flex: 1;
    }
  }

  /* ---- 已选展示（多选全屏） ---- */
  .full-filter__selected {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 16rpx 0;
    border-top: 1rpx solid #f0f0f0;
    margin-top: 8rpx;
  }

  .full-filter__selected-label {
    font-size: 26rpx;
    font-weight: 500;
    color: $uni-text-color;
    flex-shrink: 0;
  }

  .full-filter__selected-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    flex: 1;
  }

  .selected-chip {
    display: inline-flex;
    align-items: center;
    gap: 6rpx;
    padding: 6rpx 14rpx;
    background-color: #e8f4fd;
    border-radius: 20rpx;
    border: 1rpx solid #007aff;

    &:active {
      opacity: 0.85;
    }
  }

  .selected-chip__text {
    font-size: 22rpx;
    color: #007aff;
    max-width: 180rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .full-filter__selected-count {
    font-size: 24rpx;
    color: #999;
    flex-shrink: 0;
  }
</style>
