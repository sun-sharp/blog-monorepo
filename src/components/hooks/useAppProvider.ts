import { computed, unref } from 'vue';
import { ThemeCommonVars, darkTheme, useThemeVars } from 'naive-ui';
import { lighten } from '@/utils';
import { useSetting } from '@/hooks';

// 处理Naive主题样式
const formatNaiveTheme = (naiveCommon: ThemeCommonVars, otherCommon: Partial<ThemeCommonVars>) => {
  return { ...naiveCommon, ...otherCommon };
};

// app 配置
export const useAppProvider = () => {
  const { getAppTheme, getAppThemeColor } = useSetting();

  console.log(useThemeVars());

  console.log(darkTheme, 'darkTheme');

  // 设置主题样式
  const getThemeOverrides = computed(() => {
    const appTheme = unref(getAppTheme);
    // 默认naive主题
    let naiveCommon: ThemeCommonVars = unref(useThemeVars());
    switch (appTheme) {
      case 'dark':
        naiveCommon = darkTheme.common;
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
    console.log(otherCommon, 'otherCommon');

    return {
      common: formatNaiveTheme(naiveCommon, otherCommon),
    };
  });

  // 设置主题style
  const getThemeStyle = computed(() => {
    const appThemeColor = unref(getAppThemeColor);

    return {
      '--app-theme-color': appThemeColor,
    };
  });

  return {
    getThemeOverrides,
    getThemeStyle,
  };
};
