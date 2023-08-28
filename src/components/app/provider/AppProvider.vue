<template>
  <n-config-provider :locale="zhCN" :theme="getTheme" :theme-overrides="getThemeOverrides" :date-locale="dateZhCN">
    <app-provider-loading>
      <app-provider-dialog>
        <n-notification-provider>
          <app-provider-message>
            <slot></slot>
          </app-provider-message>
        </n-notification-provider>
      </app-provider-dialog>
    </app-provider-loading>
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
   * @type import('naive-ui').GlobalThemeOverrides 设置主题样式
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
