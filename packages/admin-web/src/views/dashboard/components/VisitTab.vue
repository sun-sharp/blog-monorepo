<script lang="ts" setup>
  import FluxTrend from './FluxTrend.vue';
  import VisitAmount from './VisitAmount.vue';
</script>

<template>
  <div class="mt-16">
    <n-card content-style="padding: 0;" :bordered="false">
      <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="流量趋势">
          <FluxTrend />
        </n-tab-pane>
        <n-tab-pane name="访问量">
          <VisitAmount />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
