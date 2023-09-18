<script lang="ts" setup>
  import { ref, computed, watchEffect, unref, onMounted, watch } from 'vue';
  import { useTransition, TransitionPresets } from '@vueuse/core';
  import { isNumber } from '@/utils';

  const props = defineProps({
    startVal: { type: Number, default: 0 }, // 开始数字
    endVal: { type: Number, default: 0 }, // 最终数字
    duration: { type: Number, default: 1500 }, // 变化时长
    autoplay: { type: Boolean, default: true }, // 是否启动变化
    decimals: {
      type: Number,
      default: 0,
      validator(value: number) {
        return value >= 0;
      },
    }, // 精度，保留小数点后几位
    prefix: { type: String, default: '' }, // 数值前
    suffix: { type: String, default: '' }, // 数值后
    separator: { type: String, default: ',' }, // 数字每三级，用什么分割
    decimal: { type: String, default: '.' }, // 小数点
    /**
     * 字体颜色
     */
    color: { type: String, default: '' },
    /**
     * 打开数字动画
     */
    useEasing: { type: Boolean, default: true },
    /**
     * 数字动画
     */
    transition: {
      type: String,
      default: 'linear',
    },
  });

  const emit = defineEmits(['onStarted', 'onFinished']);

  const source = ref(props.startVal);
  const disabled = ref(false);
  let outputValue = useTransition(source);

  const value = computed(() => formatNumber(unref(outputValue)) || 0);

  watchEffect(() => {
    source.value = props.startVal;
  });

  watch([() => props.startVal, () => props.endVal], () => {
    if (props.autoplay) {
      start();
    }
  });

  onMounted(() => {
    props.autoplay && start();
  });

  const start = () => {
    run();
    source.value = props.endVal;
  };

  const reset = () => {
    source.value = props.startVal;
    run();
  };

  const run = () => {
    const transitionStr = props.transition as keyof typeof TransitionPresets;
    outputValue = useTransition(source, {
      disabled,
      duration: props.duration,
      onFinished: () => emit('onFinished'),
      onStarted: () => emit('onStarted'),
      ...(props.useEasing ? { transition: TransitionPresets[transitionStr] } : {}),
    });
  };

  const formatNumber = (num: string | number) => {
    if (typeof num !== 'number') {
      return '';
    }
    const { decimals, decimal, separator, suffix, prefix } = props;
    num = Number(num).toFixed(decimals);
    num += '';

    const x = num.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? decimal + x[1] : '';

    const rgx = /(\d+)(\d{3})/;
    if (separator && !isNumber(separator)) {
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + separator + '$2');
      }
    }
    return prefix + x1 + x2 + suffix;
  };

  defineExpose({ reset });
</script>

<template>
  <span :style="{ color }">
    {{ value }}
  </span>
</template>
