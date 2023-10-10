import { computed, ref, unref } from 'vue';
import { useRouter, useRoute, RouteLocationMatched, RouteRecordRaw } from 'vue-router';
import { SearchOutlined, LockOutlined, lighten } from '@/utils';
import { useDialog, useMessage } from 'naive-ui';
import { useLockScreenStore, useUserStore } from '@/store';
import { getImgUrl } from '@/utils';
import { useSearch, useSetting } from '@/hooks';
import { HeaderBreadcrumbItem } from '/#/layout/header';
import { PAGE_ENUM, darkNaiveTheme, defaultNaiveTheme } from '@/constant';
import { formatNaiveTheme } from '@/components/hooks/useAppProvider';
import { useFullscreen } from '@vueuse/core';

// LayoutHeader传参
export const LayoutHeaderProps = {
  collapsed: {
    type: Boolean,
  },
  className: {
    type: String,
    default: '',
  },
};

/* 处理LayoutHeader */
export const useLayoutHeader = () => {
  const userStore = useUserStore();
  const useLockScreen = useLockScreenStore();
  const message = useMessage();
  const dialog = useDialog();

  const { getAppThemeColor, getNavMode, getHeadIsDark, getHeaderReloadShow, getHeaderBreadcrumbShow, getHeaderBreadcrumbShowIcon } = useSetting();

  const { avatar: infoAvatar } = userStore?.info || {};

  const headerSettingRef = ref();

  // const fullscreenBool = ref(false);

  const avatar = computed(() => getImgUrl(infoAvatar));
  const navMode = computed(() => unref(getNavMode));
  const headerReloadShow = computed(() => unref(getHeaderReloadShow));
  const headerBreadcrumbShow = computed(() => unref(getHeaderBreadcrumbShow));
  const headerBreadcrumbShowIcon = computed(() => unref(getHeaderBreadcrumbShowIcon));

  const router = useRouter();
  const route = useRoute();

  // 修改顶部样式
  const headThemeOverrides = computed(() => {
    const isDark = unref(getHeadIsDark);
    // 默认naive主题
    let naiveCommon = defaultNaiveTheme;
    if (isDark) {
      naiveCommon = darkNaiveTheme;
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

  const generator = (routerMap: RouteLocationMatched[] | RouteRecordRaw[]): HeaderBreadcrumbItem[] => {
    return routerMap
      .filter((f) => f.path !== PAGE_ENUM.PAGE_PATH && f.path !== '/')
      .map((item) => {
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

  // 全屏控制
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

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
    navMode,
    headerReloadShow,
    headerBreadcrumbShow,
    headerBreadcrumbShowIcon,
    breadcrumbList,
    iconList,
    isFullscreen,
    avatar,
    avatarOptions,
    headThemeOverrides,
    headerSettingRef,
    reloadPage,
    dropdownSelect,
    toggleFullscreen,
    avatarSelect,
    openSetting,
  };
};
