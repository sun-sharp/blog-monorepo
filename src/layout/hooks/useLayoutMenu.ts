import { generatorMenu, generatorMenuMix, isHttpUrl } from '@/utils';
import { ExtractPropTypes, computed, onMounted, ref, unref, watch } from 'vue';
import { NaiveMenuOption } from '/#/plugins/naive';
import { useSetting } from '@/hooks';
import { useRoute, useRouter } from 'vue-router';
import { useRouteStore } from '@/store';

// LayoutMenu传参
export const LayoutMenuProps = {
  mode: {
    // 菜单模式
    type: String,
    default: 'vertical',
  },
  collapsed: {
    // 侧边栏菜单是否收起
    type: Boolean,
  },
  inverted: {
    // 菜单主题
    type: Boolean,
    default: true,
  },
};

/* 处理LayoutMenu */
export const useLayoutMenu = (props: ExtractPropTypes<typeof LayoutMenuProps>, emit: (event: 'update:collapsed', ...args: any[]) => void) => {
  // 当前路由
  const currentRoute = useRoute();
  const router = useRouter();
  const routeStore = useRouteStore();
  const menus = ref<NaiveMenuOption[]>([]);
  const selectedKeys = ref<string>(currentRoute.name as string);

  const { getNavMode } = useSetting();

  // 获取当前打开的子菜单
  const matched = currentRoute.matched;

  const getOpenKeys = matched && matched.length ? matched.map((item) => item.name) : [];

  const openKeys = ref(getOpenKeys);

  const getInverted = computed(() => props.inverted);

  // 监听导航栏模式切换
  watch(
    () => unref(getNavMode),
    () => {
      updateMenu();
      if (props.collapsed) {
        emit('update:collapsed', !props.collapsed);
      }
    }
  );

  // 跟随页面路由变化，切换菜单选中状态
  watch(
    () => currentRoute.fullPath,
    () => {
      updateMenu();
      const matched = currentRoute.matched;
      openKeys.value = matched.map((item) => item.name);
      const activeMenu: string = (currentRoute.meta?.activeMenu as string) || '';
      selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.name as string);
    }
  );

  const updateMenu = () => {
    if (unref(getNavMode) === 'horizontal-mix') {
      // 混合菜单
      const firstRouteName: string = (currentRoute.name as string) || '';
      menus.value = generatorMenuMix(routeStore.getMenus, firstRouteName, props.mode);
    } else {
      menus.value = generatorMenu(routeStore.getMenus);
    }
  };

  // 点击菜单
  const clickMenuItem = (key: string, item: NaiveMenuOption) => {
    if (isHttpUrl(key)) {
      window.open(key);
    } else {
      router.push(item.path);
    }
  };

  //展开菜单
  const menuExpanded = (keys: string[]) => {
    if (!keys) return;
    const latestOpenKey = keys.find((key) => openKeys.value.indexOf(key) === -1);
    const isExistChildren = findChildrenLen(latestOpenKey as string);
    openKeys.value = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : keys;
  };

  //查找是否存在子路由
  const findChildrenLen = (key: string) => {
    if (!key) return false;
    const subRouteChildren: string[] = [];
    for (const { children, key } of unref(menus)) {
      if (children && children.length) {
        subRouteChildren.push(key as string);
      }
    }
    return subRouteChildren.includes(key);
  };

  onMounted(() => {
    updateMenu();
  });

  return {
    menus,
    selectedKeys,
    openKeys,
    getInverted,
    menuExpanded,
    clickMenuItem,
  };
};
