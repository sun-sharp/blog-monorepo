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
          <view v-for="(line, idx) in logLines" :key="idx" class="run-log-line">
            <template v-for="(seg, segIdx) in highlightLine(line)" :key="segIdx">
              <text class="run-log-seg" :class="segClass(seg)" :style="seg.color ? { color: seg.color } : undefined">{{ seg.text }}</text>
            </template>
          </view>
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

  interface LogSeg {
    text: string;
    type: 'time' | 'level' | 'key' | 'string' | 'number' | 'error' | 'plain';
    color?: string;
  }

  const LEVELS = ['FATAL', 'ERROR', 'WARN', 'WARNING', 'INFO', 'DEBUG', 'TRACE'] as const;

  const TIME_RE = /\d{1,2}[-/]\d{1,2}\d{4}[-/][ T]\d{1,2}:\d{1,2}:\d{1,2}(?:[.,]\d+)?(?:Z|[+-]\d{2}:?\d{2})?/;

  const ANSI_RE =
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d/#&.:=?%@~_]+)*)?\u0007)|(?:(?:\d{1,4}(?:[;:]\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;

  function levelClass(text: string): string {
    const t = text.toUpperCase();
    if (t === 'ERROR' || t === 'FATAL') return 'run-log-seg--error';
    if (t === 'WARN' || t === 'WARNING') return 'run-log-seg--warn';
    if (t === 'DEBUG' || t === 'TRACE') return 'run-log-seg--debug';
    return 'run-log-seg--info';
  }

  function segClass(seg: LogSeg): string {
    if (seg.color) return '';
    switch (seg.type) {
      case 'time':
        return 'run-log-seg--time';
      case 'level':
        return `run-log-seg--level ${levelClass(seg.text)}`;
      case 'key':
        return 'run-log-seg--key';
      case 'string':
        return 'run-log-seg--string';
      case 'number':
        return 'run-log-seg--number';
      case 'error':
        return 'run-log-seg--error';
      default:
        return '';
    }
  }

  function highlightLine(line: string): LogSeg[] {
    if (!line) return [];
    const runs = splitAnsiRuns(line);
    // 全部内容拼接用于判断是否为 JSON
    const plain = runs.map((r) => r.text).join('');
    const trimmed = plain.trim();

    const segs: LogSeg[] = [];
    for (let i = 0; i < runs.length; i++) {
      const run = runs[i];
      const runText = run.text;
      if (!runText) continue;
      if (trimmed.startsWith('{') || trimmed === '[]') {
        try {
          const jsonSegs = tokenizeJson(trimmed).map(classify);
          // JSON 型仅给整行第一个有颜色的 run 传色，保持简单
          if (i === 0) return jsonSegs.map((s) => (run.color ? { ...s, color: run.color } : s));
          return colorizeSegs(
            jsonSegs,
            runs.filter((r) => r.color).map((r) => r.color || '')
          );
        } catch {
          /* fallthrough */
        }
      }
      segs.push(...typeSegs(runText, run.color));
    }
    return mergeSegs(segs);
  }

  function splitAnsiRuns(line: string): { text: string; color?: string }[] {
    const runs: { text: string; color?: string }[] = [];
    let active: string | undefined;
    let buffer = '';
    let i = 0;
    while (i < line.length) {
      if (line.charCodeAt(i) === 0x1b || line.charCodeAt(i) === 0x9b) {
        if (buffer) {
          runs.push({ text: buffer, color: active });
          buffer = '';
        }
        const code = line.slice(i, i + 10).match(ANSI_RE)?.[0] || line[i];
        const color = ansiToColor(code);
        if (color !== undefined) active = color;
        else if (/\[[0]?m/.test(code)) active = undefined; // 重置
        i += code.length;
      } else {
        buffer += line[i];
        i++;
      }
    }
    if (buffer) runs.push({ text: buffer, color: active });
    return runs;
  }

  function typeSegs(text: string, color?: string): LogSeg[] {
    const segs: LogSeg[] = [];
    let rest = text;
    while (rest.length) {
      const timeMatch = rest.match(TIME_RE);
      const head = timeMatch ? rest.slice(0, timeMatch.index || 0) : rest;
      if (head.trim()) segs.push(...splitLevel(head));
      if (timeMatch) {
        segs.push({ text: timeMatch[0], type: 'time' });
        rest = rest.slice((timeMatch.index || 0) + timeMatch.length);
      } else {
        rest = '';
      }
    }
    if (segs.length === 0) segs.push({ text, type: 'plain' });
    return colorizeSegs(segs, color ? [color] : []);
  }

  function colorizeSegs(segs: LogSeg[], colors: string[]): LogSeg[] {
    if (!colors.length) return segs;
    const color = colors[0];
    return segs.map((s) => ({ ...s, color }));
  }

  const ANSI_COLORS: Record<string, string> = {
    30: '#8f9aa8',
    31: '#ff6b6b',
    32: '#4cd964',
    33: '#ffce54',
    34: '#4fc1ff',
    35: '#ae81ff',
    36: '#4dd0e1',
    37: '#d4d4d4',
    90: '#8f9aa8',
    91: '#ff4444',
    92: '#39e575',
    93: '#ffd75f',
    94: '#6db3ff',
    95: '#d7a2ff',
    96: '#6ce6dd',
    97: '#f5f7fa',
  };

  function ansiToColor(code: string): string | undefined {
    if (!code.includes('[') || !code.endsWith('m')) return undefined;
    const body = code
      // eslint-disable-next-line no-control-regex
      .replace(/\u001b\[\??/, '')
      .replace(/m$/, '');
    const params = body.split(';');
    const fg = params.find((p) => /^3[0-7]$/.test(p)) || params.find((p) => /^9[0-7]$/.test(p));
    return fg ? ANSI_COLORS[fg] : undefined;
  }

  function splitLevel(text: string): LogSeg[] {
    const out: LogSeg[] = [];
    let searchPos = 0;
    while (searchPos < text.length) {
      const upper = text.slice(searchPos).toUpperCase();
      const level = LEVELS.find((l) => upper.includes(l));
      if (!level) {
        if (searchPos > 0) out.push({ text: text.slice(searchPos), type: 'plain' });
        else if (out.length === 0) out.push({ text, type: 'plain' });
        break;
      }
      const i = upper.indexOf(level);
      const absolute = searchPos + i;
      if (i > 0) out.push({ text: text.slice(searchPos, absolute), type: 'plain' });
      out.push({ text: text.slice(absolute, absolute + level.length), type: 'level' });
      searchPos = absolute + level.length;
    }
    if (out.length === 0) out.push({ text, type: 'plain' });
    return out;
  }

  function mergeSegs(segs: LogSeg[]): LogSeg[] {
    const out: LogSeg[] = [];
    for (const s of segs) {
      const last = out[out.length - 1];
      if (last && last.type === s.type) last.text += s.text;
      else out.push({ ...s });
    }
    return out;
  }

  function classify(seg: LogSeg): LogSeg {
    if (seg.type !== 'plain') return seg;
    if (/(error|exception|denied|failed|traceback|caused\s*by|stack\s*trace)/i.test(seg.text)) {
      return { ...seg, type: 'error' };
    }
    return seg;
  }

  function tokenizeJson(line: string): LogSeg[] {
    const segs: LogSeg[] = [];
    let rest = line;
    while (rest.length) {
      if (rest[0] === '"') {
        let j = 1;
        while (j < rest.length && rest[j] !== '"') {
          if (rest[j] === '\\') j++;
          j++;
        }
        const s = rest.slice(0, j + 1);
        const after = rest.slice(j + 1).replace(/^\s+/, '');
        const isKey = after.startsWith(':');
        segs.push({ text: s, type: isKey ? 'key' : 'string' });
        rest = rest.slice(j + 1);
      } else {
        const m = rest.match(/^\d+[.]?\d*([eE][+-]?\d+)?/);
        if (m) {
          segs.push({ text: m[0], type: 'number' });
          rest = rest.slice(m[0].length);
        } else {
          const colon = rest.match(/^(\s*:\s*)/);
          if (colon) {
            segs.push({ text: colon[0], type: 'plain' });
            rest = rest.slice(colon[0].length);
          } else {
            const brace = rest.match(/^([,\[\]{}\s]+)/);
            if (brace) {
              segs.push({ text: brace[0], type: 'plain' });
              rest = rest.slice(brace[0].length);
            } else {
              segs.push({ text: rest[0], type: 'plain' });
              rest = rest.slice(1);
            }
          }
        }
      }
    }
    return mergeSegs(segs);
  }

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
    display: flex;
    flex-wrap: wrap;
    font-size: 22rpx;
    line-height: 1.6;
    color: #d4d4d4;
    word-break: break-all;
    white-space: pre-wrap;
    font-family: Consolas, Menlo, monospace;
  }

  .run-log-seg {
    &--time {
      color: #4fc1ff;
      font-weight: 600;
    }

    &--level {
      font-weight: bold;
      margin-right: 6rpx;

      &.run-log-seg--error {
        color: #ff6b6b;
      }

      &.run-log-seg--warn {
        color: #ffce54;
      }

      &.run-log-seg--info {
        color: #4dd0e1;
      }

      &.run-log-seg--debug {
        color: #b8b8b8;
      }
    }

    &--error {
      color: #ff6b6b;
    }

    &--key {
      color: #66d9ef;
    }

    &--string {
      color: #f9a825;
    }

    &--number {
      color: #ae81ff;
    }
  }
</style>
