<script lang="ts" setup>
  import { ref, onMounted, computed, watch, unref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useRouteStore } from '@/store';
  import { constantRouterIcon, generatorMenu, generatorMenuMix } from '@/utils';
  import { useSetting } from '@/hooks';
  import { PAGE_ENUM } from '@/constant';
  import { NaiveMenuOption } from '/#/plugins/naive';

  // const props =
  defineProps({
    mode: {
      // 菜单模式
      type: String,
      default: 'vertical',
    },
    collapsed: {
      // 侧边栏菜单是否收起
      type: Boolean,
    },
  });
  // const emit = defineEmits(['update:collapsed']);

  // 当前路由
  const currentRoute = useRoute();
  const router = useRouter();
  const routeStore = useRouteStore();
  const menus = ref<NaiveMenuOption[]>([]);
  const selectedKeys = ref<string>(currentRoute.name as string);
  // const headerMenuSelectKey = ref<string>('');

  const {
    //  getNavMode,
    getNavTheme,
    getMenuSetting,
  } = useSetting();

  // const navMode = getNavMode;

  // 获取当前打开的子菜单
  const matched = currentRoute.matched;

  const getOpenKeys = matched && matched.length ? matched.map((item) => item.name) : [];

  const openKeys = ref(getOpenKeys);

  const inverted = computed(() => {
    return ['dark', 'header-dark'].includes(unref(getNavTheme));
  });

  // const getSelectedKeys = computed(() => {
  //   return unref(navMode) === 'horizontal' ? unref(selectedKeys) : unref(headerMenuSelectKey);
  // });

  // 监听分割菜单
  // watch(
  //   () => unref(getMenuSetting).mixMenu,
  //   () => {
  //     updateMenu();
  //     if (props.collapsed) {
  //       emit('update:collapsed', !props.collapsed);
  //     }
  //   }
  // );

  // 跟随页面路由变化，切换菜单选中状态
  watch(
    () => currentRoute.fullPath,
    () => {
      updateMenu();
      // const matched = currentRoute.matched;
      // openKeys.value = matched.map((item) => item.name);
      // const activeMenu: string = (currentRoute.meta?.activeMenu as string) || '';
      // selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.name as string);
    }
  );

  const updateMenu = () => {
    // 默认菜单
    const defaultMenu: NaiveMenuOption[] = [
      {
        icon: constantRouterIcon[PAGE_ENUM.HOME_ICON],
        key: PAGE_ENUM.HOME_NAME,
        label: PAGE_ENUM.HOME_TITLE,
      },
    ];
    if (!unref(getMenuSetting).mixMenu) {
      menus.value = [...defaultMenu, ...generatorMenu(routeStore.getMenus)];
    } else {
      // 混合菜单
      const firstRouteName: string = (currentRoute.matched[0].name as string) || '';
      menus.value = [...defaultMenu, ...generatorMenuMix(routeStore.getMenus, firstRouteName)];
      // const activeMenu: string = currentRoute?.matched[0].meta?.activeMenu as string;
      // headerMenuSelectKey.value = (activeMenu ? activeMenu : firstRouteName) || '';
    }
  };

  // 点击菜单
  const clickMenuItem = (key: string) => {
    if (/http(s)?:/.test(key)) {
      window.open(key);
    } else {
      router.push({ name: key });
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
</script>

<template>
  <n-menu
    :options="menus"
    :inverted="inverted"
    :mode="mode"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :expanded-keys="openKeys"
    :value="selectedKeys"
    @update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
  />
</template>
