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
    return {
      '--app-theme-color': appThemeColor,
      '--app-header-back-color': appHeaderBackColor,
      '--app-header-text-color': appHeaderTextColor,
      '--app-sider-back-color': appSiderBackColor,
      '--app-sider-text-color': appSiderTextColor,
    };
  });

  return {
    getThemeOverrides,
    getThemeStyle,
  };
};
