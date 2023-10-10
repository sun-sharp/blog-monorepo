import { useSetting } from '@/hooks';
import { useUserStore } from '@/store';
import { ExtractPropTypes, reactive, ref, toRefs, unref } from 'vue';
import { ApiAppTheme, ApiConfigInfo } from '/#/api/configuration';

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
    getAppTheme,
    getAppThemeColor,
    getNavMode,
    getSiderIsDark,
    getHeadIsDark,
    getHeadFixed,
    getTabsViewShow,
    getTabsViewFixed,
    getFooterShow,
    getFooterFixed,
    getHeaderReloadShow,
    getHeaderBreadcrumbShow,
    getHeaderBreadcrumbShowIcon,
  } = useSetting();

  // 复制computed的内容
  // const copyComputedObj = (obj: ComputedRef) => {
  //   return Object.assign({}, unref(obj));
  // };
  const configInfo: ApiConfigInfo = reactive({
    appTheme: unref(getAppTheme),
    appThemeColor: unref(getAppThemeColor),
    navMode: unref(getNavMode),
    siderIsDark: unref(getSiderIsDark),
    headIsDark: unref(getHeadIsDark),
    headFixed: unref(getHeadFixed),
    tabsViewShow: unref(getTabsViewShow),
    tabsViewFixed: unref(getTabsViewFixed),
    footerFixed: unref(getFooterFixed),
    headerReloadShow: unref(getHeaderReloadShow),
    headerBreadcrumbShow: unref(getHeaderBreadcrumbShow),
    headerBreadcrumbShowIcon: unref(getHeaderBreadcrumbShowIcon),
    footerShow: unref(getFooterShow),
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

  // 切换主题 val: ApiAppTheme
  const togTheme = (val: ApiAppTheme) => {
    if (val === 'dark') {
      configInfo.siderIsDark = true;
      configInfo.headIsDark = true;
    } else if (val === 'light') {
      configInfo.siderIsDark = false;
      configInfo.headIsDark = false;
    }
  };

  const togNavMode = (mode: string) => {
    configInfo.navMode = mode;
  };

  // 切换主题色
  const togThemeColor = (color: string) => {
    configInfo.appThemeColor = color;
  };

  // 单选组件
  const radioChange = () => {};

  // 开关组件变化
  const switchChange = () => {};

  // 选择器
  const selectChange = () => {};

  return {
    ...toRefs(state),
    ...toRefs(configInfo),
    submitLoading,
    togTheme,
    togThemeColor,
    togNavMode,
    openDrawer,
    closeDrawer,
    radioChange,
    switchChange,
    selectChange,
    drawerSettingSubmit,
  };
};
