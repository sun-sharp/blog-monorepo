<template>
  <n-loading-bar-provider>
    <app-loading-content />
    <n-dialog-provider>
      <app-dialog-content />
      <n-notification-provider>
        <n-message-provider>
          <app-message-content />
          <slot></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<script lang="ts" setup>
  import { NDialogProvider, NNotificationProvider, NMessageProvider, NLoadingBarProvider } from 'naive-ui';
  import AppMessageContent from '@/components/app-message-content.vue';
  import AppDialogContent from '@/components/app-dialog-content.vue';
  import AppLoadingContent from '@/components/app-loading-content.vue';
</script>
