<script lang="ts">
  import { defineComponent, reactive, computed, ref, toRefs, unref, provide, watch, onMounted, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useRouteStore, useTabsViewStore } from '@/store';
  import { useMessage } from 'naive-ui';
  import Draggable from 'vuedraggable';
  import { DownOutlined, ReloadOutlined, CloseOutlined, ColumnWidthOutlined, MinusOutlined, LeftOutlined, RightOutlined, renderIcon } from '@/utils';
  import elementResizeDetectorMaker from 'element-resize-detector';
  import { useSetting } from '@/hooks';
  import { PAGE_ENUM } from '@/constant';
  import { RouteItem } from '/#/router';

  export default defineComponent({
    name: 'TabsView',
    components: {
      DownOutlined,
      CloseOutlined,
      LeftOutlined,
      RightOutlined,
      Draggable,
    },
    setup() {
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
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop; // 滚动条偏移量
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
            let tagList = navScroll.value.querySelectorAll('.tabs-card-scroll-item') || [];
            [...tagList].forEach((tag: HTMLElement) => {
              // fix SyntaxError
              if (tag.id === `tag${state.activeKey.split('/').join('\/')}`) {
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
        let observer;
        observer = elementResizeDetectorMaker();
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
    },
  });
</script>

<template>
  <div
    class="layout-tabs-view"
    :class="{
      'layout-tabs-view-default-background': getIsDarkTheme === false,
      'layout-tabs-view-dark-background': getIsDarkTheme === true,
    }"
  >
    <div class="layout-tabs-view-main">
      <div ref="navWrap" class="tabs-card" :class="{ 'tabs-card-scrollable': scrollable }">
        <span class="tabs-card-prev" :class="{ 'tabs-card-prev-hide': !scrollable }" @click="scrollPrev">
          <n-icon size="16" color="#515a6e">
            <LeftOutlined />
          </n-icon>
        </span>
        <span class="tabs-card-next" :class="{ 'tabs-card-next-hide': !scrollable }" @click="scrollNext">
          <n-icon size="16" color="#515a6e">
            <RightOutlined />
          </n-icon>
        </span>
        <div ref="navScroll" class="tabs-card-scroll">
          <Draggable v-model="tabsList" animation="300" item-key="fullPath" class="flex">
            <template #item="{ element }">
              <div
                :id="`tag${element.fullPath.split('/').join('\/')}`"
                class="tabs-card-scroll-item"
                :class="{ 'active-item': activeKey === element.path }"
                @click.stop="goPage(element)"
                @contextmenu="handleContextMenu($event, element)"
              >
                <span>{{ element.meta.title }}</span>
                <n-icon v-if="element.path !== baseHome" size="14" @click.stop="closeTabItem(element)">
                  <CloseOutlined />
                </n-icon>
              </div>
            </template>
          </Draggable>
        </div>
      </div>
      <div class="tabs-close">
        <n-dropdown trigger="hover" placement="bottom-end" :options="TabsMenuOptions" @select="closeHandleSelect">
          <div class="tabs-close-btn">
            <n-icon size="16" color="#515a6e">
              <DownOutlined />
            </n-icon>
          </div>
        </n-dropdown>
      </div>
      <n-dropdown
        :show="showDropdown"
        :x="dropdownX"
        :y="dropdownY"
        placement="bottom-start"
        :options="TabsMenuOptions"
        @clickoutside="onClickOutside"
        @select="closeHandleSelect"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .layout-tabs-view {
    display: flex;
    align-items: center;
    width: 100%;
    height: $tabs-view-height;
    transition: all 0.2s ease-in-out;

    &-main {
      display: flex;
      min-width: 100%;
      max-width: 100%;
      height: 32px;

      // padding: 0 10px;

      .tabs-card {
        position: relative;
        flex-grow: 1;
        flex-shrink: 1;
        overflow: hidden;
        -webkit-box-flex: 1;

        .tabs-card-prev,
        .tabs-card-next {
          position: absolute;
          width: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;

          .n-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
          }
        }

        .tabs-card-prev {
          left: 0;
        }

        .tabs-card-next {
          right: 0;
        }

        .tabs-card-next-hide,
        .tabs-card-prev-hide {
          display: none;
        }

        &-scroll {
          overflow: hidden;
          white-space: nowrap;

          &-item {
            position: relative;
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            height: 32px;
            margin-right: 6px;
            padding: 6px 16px 4px;
            color: var(--text-color);
            background: var(--color);
            border-radius: 3px;
            cursor: pointer;

            span {
              float: left;
              margin-right: 5px;
              vertical-align: middle;
            }

            &:hover {
              color: #515a6e;
            }

            // .n-icon {
            //   position: relative;
            //   width: 21px;
            //   height: 22px;
            //   margin-right: -6px;
            //   color: #808695;
            //   text-align: center;
            //   vertical-align: middle;

            //   &:hover {
            //     color: #515a6e !important;
            //   }

            //   svg {
            //     display: inline-block;
            //     height: 21px;
            //   }
            // }
          }

          .active-item {
            color: v-bind(get_app_theme);
          }
        }
      }

      .tabs-card-scrollable {
        padding: 0 32px;
        overflow: hidden;
      }
    }

    .tabs-close {
      width: 32px;
      min-width: 32px;
      height: 32px;
      padding-right: 15px;
      line-height: 32px;
      text-align: center;
      background: var(--color);
      border-radius: 2px;
      cursor: pointer;

      &-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color);
      }
    }
  }

  .layout-tabs-view-default-background {
    background: #efeeee;
  }

  .layout-tabs-view-dark-background {
    background: #101014;
  }

  .layout-tabs-view-fix {
    position: fixed;
    left: 200px;
    z-index: 5;
    padding: 6px 19px 6px 10px;
  }

  .layout-tabs-view-fixed-header {
    top: 0;
  }
</style>
