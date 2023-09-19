import { APP_THEME_LIST } from '@/constant';
import { useSetting } from '@/hooks';
import { useUserStore } from '@/store';
import { ComputedRef, ExtractPropTypes, reactive, ref, toRefs, unref } from 'vue';
import { CUserConfigInfo } from '/#/config';
import navThemeDarkImage from '@/assets/images/setting/nav-theme-dark.svg';
import navHorizontalImage from '@/assets/images/setting/nav-horizontal.svg';
import navHorizontalMixImage from '@/assets/images/setting/nav-horizontal-mix.svg';
import navThemeLightImage from '@/assets/images/setting/nav-theme-light.svg';
import headerThemeDarkImage from '@/assets/images/setting/header-theme-dark.svg';

// LayoutHeaderSetting传参
export const LayoutHeaderSettingProps = {
  title: {
    type: String,
    default: '项目配置',
  },
  width: {
    type: Number,
    default: 280,
  },
};

/* 处理LayoutHeaderSetting */
export const useLayoutHeaderSetting = (props: ExtractPropTypes<typeof LayoutHeaderSettingProps>) => {
  const state = reactive({
    width: props.width,
    title: props.title,
    isDrawer: false,
    placement: 'right',
    appThemeList: APP_THEME_LIST,
  });

  const userStore = useUserStore();

  // 配置信息
  const {
    getIsDarkTheme,
    getNavTheme,
    getNavMode,
    getMenuSetting,
    getHeaderSetting,
    getMultiTabsSetting,
    getCrumbsSetting,
    getAppTheme,
    getIsPageAnimate,
    getPageAnimateType,
    getFooterSetting,
  } = useSetting();

  // 复制computed的内容
  const copyComputedObj = (obj: ComputedRef) => {
    return Object.assign({}, unref(obj));
  };
  const configInfo: CUserConfigInfo = reactive({
    navTheme: unref(getNavTheme),
    isDarkTheme: unref(getIsDarkTheme),
    menuSetting: copyComputedObj(getMenuSetting),
    headerSetting: copyComputedObj(getHeaderSetting),
    multiTabsSetting: copyComputedObj(getMultiTabsSetting),
    crumbsSetting: copyComputedObj(getCrumbsSetting),
    appTheme: unref(getAppTheme),
    navMode: unref(getNavMode),
    isPageAnimate: unref(getIsPageAnimate),
    pageAnimateType: unref(getPageAnimateType),
    footerSetting: unref(getFooterSetting),
  });

  // 展开
  const openDrawer = () => {
    state.isDrawer = true;
  };

  // 关闭
  const closeDrawer = () => {
    state.isDrawer = false;
  };

  // 提交并保存
  const submitLoading = ref(false);
  const drawerSettingSubmit = () => {
    submitLoading.value = true;
    userStore.updateApiConfigInfo(Object.assign({}, configInfo)).finally(() => {
      submitLoading.value = false;
    });
  };

  // 切换导航模式
  const navModeArr = [
    {
      title: '左侧菜单模式',
      name: 'vertical',
      image: navThemeDarkImage,
    },
    {
      title: '顶部菜单模式',
      name: 'horizontal',
      image: navHorizontalImage,
    },
    {
      title: '顶部菜单混合模式',
      name: 'horizontal-mix',
      image: navHorizontalMixImage,
    },
  ];
  const togNavMode = (mode: string) => {
    configInfo.navMode = mode;
    configInfo.menuSetting.mixMenu = false;
    drawerSettingSubmit();
  };

  // 设置导航风格
  const navThemeArr = [
    {
      title: '暗色侧边栏',
      name: 'dark',
      image: navThemeDarkImage,
    },
    {
      title: '白色侧边栏',
      name: 'light',
      image: navThemeLightImage,
    },
    {
      title: '暗色顶栏',
      name: 'header-dark',
      image: headerThemeDarkImage,
    },
  ];
  const togNavTheme = (theme: string) => {
    let navTheme = theme;
    if (configInfo.navMode === 'horizontal' && ['light'].includes(theme)) {
      navTheme = 'dark';
    }
    if (configInfo.navTheme === navTheme) return;
    configInfo.navTheme = navTheme;
    drawerSettingSubmit();
  };

  // 切换主题色
  const togTheme = (color: string) => {
    configInfo.appTheme = color;
    drawerSettingSubmit();
  };

  // 开关组件变化
  const switchChange = () => drawerSettingSubmit();

  // 选择器
  const selectChange = () => drawerSettingSubmit();

  return {
    ...toRefs(state),
    ...toRefs(configInfo),
    submitLoading,
    navModeArr,
    navThemeArr,
    togNavTheme,
    togNavMode,
    togTheme,
    openDrawer,
    closeDrawer,
    drawerSettingSubmit,
    switchChange,
    selectChange,
  };
};
