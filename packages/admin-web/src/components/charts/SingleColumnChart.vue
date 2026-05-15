<script lang="ts" setup>
  import { Column, ColumnOptions } from '@antv/g2plot';
  import { ref, toRefs, nextTick, watch } from 'vue';

  const props = defineProps({
    chartData: {
      type: Array<any>,
      default: () => [],
    },
    xField: {
      type: String,
      default: 'x',
    },
    yField: {
      type: String,
      default: 'y',
    },
    customCfg: {
      type: Object,
      default: () => ({}),
    },
  });

  const chartElRef = ref<HTMLElement>();
  const { chartData, xField, yField } = toRefs(props);

  let chart: Column;
  const renderChart = () => {
    if (!chartElRef.value) return;
    const arr = chartData.value;
    const { customCfg } = props;
    if (!chart) {
      const cfg: ColumnOptions = {
        data: arr,
        xField: xField.value,
        yField: yField.value,
        xAxis: {
          label: {
            autoRotate: false,
          },
        },
        maxColumnWidth: 40,
        slider: {
          start: 0,
          end: 1,
        },
      };
      if (customCfg) {
        Object.assign(cfg, customCfg);
      }
      chart = new Column(chartElRef.value, cfg);
      chart.render();
    } else {
      chart.update({ data: arr });
    }
  };
  const nextTickRender = () => nextTick(renderChart);
  watch(chartData, nextTickRender, { immediate: true, deep: true });
</script>

<template>
  <div ref="chartElRef" class="single-column-chart"></div>
</template>

<style lang="scss">
  .single-column-chart {
    width: 100%;
    height: 100%;
  }
</style>
