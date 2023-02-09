<template>
  <n-card :bordered="false">
    <n-date-picker v-model:formatted-value="datePickerRange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" clearable />
    <n-space>
      <n-button type="info" @click="getBankFlow">银行流动</n-button>
      <n-button type="info" @click="getMoneyBalance">余额</n-button>
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
  import { moneyApi } from '@/api';
  import { onMounted, ref } from 'vue';

  const datePickerRange = ref(['2020-01-01', '2020-01-31']);

  // 获取银行数据的流动汇总
  const getBankFlow = () => {
    const params: any = {};
    if (datePickerRange.value && datePickerRange.value.length > 0) {
      params.startTime = datePickerRange.value[0] + ' 00:00:00';
      params.endTime = datePickerRange.value[1] + ' 23:59:59';
    }
    moneyApi
      .getStatisticsBankFlow(params)
      .then((info) => {
        console.log(info);
      })
      .finally(() => {});
  };

  // 统计各个的方式的余额
  const getMoneyBalance = () => {
    moneyApi
      .statisticsMoneyBalance()
      .then((info) => {
        console.log(info);
      })
      .finally(() => {});
  };

  const init = () => {
    // getBankFlow();
  };

  onMounted(init);
</script>

<style lang="scss" scoped></style>
