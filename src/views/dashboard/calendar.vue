<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { addDays } from 'date-fns/esm';

  const message = useMessage();

  const value = ref(addDays(Date.now(), 1).valueOf());

  // 选中时间
  const handleUpdateValue = (_: number, { year, month, date }: { year: number; month: number; date: number }) => {
    message.success(`${year}-${month}-${date}`);
  };

  // timestamp: number
  // 禁止
  const isDateDisabled = () => {
    // if (isYesterday(timestamp)) {
    //   return true;
    // }
    return false;
  };
</script>

<template>
  <n-card class="calendar-card" :bordered="false">
    <n-calendar v-model:value="value" :is-date-disabled="isDateDisabled" @update:value="handleUpdateValue">
      <!-- <template #header>4545454</template> -->
      <template #default="{ year, month, date }">{{ year }} 年 {{ month }} 月 {{ date }} 日</template>
    </n-calendar>
  </n-card>
</template>

<style lang="scss">
  .calendar-card {
    .n-calendar .n-calendar-cell .n-calendar-date {
      height: auto;
    }
  }
</style>
