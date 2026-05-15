<template>
  <n-config-provider :style="getThemeStyle" :locale="zhCN" :theme-overrides="getThemeOverrides" :date-locale="dateZhCN">
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
  import AppProviderLoading from '@/components/app/provider/AppProviderLoading.vue';
  import AppProviderDialog from '@/components/app/provider/AppProviderDialog.vue';
  import AppProviderMessage from '@/components/app/provider/AppProviderMessage.vue';
  import { zhCN, dateZhCN } from 'naive-ui';
  import { useAppProvider } from '@/components/hooks/useAppProvider';

  const { getThemeOverrides, getThemeStyle } = useAppProvider();
</script>
