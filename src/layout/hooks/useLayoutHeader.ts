import { ExtractPropTypes, computed, reactive, ref, toRefs, unref } from 'vue';
import { useRouter, useRoute, RouteLocationMatched, RouteRecordRaw } from 'vue-router';
import { SearchOutlined, LockOutlined } from '@/utils';
import { useDialog, useMessage } from 'naive-ui';
import { useLockScreenStore, useUserStore } from '@/store';
import { getImgUrl } from '@/utils';
import { useSearch, useSetting } from '@/hooks';
import { HeaderBreadcrumbItem } from '/#/layout/header';

// LayoutHeader传参
export const LayoutHeaderProps = {
  collapsed: {
    type: Boolean,
  },
  inverted: {
    type: Boolean,
  },
};

/* 处理LayoutHeader */
export const useLayoutHeader = (props: ExtractPropTypes<typeof LayoutHeaderProps>) => {
  const userStore = useUserStore();
  const useLockScreen = useLockScreenStore();
  const message = useMessage();
  const dialog = useDialog();
  const { getNavMode, getNavTheme, getHeaderSetting, getMenuSetting, getCrumbsSetting } = useSetting();

  const { username, avatar } = userStore?.info || {};

  const headerSettingRef = ref();

  const fullscreenBool = ref(false);

  const state = reactive({
    username: username || '',
    avatar: getImgUrl(avatar) || '',
    navMode: getNavMode,
    navTheme: getNavTheme,
    headerSetting: getHeaderSetting,
    crumbsSetting: getCrumbsSetting,
  });

  const getInverted = computed(() => {
    const navTheme = unref(getNavTheme);
    return ['light', 'header-dark'].includes(navTheme) ? props.inverted : !props.inverted;
  });

  const mixMenu = computed(() => {
    return unref(getMenuSetting).mixMenu;
  });

  const router = useRouter();
  const route = useRoute();

  const generator = (routerMap: RouteLocationMatched[] | RouteRecordRaw[]): HeaderBreadcrumbItem[] => {
    return routerMap.map((item) => {
      const currentMenu: HeaderBreadcrumbItem = {
        icon: item?.meta?.icon,
        label: item?.meta?.title,
        key: item.name,
        disabled: item.path === '/',
      };
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        // Recursion
        currentMenu.children = generator(item.children);
      }
      return currentMenu;
    });
  };

  const breadcrumbList = computed(() => {
    return generator(route.matched);
  });

  const dropdownSelect = (key: string) => {
    router.push({ name: key });
  };

  // 刷新页面
  const reloadPage = () => {
    router.push({
      path: '/redirect' + unref(route).fullPath,
    });
  };

  // 退出登录
  const doLogout = () => {
    dialog.info({
      title: '提示',
      content: '您确定要退出登录吗',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.logout().then(() => {
          message.success('成功退出登录');
          router
            .replace({
              name: 'Login',
              query: {
                redirect: route.fullPath,
              },
            })
            .finally(() => location.reload());
        });
      },
      onNegativeClick: () => {},
    });
  };

  // 切换全屏图标
  const toggleFullscreenIcon = () => (fullscreenBool.value = document.fullscreenElement !== null);

  // 监听全屏切换事件
  document.addEventListener('fullscreenChange', toggleFullscreenIcon);

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 图标列表
  const iconList = [
    {
      icon: SearchOutlined,
      tips: '搜索',
      eventObject: {
        click: () => (useSearch.value = !useSearch.value),
      },
    },
    {
      icon: LockOutlined,
      tips: '锁屏',
      eventObject: {
        click: () => useLockScreen.setLock(true),
      },
    },
  ];

  // 图标列表
  const avatarOptions = [
    {
      label: '个人设置',
      key: 1,
    },
    {
      label: '密码设置',
      key: 2,
    },
    {
      label: '退出登录',
      key: 9,
    },
  ];

  //头像下拉菜单
  const avatarSelect = (key: number) => {
    switch (key) {
      case 1:
        router.push({ name: 'SettingAccount' });
        break;
      case 2:
        router.push({ name: 'SettingPassword' });
        break;
      case 9:
        doLogout();
        break;
    }
  };

  // 打开项目设置
  const openSetting = () => {
    const { openDrawer } = headerSettingRef.value;
    openDrawer();
  };

  return {
    ...toRefs(state),
    mixMenu,
    getInverted,
    breadcrumbList,
    iconList,
    fullscreenBool,
    avatar,
    avatarOptions,
    reloadPage,
    dropdownSelect,
    toggleFullscreen,
    avatarSelect,
    openSetting,
  };
};
