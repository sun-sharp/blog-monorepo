import { PAGE_ENUM } from '@/constant';
import { useSetting } from '@/hooks';
import { useRouteStore, useTabsViewStore } from '@/store';
import elementResizeDetectorMaker from 'element-resize-detector';
import { useMessage } from 'naive-ui';
import { computed, nextTick, onMounted, provide, reactive, ref, toRefs, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RouteItem } from '/#/router';
import { CloseOutlined, ColumnWidthOutlined, MinusOutlined, ReloadOutlined, renderIcon } from '@/utils';

/* 处理tabsView */
export const useTabsView = () => {
  const { getIsDarkTheme, getAppTheme, getHeaderSetting, getMultiTabsSetting } = useSetting();

  const message = useMessage();
  const route = useRoute();
  const router = useRouter();
  const tabsViewStore = useTabsViewStore();
  const routeStore = useRouteStore();
  const navScroll: any = ref(null);
  const navWrap: any = ref(null);
  const isCurrent = ref(false);

  const state = reactive({
    activeKey: route.fullPath,
    scrollable: false,
    dropdownX: 0,
    dropdownY: 0,
    showDropdown: false,
    isMultiHeaderFixed: false,
    multiTabsSetting: getMultiTabsSetting,
  });

  // 获取简易的路由对象
  const getSimpleRoute = (route: RouteItem): RouteItem => {
    const { fullPath, hash, meta, name, params, path, query } = route;
    return { fullPath, hash, meta, name, params, path, query };
  };

  //tags 右侧下拉菜单
  const TabsMenuOptions = computed(() => {
    const isDisabled = unref(tabsList).length <= 1;
    return [
      {
        label: '刷新当前',
        key: '1',
        icon: renderIcon(ReloadOutlined),
      },
      {
        label: `关闭当前`,
        key: '2',
        disabled: unref(isCurrent) || isDisabled,
        icon: renderIcon(CloseOutlined),
      },
      {
        label: '关闭其他',
        key: '3',
        disabled: isDisabled,
        icon: renderIcon(ColumnWidthOutlined),
      },
      {
        label: '关闭全部',
        key: '4',
        disabled: isDisabled,
        icon: renderIcon(MinusOutlined),
      },
    ];
  });

  let routes: RouteItem[] = [];

  // 默认tag
  const defaultTag = {
    fullPath: PAGE_ENUM.HOME_PATH,
    meta: { title: PAGE_ENUM.HOME_TITLE },
    name: PAGE_ENUM.HOME_NAME,
    path: PAGE_ENUM.HOME_PATH,
  };
  routes = defaultTag.fullPath === route.fullPath ? [getSimpleRoute(route as RouteItem)] : [getSimpleRoute(defaultTag), getSimpleRoute(route as RouteItem)];

  // 初始化标签页
  tabsViewStore.initTabs(routes);

  //监听滚动条
  function onScroll() {
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop; // 滚动条偏移量
    state.isMultiHeaderFixed = !!(!unref(getHeaderSetting).fixed && unref(getMultiTabsSetting).fixed && scrollTop >= 64);
  }

  window.addEventListener('scroll', onScroll, true);

  // 移除缓存组件名称
  const delKeepAliveCompName = () => {
    if (route.meta.keepAlive) {
      const name = router.currentRoute.value.matched.find((item) => item.name == route.name)?.components?.default.name;
      if (name) {
        routeStore.keepAliveComponents = routeStore.keepAliveComponents.filter((item) => item != name);
      }
    }
  };

  // 标签页列表
  const tabsList: any = computed(() => tabsViewStore.tabsList);

  const whiteList: string[] = [PAGE_ENUM.LOGIN_NAME, PAGE_ENUM.REDIRECT_NAME, PAGE_ENUM.ERROR_PAGE_NAME];

  watch(
    () => route.fullPath,
    (to) => {
      if (whiteList.includes(route.name as string)) return;
      state.activeKey = to;
      tabsViewStore.addTabs(getSimpleRoute(route as RouteItem));
      updateNavScroll(true);
    },
    { immediate: true }
  );

  // 关闭当前页面
  const removeTab = (route: RouteItem) => {
    if (tabsList.value.length === 1) {
      return message.warning('这已经是最后一页，不能再关闭了！');
    }
    delKeepAliveCompName();
    tabsViewStore.closeCurrentTab(route);
    // 如果关闭的是当前页
    if (state.activeKey === route.fullPath) {
      const currentRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)];
      state.activeKey = currentRoute.fullPath;
      router.push(currentRoute);
    }
    updateNavScroll();
  };

  // 刷新页面
  const reloadPage = () => {
    delKeepAliveCompName();
    router.push({
      path: '/redirect' + unref(route).fullPath,
    });
  };

  // 注入刷新页面方法
  provide('reloadPage', reloadPage);

  // 关闭左侧
  const closeLeft = (route: RouteItem) => {
    tabsViewStore.closeLeftTabs(route);
    state.activeKey = route.fullPath;
    router.replace(route.fullPath);
    updateNavScroll();
  };

  // 关闭右侧
  const closeRight = (route: RouteItem) => {
    tabsViewStore.closeRightTabs(route);
    state.activeKey = route.fullPath;
    router.replace(route.fullPath);
    updateNavScroll();
  };

  // 关闭其他
  const closeOther = (route: RouteItem) => {
    tabsViewStore.closeOtherTabs(route);
    state.activeKey = route.fullPath;
    router.replace(route.fullPath);
    updateNavScroll();
  };

  // 关闭全部
  const closeAll = () => {
    localStorage.removeItem('routes');
    tabsViewStore.closeAllTabs();
    router.replace(PAGE_ENUM.HOME_PATH);
    updateNavScroll();
  };

  //tab 操作
  const closeHandleSelect = (key: '1' | '2' | '3' | '4') => {
    switch (key) {
      //刷新
      case '1':
        reloadPage();
        break;
      //关闭
      case '2':
        removeTab(route as RouteItem);
        break;
      //关闭其他
      case '3':
        closeOther(route as RouteItem);
        break;
      //关闭所有
      case '4':
        closeAll();
        break;
    }
    updateNavScroll();
    state.showDropdown = false;
  };

  /**
   * @param value 要滚动到的位置
   * @param amplitude 每次滚动的长度
   */
  function scrollTo(value: number, amplitude: number): number | undefined {
    const currentScroll = navScroll.value.scrollLeft;
    const scrollWidth =
      (amplitude > 0 && currentScroll + amplitude >= value) || (amplitude < 0 && currentScroll + amplitude <= value) ? value : currentScroll + amplitude;
    navScroll.value && navScroll.value.scrollTo(scrollWidth, 0);
    if (scrollWidth === value) return;
    return window.requestAnimationFrame(() => scrollTo(value, amplitude));
  }

  function scrollPrev() {
    const containerWidth = navScroll.value.offsetWidth;
    const currentScroll = navScroll.value.scrollLeft;

    if (!currentScroll) return;
    const scrollLeft = currentScroll > containerWidth ? currentScroll - containerWidth : 0;
    scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
  }

  function scrollNext() {
    const containerWidth = navScroll.value.offsetWidth;
    const navWidth = navScroll.value.scrollWidth;
    const currentScroll = navScroll.value.scrollLeft;

    if (navWidth - currentScroll <= containerWidth) return;
    const scrollLeft = navWidth - currentScroll > containerWidth * 2 ? currentScroll + containerWidth : navWidth - containerWidth;
    scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
  }

  /**
   * @param autoScroll 是否开启自动滚动功能
   */
  async function updateNavScroll(autoScroll?: boolean) {
    await nextTick();
    if (!navScroll.value) return;
    const containerWidth = navScroll.value.offsetWidth;
    const navWidth = navScroll.value.scrollWidth;

    if (containerWidth < navWidth) {
      state.scrollable = true;
      if (autoScroll) {
        const tagList = navScroll.value.querySelectorAll('.tabs-card-scroll-item') || [];
        [...tagList].forEach((tag: HTMLElement) => {
          // fix SyntaxError
          if (tag.id === `tag${state.activeKey.split('/').join('/')}`) {
            tag.scrollIntoView && tag.scrollIntoView();
          }
        });
      }
    } else {
      state.scrollable = false;
    }
  }

  function handleResize() {
    updateNavScroll(true);
  }

  function handleContextMenu(e: MouseEvent, item: RouteItem) {
    e.preventDefault();
    isCurrent.value = PAGE_ENUM.HOME_PATH === item.path;
    state.showDropdown = false;
    nextTick().then(() => {
      state.showDropdown = true;
      state.dropdownX = e.clientX;
      state.dropdownY = e.clientY;
    });
  }

  function onClickOutside() {
    state.showDropdown = false;
  }

  //tags 跳转页面
  function goPage(e: RouteItem) {
    const { fullPath } = e;
    if (fullPath === route.fullPath) return;
    state.activeKey = fullPath;
    router.push({ path: fullPath });
  }

  //删除tab
  function closeTabItem(e: RouteItem) {
    const { fullPath } = e;
    const routeInfo = tabsList.value.find((item: RouteItem) => item.fullPath == fullPath);
    removeTab(routeInfo);
  }

  onMounted(() => {
    onElementResize();
  });

  function onElementResize() {
    const observer = elementResizeDetectorMaker();
    observer.listenTo(navWrap.value, handleResize);
  }

  return {
    ...toRefs(state),
    navWrap,
    navScroll,
    route,
    tabsList,
    baseHome: PAGE_ENUM.HOME_PATH,
    goPage,
    closeTabItem,
    closeLeft,
    closeRight,
    closeOther,
    closeAll,
    reloadPage,
    TabsMenuOptions,
    closeHandleSelect,
    scrollNext,
    scrollPrev,
    handleContextMenu,
    onClickOutside,
    getIsDarkTheme,
    get_app_theme: getAppTheme,
  };
};
