<template>
  <view class="backup-page">
    <scroll-view scroll-y class="backup-scroll" :refresher-enabled="true" :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <view class="backup-action card">
        <view class="backup-action-icon">
          <u-icon name="download" size="48" color="#fff" />
        </view>
        <view class="backup-action-info">
          <text class="backup-action-title">二进制备份</text>
          <text class="backup-action-desc">使用 mongodump 备份所有数据库</text>
        </view>
        <u-button type="primary" shape="circle" size="mini" :loading="backupLoading" @click="handleBackupAll">立即备份</u-button>
      </view>

      <view class="backup-list-header">
        <text class="backup-list-title">备份记录</text>
        <text v-if="backups.length > 0" class="backup-list-count">共 {{ groupedBackups.length }} 组</text>
      </view>

      <view v-if="backups.length > 0" class="backup-groups">
        <view v-for="group in groupedBackups" :key="group.name" class="backup-group card">
          <view class="backup-group-header">
            <view class="backup-group-icon" :style="{ background: groupColors[group.name] || groupColors.default }">
              <u-icon name="file-text-fill" size="28" color="#fff" />
            </view>
            <view class="backup-group-info">
              <text class="backup-group-name">{{ group.name }}</text>
              <text class="backup-group-time">{{ group.items[0].backupTime }}</text>
            </view>
            <view class="backup-group-size">{{ formatSize(group.totalSize) }}</view>
          </view>

          <view class="backup-group-body">
            <view v-for="item in group.items" :key="item.fileName + item.database" class="backup-item">
              <view class="backup-item-tag" :class="getDatabaseTagClass(item.database)">
                <text>{{ item.database }}</text>
              </view>
              <text class="backup-item-size">{{ formatSize(item.fileSize) }}</text>
            </view>
          </view>

          <view class="backup-group-actions">
            <u-button type="primary" size="mini" plain shape="circle" @click="handleRestoreAll(group.name)">恢复全部</u-button>
            <u-button type="error" size="mini" plain shape="circle" @click="handleDelete(group.name)">删除</u-button>
          </view>
        </view>
      </view>

      <view v-else-if="!loading" class="backup-empty">
        <u-empty mode="data" text="暂无备份记录" icon-size="120" />
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { backupApi } from '../../../api';
  import type { BackupFileInfo } from '../../../api/backup';

  const backups = ref<BackupFileInfo[]>([]);
  const loading = ref(false);
  const refreshing = ref(false);
  const backupLoading = ref(false);

  const groupColors: Record<string, string> = {
    default: 'linear-gradient(135deg, #667eea, #764ba2)',
  };

  interface BackupGroup {
    name: string;
    items: BackupFileInfo[];
    totalSize: number;
  }

  const groupedBackups = computed<BackupGroup[]>(() => {
    const map = new Map<string, BackupFileInfo[]>();
    for (const item of backups.value) {
      const group = map.get(item.fileName) || [];
      group.push(item);
      map.set(item.fileName, group);
    }
    const groups: BackupGroup[] = [];
    for (const [name, items] of map) {
      groups.push({
        name,
        items,
        totalSize: items.reduce((sum, item) => sum + item.fileSize, 0),
      });
    }
    groups.sort((a, b) => b.items[0].backupTime.localeCompare(a.items[0].backupTime));
    return groups;
  });

  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getDatabaseTagClass(db: string): string {
    if (db.includes('capital')) return 'backup-tag-capital';
    if (db.includes('blog')) return 'backup-tag-blog';
    return 'backup-tag-default';
  }

  async function loadBackups() {
    loading.value = true;
    try {
      backups.value = await backupApi.listBackups();
    } catch {
      backups.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function onRefresh() {
    refreshing.value = true;
    await loadBackups();
    refreshing.value = false;
  }

  function handleBackupAll() {
    uni.showModal({
      title: '确认备份',
      content: '将对所有数据库进行二进制备份，可能需要一些时间，是否继续？',
      success: async (res) => {
        if (res.confirm) {
          backupLoading.value = true;
          try {
            await backupApi.backupAll();
            uni.showToast({ title: '备份成功', icon: 'success' });
            await loadBackups();
          } catch {
            // error toast handled by request
          } finally {
            backupLoading.value = false;
          }
        }
      },
    });
  }

  function handleRestoreAll(backupName: string) {
    uni.showModal({
      title: '确认恢复',
      content: `将从备份「${backupName}」恢复所有数据库，当前数据将被覆盖！是否继续？`,
      confirmColor: '#dd524d',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await backupApi.restoreAll(backupName);
            uni.showToast({ title: `恢复成功: ${result.restoredDatabases.join(', ')}`, icon: 'none' });
          } catch {
            // error toast handled by request
          }
        }
      },
    });
  }

  function handleDelete(backupName: string) {
    uni.showModal({
      title: '确认删除',
      content: `确定删除备份「${backupName}」？此操作不可恢复。`,
      confirmColor: '#dd524d',
      success: async (res) => {
        if (res.confirm) {
          await backupApi.removeBackup(backupName);
          await loadBackups();
        }
      },
    });
  }

  onMounted(() => {
    loadBackups();
  });

  onShow(() => {
    loadBackups();
  });
</script>

<style lang="scss" scoped>
  .backup-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $uni-bg-color-grey;
  }

  .backup-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .backup-action {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 24rpx;
    background: linear-gradient(135deg, #ffffff, #f0f7ff);
  }

  .backup-action-icon {
    width: 88rpx;
    height: 88rpx;
    border-radius: 20rpx;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .backup-action-info {
    flex: 1;
    min-width: 0;
  }

  .backup-action-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    display: block;
  }

  .backup-action-desc {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
    display: block;
  }

  .backup-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rpx 16rpx;
  }

  .backup-list-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .backup-list-count {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .backup-groups {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .backup-group {
    margin-bottom: 0;
  }

  .backup-group-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 20rpx;
  }

  .backup-group-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 14rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .backup-group-info {
    flex: 1;
    min-width: 0;
  }

  .backup-group-name {
    font-size: $uni-font-size-base;
    font-weight: 600;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .backup-group-time {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 4rpx;
    display: block;
  }

  .backup-group-size {
    font-size: $uni-font-size-sm;
    color: $uni-color-primary;
    font-weight: 600;
    flex-shrink: 0;
  }

  .backup-group-body {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
    padding: 16rpx 0;
    border-top: 2rpx solid $uni-bg-color-grey;
    border-bottom: 2rpx solid $uni-bg-color-grey;
    margin-bottom: 16rpx;
  }

  .backup-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .backup-item-tag {
    border-radius: 8rpx;
    padding: 4rpx 16rpx;
    font-size: 24rpx;
    font-weight: 500;
  }

  .backup-tag-capital {
    background-color: #e8f4fd;
    color: #007aff;
  }

  .backup-tag-blog {
    background-color: #e8f8e8;
    color: #4cd964;
  }

  .backup-tag-default {
    background-color: $uni-bg-color-grey;
    color: $uni-text-color-grey;
  }

  .backup-item-size {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .backup-group-actions {
    display: flex;
    gap: 16rpx;
    justify-content: flex-end;
  }

  .backup-empty {
    padding-top: 120rpx;
  }
</style>
