import { useSetting } from '@/hooks';
import { useUserStore } from '@/store';
import { ComputedRef, ExtractPropTypes, reactive, ref, toRefs, unref } from 'vue';
import { ApiConfigInfo } from '/#/api/configuration';

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
  });

  const userStore = useUserStore();

  // 配置信息
  const {
    getIsDarkTheme,
    getNavMode,
    getMenuSetting,
    getHeaderSetting,
    getMultiTabsSetting,
    getCrumbsSetting,
    getAppTheme,
    getIsPageAnimate,
    getPageAnimateType,
    getFooterSetting,
    getSiderIsDark,
    getTopBarStyle,
  } = useSetting();

  // 复制computed的内容
  const copyComputedObj = (obj: ComputedRef) => {
    return Object.assign({}, unref(obj));
  };
  const configInfo: ApiConfigInfo = reactive({
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
    siderIsDark: unref(getSiderIsDark),
    topBarStyle: unref(getTopBarStyle),
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

  const togNavMode = (mode: string) => {
    configInfo.navMode = mode;
    drawerSettingSubmit();
  };

  // 切换主题色
  const togTheme = (color: string) => {
    configInfo.appTheme = color;
    drawerSettingSubmit();
  };

  // 单选组件
  const radioChange = () => drawerSettingSubmit();

  // 开关组件变化
  const switchChange = () => drawerSettingSubmit();

  // 选择器
  const selectChange = () => drawerSettingSubmit();

  return {
    ...toRefs(state),
    ...toRefs(configInfo),
    submitLoading,
    togNavMode,
    togTheme,
    openDrawer,
    closeDrawer,
    drawerSettingSubmit,
    radioChange,
    switchChange,
    selectChange,
  };
};
