import type { EChartsOption } from 'echarts';
import type { Ref } from 'vue';

import { useTimeoutFn } from '@/utils/core/useTimeout';
import { Fn, tryOnUnmounted } from '@vueuse/core';
import { unref, nextTick, watch, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useEventListener, useBreakpoint } from '@/hooks';

import { echarts } from '@/plugins';

// import { useRootSetting } from '@/hooks/setting/useRootSetting';

export function useECharts(elRef: Ref<HTMLDivElement>, theme: 'light' | 'dark' | 'default' = 'light') {
  // const { getDarkMode } = useRootSetting();
  const getDarkMode = 'light';
  // const getDarkMode = theme;
  let chartInstance: echarts.ECharts | null = null;
  let resizeFn: Fn = resize;
  let cacheOptions = {};
  let removeResizeFn: Fn = () => {};

  resizeFn = useDebounceFn(resize, 200);

  const getOptions = computed((): EChartsOption => {
    // if (getDarkMode !== 'dark') {
    return cacheOptions;
    // }
    // return {
    //   backgroundColor: 'transparent',
    //   ...cacheOptions.value,
    // };
  });

  function initCharts(t = theme) {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }

    chartInstance = echarts.init(el, t);
    const { removeEvent } = useEventListener({
      el: window,
      name: 'resize',
      listener: resizeFn,
    });
    removeResizeFn = removeEvent;
    const { widthRef, screenEnum } = useBreakpoint();
    if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
      useTimeoutFn(() => {
        resizeFn();
      }, 30);
    }
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions = options;
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions));
      }, 30);
      return;
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts(getDarkMode as 'default');

          if (!chartInstance) return;
        }
        clear && chartInstance?.clear();

        chartInstance?.setOption(unref(getOptions));
      }, 30);
    });
  }

  function resize() {
    chartInstance?.resize();
  }

  watch(
    () => getDarkMode,
    (theme) => {
      if (chartInstance) {
        chartInstance.dispose();
        initCharts(theme as 'default');
        setOptions(cacheOptions);
      }
    }
  );

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    removeResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  });

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(getDarkMode as 'default');
    }
    return chartInstance;
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  };
}
