<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition :name="getTransitionName" mode="out-in" appear>
        <keep-alive v-if="keepAliveComponents" :include="keepAliveComponents">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component :is="Component" v-else :key="route.fullPath" />
      </transition>
    </template>
  </router-view>
</template>

<script>
  import { defineComponent, computed, unref } from 'vue';
  import { useRouteStore } from '@/store';
  import { useSetting } from '@/hooks';

  export default defineComponent({
    name: 'LayoutMain',
    components: {},
    props: {
      notNeedKey: {
        type: Boolean,
        default: false,
      },
      animate: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
      const { getIsPageAnimate, getPageAnimateType } = useSetting();
      const routeStore = useRouteStore();
      // 需要缓存的路由组件
      const keepAliveComponents = computed(() => routeStore.keepAliveComponents);

      const getTransitionName = computed(() => {
        return unref(getIsPageAnimate) ? unref(getPageAnimateType) : '';
      });

      return {
        keepAliveComponents,
        getTransitionName,
      };
    },
  });
</script>

<style lang="scss" scoped></style>
