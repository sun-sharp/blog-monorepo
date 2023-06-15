<script lang="ts" setup>
  import { Pie, PieOptions } from '@antv/g2plot';
  import { ref, toRefs, nextTick, watch } from 'vue';

  const props = defineProps({
    chartData: {
      type: Array<any>,
      default: () => [],
    },
    customCfg: {
      type: Object,
      default: () => ({}),
    },
  });

  const chartElRef = ref<any>(null);
  const { chartData } = toRefs(props);

  let chart: Pie;
  const renderChart = () => {
    if (!chartElRef.value) return;
    const arr = chartData.value;
    const { customCfg } = props;
    if (!chart) {
      const cfg: PieOptions = {
        appendPadding: 10,
        data: arr,
        angleField: 'value',
        colorField: 'name',
        radius: 0.85,
        innerRadius: 0.65,
        legend: false,
        interactions: [{ type: 'element-active' }],
      };
      // if (tooltipFormatter) {
      //   cfg.tooltip.formatter = tooltipFormatter;
      // }
      if (customCfg) {
        Object.assign(cfg, customCfg);
      }
      chart = new Pie(chartElRef.value, cfg);
      chart.render();
    } else {
      chart.update({ data: arr });
    }
  };
  const nextTickRender = () => nextTick(renderChart);
  watch(chartData, nextTickRender, { immediate: true, deep: true });
</script>

<template>
  <div ref="chartElRef" class="inner-pie-chart"></div>
</template>

<style lang="scss">
  .inner-pie-chart {
    width: 100%;
    height: 100%;
  }
</style>
