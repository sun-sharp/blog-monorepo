<template>
  <n-config-provider :locale="zhCN" :theme="getDarkTheme" :theme-overrides="getThemeOverrides" :date-locale="dateZhCN">
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
  import { computed } from 'vue';
  import { zhCN, dateZhCN } from 'naive-ui';
  import AppProviderLoading from '@/components/app/provider/app-provider-loading.vue';
  import AppProviderDialog from '@/components/app/provider/app-provider-dialog.vue';
  import AppProviderMessage from '@/components/app/provider/app-provider-message.vue';
  import { store } from '@/store';

  // const designStore = useDesignSettingStore();

  /**
   * @type import('naive-ui').GlobalThemeOverrides 设置主题样式
   */
  const getThemeOverrides = computed(() => {
    // const appTheme = designStore.appTheme;
    // const lightenStr = lighten(designStore.appTheme, 6);
    return {
      common: {
        // primaryColor: appTheme,
        // primaryColorHover: lightenStr,
        // primaryColorPressed: lightenStr,
      },
      LoadingBar: {
        // colorLoading: appTheme,
      },
    };
  });

  // 获取主题样式
  // const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));
  const getDarkTheme = undefined;
  console.log(store);
</script>
