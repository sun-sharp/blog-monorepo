import { onBackPress } from '@dcloudio/uni-app';
import type { Ref } from 'vue';

/**
 * 在页面 onBackPress 里关闭 list-page 的全屏筛选弹窗。
 * 返回 true 表示拦截了返回（弹窗已关闭）；否则返回 false 交由页面默认处理。
 */
export function useFilterBackPress(listPageRef: Ref<any>): (e: any) => boolean {
  function onBack(): boolean {
    const lp = listPageRef.value;
    if (lp && typeof lp.closeFullFilter === 'function' && lp.isFullFilterVisible()) {
      lp.closeFullFilter();
      return true;
    }
    return false;
  }

  onBackPress(onBack);
  return onBack;
}