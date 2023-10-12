import { computed, unref } from 'vue';
import { ThemeCommonVars } from 'naive-ui';
import { lighten } from '@/utils';
import { useLayoutSizeSetting, useSetting } from '@/hooks';
import { darkNaiveTheme, darkVariable, defaultNaiveTheme, defaultVariable } from '@/constant';

// 处理Naive主题样式
export const formatNaiveTheme = (naiveCommon: ThemeCommonVars, otherCommon: Partial<ThemeCommonVars>) => {
  return { ...naiveCommon, ...otherCommon };
};

// app 配置
export const useAppProvider = () => {
  const { getAppTheme, getAppThemeColor, getHeadIsDark, getSiderIsDark } = useSetting();

  // layout的高度和宽度
  const { headerHeight, footerHeight, tabsViewHeight } = useLayoutSizeSetting();

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
    const themeColor = unref(getAppThemeColor);

    let {
      // 顶栏
      headerBackColor,
      headerTextColor,
      // 侧边栏
      siderBackColor,
      siderTextColor,
      // 底部
      footerBackColor,
      footerTextColor,
      // 标签栏
      tabsViewBackColor,
      tabsViewBtnBackColor,
      tabsViewBtnTextColor,
      // 全局
      backgroundColor,
      fontColor,
      borderDivideColor,
      // 滚动条
      scrollbarThumbBackColor,
      scrollbarThumbHoverBackColor,
      scrollbarTrackPieceBackColor,
      // 卡片
      cardBackgroundColor,
      cardBoxShadow,
    } = defaultVariable;
    const { cardBorderRadius, cardBorderColor, borderInputColor, textWarningColor } = defaultVariable;
    // 顶栏
    if (unref(getHeadIsDark)) {
      headerBackColor = darkVariable.headerBackColor;
      headerTextColor = darkVariable.headerTextColor;
    }
    // 侧边栏
    if (unref(getSiderIsDark)) {
      siderBackColor = darkVariable.siderBackColor;
      siderTextColor = darkVariable.siderTextColor;
    }
    // 底部
    if (appTheme === 'dark') {
      footerBackColor = darkVariable.footerBackColor;
      footerTextColor = darkVariable.footerTextColor;
    }
    // 标签栏
    let tabsViewBtnActiveTextColor = themeColor;
    let tabsViewBtnActiveBackColor = defaultVariable.tabsViewBtnBackColor;
    if (appTheme === 'dark') {
      tabsViewBackColor = darkVariable.tabsViewBackColor;
      tabsViewBtnBackColor = darkVariable.tabsViewBtnBackColor;
      tabsViewBtnActiveBackColor = themeColor;
      tabsViewBtnActiveTextColor = darkVariable.tabsViewBtnActiveTextColor;
      tabsViewBtnTextColor = darkVariable.tabsViewBtnTextColor;
    }
    // 全局
    if (appTheme === 'dark') {
      backgroundColor = darkVariable.backgroundColor;
      fontColor = darkVariable.fontColor;
      borderDivideColor = darkVariable.borderDivideColor;
    }
    // 滚动条
    if (appTheme === 'dark') {
      scrollbarThumbBackColor = darkVariable.scrollbarThumbBackColor;
      scrollbarThumbHoverBackColor = darkVariable.scrollbarThumbHoverBackColor;
      scrollbarTrackPieceBackColor = darkVariable.scrollbarTrackPieceBackColor;
    }
    // 卡片
    if (appTheme === 'dark') {
      cardBackgroundColor = darkVariable.cardBackgroundColor;
      cardBoxShadow = darkVariable.cardBoxShadow;
    }

    return {
      '--app-theme-color': themeColor,
      '--app-header-back-color': headerBackColor,
      '--app-header-text-color': headerTextColor,
      '--app-sider-back-color': siderBackColor,
      '--app-sider-text-color': siderTextColor,
      '--app-footer-back-color': footerBackColor,
      '--app-footer-text-color': footerTextColor,
      '--app-tabs-view-back-color': tabsViewBackColor,
      '--app-tabs-view-btn-back-color': tabsViewBtnBackColor,
      '--app-tabs-view-btn-active-back-color': tabsViewBtnActiveBackColor,
      '--app-tabs-view-btn-active-text-color': tabsViewBtnActiveTextColor,
      '--app-tabs-view-btn-text-color': tabsViewBtnTextColor,
      '--app-background-color': backgroundColor,
      '--app-font-color': fontColor,
      '--app-scrollbar-thumb-back-color': scrollbarThumbBackColor,
      '--app-scrollbar-thumb-hover-back-color': scrollbarThumbHoverBackColor,
      '--app-scrollbar-track-piece-back-color': scrollbarTrackPieceBackColor,
      '--app-card-background-color': cardBackgroundColor,
      '--app-card-box-shadow': cardBoxShadow,
      '--app-card-border-radius': cardBorderRadius,
      '--app-card-border-color': cardBorderColor,
      '--app-border-divide-color': borderDivideColor,
      '--app-border-input-color': borderInputColor,
      '--app-text-warning-color': textWarningColor,
      '--app-header-height': `${unref(headerHeight)}px`,
      '--app-footer-height': `${unref(footerHeight)}px`,
      '--app-tabs-view-height': `${unref(tabsViewHeight)}px`,
    };
  });

  return {
    getThemeOverrides,
    getThemeStyle,
  };
};
