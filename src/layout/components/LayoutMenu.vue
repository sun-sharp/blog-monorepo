<script lang="ts" setup>
  import { LayoutMenuProps, useLayoutMenu } from '@/layout/hooks/useLayoutMenu';

  const props = defineProps(LayoutMenuProps);

  const emit = defineEmits(['update:collapsed']);

  const { menus, getInverted, openKeys, selectedKeys, menuExpanded, clickMenuItem } = useLayoutMenu(props, emit);
</script>

<template>
  <n-menu
    :options="menus"
    :inverted="getInverted"
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
