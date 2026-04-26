<script lang="ts" setup>
  import { onActivated, onMounted, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { addDays } from 'date-fns/esm';
  import { scheduleAPi } from '@/api';
  import { format } from 'date-fns';
  import { ScheduleDailyItem } from '/#/views/schedule';

  const message = useMessage();

  const value = ref(addDays(Date.now(), 1).valueOf());

  const scheduleList = ref<ScheduleDailyItem[]>([]);

  // 获取每日日程
  const loadDaily = (year?: number, mon?: number) => {
    const nowTime = new Date();
    const newTime = year && mon ? new Date(year, mon, 0) : new Date(nowTime.getFullYear(), nowTime.getMonth() + 1, 0);
    const date2 = newTime.getDate();
    const startTime = format(newTime, 'yyyy-MM-01');
    const endTime = format(newTime, 'yyyy-MM-' + date2);
    const params = { startTime, endTime };
    scheduleAPi.daily(params).then((res) => {
      scheduleList.value = res;
    });
  };

  const formatScheduleItem = (year: number, month: number, date: number) => {
    const time = format(new Date(year, month - 1, date), 'yyyy-MM-dd');
    const find = scheduleList.value.find((f) => f.time === time);
    return find || {};
  };

  // 选中时间
  const handleUpdateValue = (_: number, { year, month, date }: { year: number; month: number; date: number }) => {
    message.success(`${year}-${month}-${date}`);
  };

  // 切换面板
  const onPanelChange = (info: { year: number; month: number }) => {
    const { year, month } = info;
    loadDaily(year, month);
  };

  // timestamp: number
  // 禁止
  const isDateDisabled = () => {
    return false;
  };

  // 初始化
  const init = () => {
    loadDaily();
  };

  onActivated(init);
  onMounted(init);
</script>

<template>
  <n-card class="calendar-card" :bordered="false">
    <n-calendar v-model:value="value" :is-date-disabled="isDateDisabled" @update:value="handleUpdateValue" @panel-change="onPanelChange">
      <!-- <template #header>4545454</template> -->
      <template #default="{ year, month, date }">
        <div style="height: 100%">
          <n-popover
            v-if="formatScheduleItem(year, month, date).children && formatScheduleItem(year, month, date).children.length > 0"
            trigger="hover"
            placement="bottom"
            raw
            :content-style="{
              backgroundColor: '#000',
              color: '#fff',
              padding: '5px',
            }">
            <template #trigger>
              <div style="height: 100%">{{ formatScheduleItem(year, month, date).time }}</div>
            </template>
            <div v-for="(it, idx) in formatScheduleItem(year, month, date).children || []" :key="idx">{{ it.title }}：{{ it.content }}</div>
          </n-popover>
          <div v-else style="height: 100%">{{ formatScheduleItem(year, month, date).time }}</div>
        </div>
      </template>
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
