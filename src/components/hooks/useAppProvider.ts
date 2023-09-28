import { computed, unref } from 'vue';
import { darkTheme, useThemeVars } from 'naive-ui';
import { lighten } from '@/utils';
import { useSetting } from '@/hooks';

// app 配置
export const useAppProvider = () => {
  const { getAppTheme, getIsDarkTheme } = useSetting();

  console.log(useThemeVars());

  // 设置主题样式
  const getThemeOverrides = computed(() => {
    const appTheme = unref(getAppTheme);
    const lightenStr = lighten(appTheme, 6);
    console.log(unref(getIsDarkTheme), darkTheme, JSON.stringify(darkTheme.Alert.common));

    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
      Switch: {
        primaryColor: appTheme,
      },
    };
  });

  // 设置主题style
  const getThemeStyle = computed(() => {
    const appTheme = unref(getAppTheme);

    return {
      '--app-theme-color': appTheme,
    };
  });

  return {
    getThemeOverrides,
    getThemeStyle,
  };
};
