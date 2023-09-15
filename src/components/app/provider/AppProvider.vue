<template>
  <n-config-provider :locale="zhCN" :theme="getTheme" :theme-overrides="getThemeOverrides" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <app-provider-loading />
      <n-dialog-provider>
        <app-provider-dialog />
        <n-notification-provider>
          <n-message-provider>
            <app-provider-message />
            <slot></slot>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
  import AppProviderLoading from '@/components/app/provider/AppProviderLoading.vue';
  import AppProviderDialog from '@/components/app/provider/AppProviderDialog.vue';
  import AppProviderMessage from '@/components/app/provider/AppProviderMessage.vue';
  import { lighten } from '@/utils';
  import { useSetting } from '@/hooks';

  const { getAppTheme, getIsDarkTheme } = useSetting();

  /**
   * @description 设置主题样式
   */
  const getThemeOverrides = computed(() => {
    const appTheme = unref(getAppTheme);
    const lightenStr = lighten(appTheme, 6);
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
    };
  });

  // 获取主题样式
  const getTheme = computed(() => (unref(getIsDarkTheme) ? darkTheme : undefined));
</script>
