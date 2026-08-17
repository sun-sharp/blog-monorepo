<template>
  <view class="run-log-page">
    <scroll-view scroll-y class="run-log-scroll" :refresher-enabled="true" :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <!-- 进程列表 -->
      <view class="run-log-process card">
        <view class="run-log-header">
          <text class="run-log-title">运行进程</text>
          <text class="run-log-count">共 {{ processes.length }} 个</text>
        </view>
        <view v-if="loading && processes.length === 0" class="run-log-empty">
          <u-loading mode="circle" size="48" />
        </view>
        <view v-else-if="processes.length === 0" class="run-log-empty">
          <u-empty mode="data" text="暂无进程" />
        </view>
        <view v-else class="run-log-process-list">
          <view
            v-for="proc in processes"
            :key="proc.name"
            class="run-log-process-item"
            :class="{ 'run-log-process-item--active': selectedName === proc.name }"
            @click="selectProcess(proc)">
            <view class="run-log-process-info">
              <view class="run-log-process-name-row">
                <text class="run-log-process-name">{{ proc.name }}</text>
                <text class="run-log-process-status" :class="getStatusClass(proc.status)">{{ proc.status }}</text>
              </view>
              <view class="run-log-process-meta">
                <text>PID {{ proc.pid }}</text>
                <text>{{ proc.cpu }} CPU</text>
                <text>{{ proc.memory }}</text>
                <text>重启 {{ proc.restarts }} 次</text>
              </view>
              <view class="run-log-process-meta">
                <text>运行 {{ proc.uptime }}</text>
                <text v-if="proc.namespace">{{ proc.namespace }}</text>
              </view>
            </view>
            <u-icon name="arrow-right" size="24" color="#999" />
          </view>
        </view>
      </view>

      <!-- 日志详情 -->
      <view v-if="selectedName" class="run-log-detail card">
        <view class="run-log-header">
          <text class="run-log-title">日志详情</text>
          <view class="run-log-detail-actions">
            <u-subsection :list="typeTabs" :current="typeIndex" mode="button" active-color="#667eea" :button-size="20" @change="onTypeChange"></u-subsection>
            <view class="run-log-lines-select" @click="showLinesSelect = true">
              <text class="run-log-lines-text">最近{{ linesData }}行</text>
              <u-icon name="arrow-down" size="20" color="#999" />
            </view>
            <u-icon name="reload" size="36" color="#667eea" @click="loadLog" />
          </view>
        </view>

        <view v-if="logLoading" class="run-log-empty">
          <u-loading mode="circle" size="60" />
          <text class="run-log-loading-text">正在加载日志...</text>
        </view>
        <view v-else-if="!logContent" class="run-log-empty">
          <u-empty mode="data" text="暂无日志" />
        </view>
        <view v-else class="run-log-content">
          <text v-for="(line, idx) in logLines" :key="idx" class="run-log-line">{{ line }}</text>
        </view>
      </view>
    </scroll-view>

    <u-select v-model="showLinesSelect" :list="linesOptions" title="选择行数" @confirm="onLinesConfirm"></u-select>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { onMounted } from 'vue';
  import { pm2LogApi } from '../../../api';
  import type { Pm2ProcessInfo } from '../../../api/pm2-log';

  const processes = ref<Pm2ProcessInfo[]>([]);
  const loading = ref(false);
  const refreshing = ref(false);
  const selectedName = ref('');
  const logContent = ref('');
  const logLoading = ref(false);
  const showLinesSelect = ref(false);

  const linesData = ref(200);
  const typeIndex = ref(2);
  const typeTabs = ['错误', '标准', '全部'];
  const typeValue = ['error', 'out', 'all'];

  const linesOptions = [50, 100, 200, 500, 1000].map((n) => ({ label: `${n} 行`, value: n }));

  const logLines = computed(() => (logContent.value ? logContent.value.split('\n') : []));

  function getStatusClass(status: string): string {
    if (status === 'online') return 'run-log-status--online';
    if (status === 'stopped') return 'run-log-status--stopped';
    if (status === 'errored') return 'run-log-status--error';
    return 'run-log-status--default';
  }

  async function loadProcesses() {
    loading.value = true;
    try {
      processes.value = await pm2LogApi.listProcesses();
    } catch {
      processes.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function onRefresh() {
    refreshing.value = true;
    await loadProcesses();
    if (selectedName.value) await loadLog();
    refreshing.value = false;
  }

  function selectProcess(proc: Pm2ProcessInfo) {
    if (selectedName.value === proc.name) return;
    selectedName.value = proc.name;
    logContent.value = '';
    loadLog();
  }

  async function loadLog() {
    if (!selectedName.value) return;
    logLoading.value = true;
    try {
      const result = await pm2LogApi.getLog(selectedName.value, linesData.value, typeValue[typeIndex.value]);
      logContent.value = result.content || '';
    } catch {
      logContent.value = '';
    } finally {
      logLoading.value = false;
    }
  }

  function onTypeChange(index: number) {
    typeIndex.value = index;
    loadLog();
  }

  function onLinesConfirm(e: any) {
    const val = e[0]?.value;
    if (val) {
      linesData.value = Number(val);
      loadLog();
    }
  }

  onMounted(() => {
    loadProcesses();
  });
</script>

<style lang="scss" scoped>
  .run-log-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $uni-bg-color-grey;
  }

  .run-log-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .run-log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }

  .run-log-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .run-log-count {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .run-log-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;
  }

  .run-log-loading-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 12rpx;
  }

  .run-log-process-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .run-log-process-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background-color: $uni-bg-color;
    border: 2rpx solid transparent;
    border-radius: 12rpx;
    transition: all 0.2s;

    &--active {
      border-color: $uni-color-primary;
      background-color: #f5f8ff;
    }
  }

  .run-log-process-info {
    flex: 1;
    min-width: 0;
  }

  .run-log-process-name-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 8rpx;
  }

  .run-log-process-name {
    font-size: $uni-font-size-base;
    font-weight: 600;
    color: $uni-text-color;
  }

  .run-log-process-status {
    font-size: 22rpx;
    border-radius: 8rpx;
    padding: 2rpx 12rpx;

    &--online {
      background-color: #e8f8e8;
      color: #4cd964;
    }

    &--stopped {
      background-color: $uni-bg-color-grey;
      color: $uni-text-color-grey;
    }

    &--error {
      background-color: #fde8e8;
      color: #dd524d;
    }

    &--default {
      background-color: $uni-bg-color-grey;
      color: $uni-text-color-placeholder;
    }
  }

  .run-log-process-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx 20rpx;
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 4rpx;
  }

  .run-log-detail-actions {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .run-log-lines-select {
    display: flex;
    align-items: center;
    gap: 4rpx;
  }

  .run-log-lines-text {
    font-size: 22rpx;
    color: $uni-color-primary;
  }

  .run-log-content {
    background-color: #1e1e1e;
    border-radius: 12rpx;
    padding: 20rpx;
    max-height: 800rpx;
    overflow-y: auto;
  }

  .run-log-line {
    display: block;
    font-size: 22rpx;
    line-height: 1.6;
    color: #d4d4d4;
    word-break: break-all;
    white-space: pre-wrap;
  }
</style>
