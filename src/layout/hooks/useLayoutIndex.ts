import { formatNaiveTheme } from '@/components/hooks/useAppProvider';
import { darkNaiveTheme, defaultNaiveTheme } from '@/constant';
import { lighten } from '@/utils';
import { computed, ref, unref, watchEffect } from 'vue';
import { useContSize, useSearch, useSetting } from '@/hooks';
import { useElementBounding } from '@vueuse/core';

/* 处理useLayoutIndex */
export const useLayoutIndex = () => {
  // lnf-cont 的内容
  const lnfContRef = ref<Component>();
  const { width: contWidth, height: contHeight } = useElementBounding(lnfContRef);
  watchEffect(() => {
    useContSize.width = unref(contWidth);
    useContSize.height = unref(contHeight);
  });

  const { getAppThemeColor, getNavMode, getHeadFixed, getTabsViewShow, getTabsViewFixed, getFooterShow, getFooterFixed, getSiderIsDark } = useSetting();

  // 除去右侧
  const noSiderClassName = computed(() => {
    const arr = ['layout-no-sider'];
    return arr;
  });

  // 顶部
  const noSiderHeadClassName = computed(() => {
    const arr = ['lnf-header'];
    const headFixed = unref(getHeadFixed);
    const tabsViewShow = unref(getTabsViewShow);
    const tabsViewFixed = unref(getTabsViewFixed);
    if (headFixed && tabsViewFixed && tabsViewShow) {
      arr.push('head_tabs-view');
    } else if (headFixed) {
      arr.push('head');
    } else if (tabsViewFixed && tabsViewShow) {
      arr.push('tabs-view');
    }
    return arr;
  });

  // 顶部固定
  const lnfContHeadClassName = computed(() => {
    const arr = [];
    const headFixed = unref(getHeadFixed);
    if (headFixed) {
      arr.push('head-fixed');
    }
    return arr;
  });

  // 标签页固定
  const lnfContTabsViewClassName = computed(() => {
    const arr = [];
    const headFixed = unref(getHeadFixed);
    const tabsViewFixed = unref(getTabsViewFixed);
    if (tabsViewFixed) {
      arr.push('tabs-view-fixed');
    }
    if (headFixed) {
      arr.push('has-head');
    }
    return arr;
  });

  // 页脚
  const noSiderFootClassName = computed(() => {
    const arr = ['lnf-footer'];
    const footerFixed = unref(getFooterFixed);
    const footerShow = unref(getFooterShow);
    if (footerFixed && footerShow) {
      arr.push('footer');
    }
    return arr;
  });

  // 页脚固定
  const lnfContFootClassName = computed(() => {
    const arr = [];
    const footerFixed = unref(getFooterFixed);
    if (footerFixed) {
      arr.push('foot-fixed');
    }
    return arr;
  });

  // 显示标签页
  const tabsViewShow = computed(() => {
    return unref(getTabsViewShow);
  });

  // 显示页脚
  const footerShow = computed(() => {
    return unref(getFooterShow);
  });

  // 修改顶部样式
  const siderThemeOverrides = computed(() => {
    const isDark = unref(getSiderIsDark);
    // 默认naive主题
    let naiveCommon = defaultNaiveTheme;
    if (isDark) {
      naiveCommon = darkNaiveTheme;
    }
    // 改变naive主题
    const primaryColor = unref(getAppThemeColor);
    const primaryColorHover = lighten(primaryColor, 6);
    const primaryColorPressed = lighten(primaryColor, -6);
    const otherCommon = {
      primaryColor,
      primaryColorHover,
      primaryColorPressed,
      primaryColorSuppl: primaryColorHover,
    };

    return {
      common: formatNaiveTheme(naiveCommon, otherCommon),
    };
  });

  // 菜单是否折叠
  const collapsed = ref<boolean>(false);

  // 菜单是否展示
  const menuIsShow = computed(() => {
    const navMode = unref(getNavMode);
    if (navMode === 'horizontal') {
      return false;
    }
    return true;
  });

  return {
    lnfContRef,
    useSearch,
    noSiderClassName,
    noSiderHeadClassName,
    lnfContHeadClassName,
    lnfContTabsViewClassName,
    noSiderFootClassName,
    lnfContFootClassName,
    siderThemeOverrides,
    collapsed,
    menuIsShow,
    tabsViewShow,
    footerShow,
  };
};
