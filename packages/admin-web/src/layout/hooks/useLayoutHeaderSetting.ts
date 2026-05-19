import { useSetting } from '@/hooks';
import { useUserStore } from '@/store';
import { ExtractPropTypes, computed, nextTick, reactive, ref, toRefs, unref } from 'vue';
import { ApiAppTheme, ApiConfigInfo } from '/#/api/capital/configuration';

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
    getHasPageAnimate,
    getPageAnimateType,
  } = useSetting();

  // 默认配置
  const defaultConfigInfo = computed<ApiConfigInfo>(() => {
    return {
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
      hasPageAnimate: unref(getHasPageAnimate),
      pageAnimateType: unref(getPageAnimateType),
    };
  });

  const configInfo = reactive<ApiConfigInfo>(JSON.parse(JSON.stringify(unref(defaultConfigInfo))));

  // 重置
  const drawerReset = () => {
    nextTick(() => {
      const defaultInfo = unref(defaultConfigInfo);
      Object.assign(configInfo, defaultInfo);
    });
  };

  // 展开
  const openDrawer = () => {
    state.isDrawer = true;
    drawerReset();
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

  const togNavMode = () => {};

  // 切换主题色
  const togThemeColor = (color: string) => {
    configInfo.appThemeColor = color;
  };

  // 显示标签页
  const tabsViewShowChange = () => {
    configInfo.tabsViewFixed = true;
  };

  // 显示页脚
  const footerShowChange = () => {
    configInfo.footerFixed = true;
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
    tabsViewShowChange,
    footerShowChange,
    openDrawer,
    closeDrawer,
    radioChange,
    switchChange,
    selectChange,
    drawerReset,
    drawerSettingSubmit,
  };
};
