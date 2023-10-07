import { computed, unref } from 'vue';
import { ThemeCommonVars } from 'naive-ui';
import { lighten } from '@/utils';
import { useSetting } from '@/hooks';
import { darkNaiveTheme, darkVariable, defaultNaiveTheme, defaultVariable } from '@/constant';

// 处理Naive主题样式
export const formatNaiveTheme = (naiveCommon: ThemeCommonVars, otherCommon: Partial<ThemeCommonVars>) => {
  return { ...naiveCommon, ...otherCommon };
};

// app 配置
export const useAppProvider = () => {
  const { getAppTheme, getAppThemeColor, getHeadIsDark, getSiderIsDark } = useSetting();

  // 设置主题样式
  const getThemeOverrides = computed(() => {
    const appTheme = unref(getAppTheme);
    // 默认naive主题
    let naiveCommon = defaultNaiveTheme;
    switch (appTheme) {
      case 'dark':
        naiveCommon = darkNaiveTheme;
        break;
      default:
        break;
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

  // 设置主题style
  const getThemeStyle = computed(() => {
    const appTheme = unref(getAppTheme);
    const appThemeColor = unref(getAppThemeColor);
    // 顶栏
    let appHeaderBackColor = defaultVariable.headerBackColor;
    let appHeaderTextColor = defaultVariable.headerTextColor;
    if (unref(getHeadIsDark)) {
      appHeaderBackColor = darkVariable.headerBackColor;
      appHeaderTextColor = darkVariable.headerTextColor;
    }
    // 侧边栏
    let appSiderBackColor = defaultVariable.headerBackColor;
    let appSiderTextColor = defaultVariable.headerTextColor;
    if (unref(getSiderIsDark)) {
      appSiderBackColor = darkVariable.headerBackColor;
      appSiderTextColor = darkVariable.headerTextColor;
    }
    // 底部
    let appFooterBackColor = defaultVariable.footerBackColor;
    let appFooterTextColor = defaultVariable.footerTextColor;
    if (appTheme === 'dark') {
      appFooterBackColor = darkVariable.footerBackColor;
      appFooterTextColor = darkVariable.footerTextColor;
    }
    // 标签栏
    let appTabsViewBackColor = defaultVariable.tabsViewBackColor;
    let appTabsViewBtnBackColor = defaultVariable.tabsViewBtnBackColor;
    let appTabsViewBtnActiveTextColor = appThemeColor;
    let appTabsViewBtnActiveBackColor = defaultVariable.tabsViewBtnBackColor;
    let appTabsViewBtnTextColor = defaultVariable.tabsViewBtnTextColor;
    if (appTheme === 'dark') {
      appTabsViewBackColor = darkVariable.tabsViewBackColor;
      appTabsViewBtnBackColor = darkVariable.tabsViewBtnBackColor;
      appTabsViewBtnActiveBackColor = appThemeColor;
      appTabsViewBtnActiveTextColor = darkVariable.tabsViewBtnActiveTextColor;
      appTabsViewBtnTextColor = darkVariable.tabsViewBtnTextColor;
    }
    // 全局
    let appBackgroundColor = defaultVariable.backgroundColor;
    let appFontColor = defaultVariable.fontColor;
    if (appTheme === 'dark') {
      appBackgroundColor = darkVariable.backgroundColor;
      appFontColor = darkVariable.fontColor;
    }
    return {
      '--app-theme-color': appThemeColor,
      '--app-header-back-color': appHeaderBackColor,
      '--app-header-text-color': appHeaderTextColor,
      '--app-sider-back-color': appSiderBackColor,
      '--app-sider-text-color': appSiderTextColor,
      '--app-footer-back-color': appFooterBackColor,
      '--app-footer-text-color': appFooterTextColor,
      '--app-tabs-view-back-color': appTabsViewBackColor,
      '--app-tabs-view-btn-back-color': appTabsViewBtnBackColor,
      '--app-tabs-view-btn-active-back-color': appTabsViewBtnActiveBackColor,
      '--app-tabs-view-btn-active-text-color': appTabsViewBtnActiveTextColor,
      '--app-tabs-view-btn-text-color': appTabsViewBtnTextColor,
      '--app-background-color': appBackgroundColor,
      '--app-font-color': appFontColor,
    };
  });

  return {
    getThemeOverrides,
    getThemeStyle,
  };
};
