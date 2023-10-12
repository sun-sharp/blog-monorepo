import { reactive, ref } from 'vue';

// 搜索页面显示状态
export const useSearch = ref<boolean>(false);

// 获取内容展示的宽高
export const useContSize = reactive({
  width: 0,
  height: 0,
});

export * from './useBattery';
export * from './useOnline';
export * from './useTime';
export * from './useSetting';
export * from './useECharts';
export * from './event';
// export * from './table';
export * from './useTimeout';
export * from './useApiType';
export * from './useApp';
