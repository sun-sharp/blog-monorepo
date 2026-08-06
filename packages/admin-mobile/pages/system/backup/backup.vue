<template>
  <view class="backup-page">
    <scroll-view scroll-y class="backup-scroll" :refresher-enabled="true" :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <view class="backup-action card">
        <view class="backup-action-header">
          <view class="backup-action-icon">
            <u-icon name="download" size="40" color="#fff" />
          </view>
          <view class="backup-action-info">
            <text class="backup-action-title">数据备份</text>
            <text class="backup-action-desc">选择备份范围后执行</text>
          </view>
        </view>
        <view class="backup-action-type">
          <u-subsection :list="backupTypes" :current="backupTypeIndex" mode="button" active-color="#667eea" @change="onBackupTypeChange"></u-subsection>
        </view>
        <view v-if="backupTypeIndex === 1" class="backup-action-select">
          <text class="backup-select-label">选择数据库</text>
          <view class="backup-select-picker" @click="showDbSelect = true">
            <text :class="{ 'backup-select-placeholder': !selectedDb }">{{ selectedDb || '请选择数据库' }}</text>
            <u-icon name="arrow-right-fill" size="24" color="#999" />
          </view>
        </view>
        <view v-if="backupTypeIndex === 2" class="backup-action-select">
          <text class="backup-select-label">选择数据库</text>
          <view class="backup-select-picker" @click="showDbSelectForCollection = true">
            <text :class="{ 'backup-select-placeholder': !selectedDbForCollection }">{{ selectedDbForCollection || '请选择数据库' }}</text>
            <u-icon name="arrow-right-fill" size="24" color="#999" />
          </view>
          <text class="backup-select-label">选择集合</text>
          <view class="backup-select-picker" @click="onPickCollection">
            <text :class="{ 'backup-select-placeholder': !selectedCollection }">{{ selectedCollection || '请选择集合' }}</text>
            <u-icon name="arrow-right-fill" size="24" color="#999" />
          </view>
        </view>
        <view class="backup-action-btn">
          <u-button type="primary" shape="circle" :loading="backupLoading" :disabled="!canBackup" @click="handleBackup">立即备份</u-button>
        </view>
      </view>

      <view class="backup-list-header">
        <text class="backup-list-title">备份记录</text>
        <text v-if="backups.length > 0" class="backup-list-count">共 {{ groupedBackups.length }} 组</text>
      </view>

      <view v-if="backups.length > 0" class="backup-groups">
        <view v-for="group in groupedBackups" :key="group.name" class="backup-group card">
          <view class="backup-group-header" @click="toggleGroup(group.name)">
            <view class="backup-group-icon" :style="{ background: groupColors.default }">
              <u-icon name="file-text-fill" size="28" color="#fff" />
            </view>
            <view class="backup-group-info">
              <text class="backup-group-name">{{ group.name }}</text>
              <text class="backup-group-time">{{ group.items[0].backupTime }}</text>
            </view>
            <view class="backup-group-right">
              <text class="backup-group-size">{{ formatSize(group.totalSize) }}</text>
              <u-icon :name="expandedGroups.has(group.name) ? 'arrow-up' : 'arrow-down'" size="24" color="#999" />
            </view>
          </view>

          <view v-if="expandedGroups.has(group.name)" class="backup-group-detail">
            <view v-for="item in group.items" :key="item.fileName + item.database" class="backup-db-item">
              <view class="backup-db-header">
                <view class="backup-item-tag" :class="getDatabaseTagClass(item.database)">
                  <text>{{ item.database }}</text>
                </view>
                <text class="backup-item-size">{{ formatSize(item.fileSize) }}</text>
              </view>
              <view v-if="item.collections.length > 0" class="backup-db-collections">
                <view v-for="col in item.collections" :key="col" class="backup-collection-row">
                  <text class="backup-collection-name">{{ col }}</text>
                  <view class="backup-collection-actions">
                    <text class="backup-collection-btn" @click="handleRestoreCollection(group.name, item.database, col)">恢复</text>
                  </view>
                </view>
              </view>
              <view class="backup-db-actions">
                <u-button type="primary" size="mini" plain shape="circle" @click="handleRestoreDatabase(group.name, item.database)">恢复数据库</u-button>
              </view>
            </view>

            <view class="backup-group-actions">
              <u-button type="primary" size="mini" plain shape="circle" @click="handleRestoreAll(group.name)">恢复全部</u-button>
              <u-button type="error" size="mini" plain shape="circle" @click="handleDelete(group.name)">删除</u-button>
            </view>
          </view>
        </view>
      </view>

      <view v-else-if="!loading" class="backup-empty">
        <u-empty mode="data" text="暂无备份记录" icon-size="120" />
      </view>
    </scroll-view>

    <u-select v-model="showDbSelect" :list="dbOptions" title="选择数据库" @confirm="onDbSelectConfirm"></u-select>
    <u-select v-model="showDbSelectForCollection" :list="dbOptions" title="选择数据库" @confirm="onDbSelectForCollectionConfirm"></u-select>
    <u-select v-model="showCollectionSelect" :list="collectionOptions" title="选择集合" @confirm="onCollectionSelectConfirm"></u-select>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { backupApi } from '../../../api';
  import type { BackupFileInfo } from '../../../api/backup';

  const capitalDatabaseName = import.meta.env.VITE_CAPITAL_DATABASE_NAME || 'capital';
  const blogDatabaseName = import.meta.env.VITE_BLOG_DATABASE_NAME || 'blog';

  const backups = ref<BackupFileInfo[]>([]);
  const loading = ref(false);
  const refreshing = ref(false);
  const backupLoading = ref(false);

  const backupTypes = ['全部', '数据库', '集合'];
  const backupTypeIndex = ref(0);

  const showDbSelect = ref(false);
  const showDbSelectForCollection = ref(false);
  const showCollectionSelect = ref(false);

  const selectedDb = ref('');
  const selectedDbForCollection = ref('');
  const selectedCollection = ref('');

  const expandedGroups = ref(new Set<string>());

  const dbOptions = [
    { label: capitalDatabaseName, value: capitalDatabaseName },
    { label: blogDatabaseName, value: blogDatabaseName },
  ];

  const collectionMap: Record<string, string[]> = {
    [capitalDatabaseName]: ['users', 'roles', 'menus', 'waitfordos', 'images', 'configurations', 'categories'],
    [blogDatabaseName]: ['articles', 'schedules', 'banks', 'wechats', 'alipays', 'billuploads'],
  };

  const collectionOptions = computed(() => {
    const cols = collectionMap[selectedDbForCollection.value] || [];
    return cols.map((c) => ({ label: c, value: c }));
  });

  const canBackup = computed(() => {
    if (backupTypeIndex.value === 0) return true;
    if (backupTypeIndex.value === 1) return !!selectedDb.value;
    if (backupTypeIndex.value === 2) return !!selectedDbForCollection.value && !!selectedCollection.value;
    return false;
  });

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

  function toggleGroup(name: string) {
    if (expandedGroups.value.has(name)) {
      expandedGroups.value.delete(name);
    } else {
      expandedGroups.value.add(name);
    }
    expandedGroups.value = new Set(expandedGroups.value);
  }

  function onBackupTypeChange(index: number) {
    backupTypeIndex.value = index;
  }

  function onDbSelectConfirm(e: any) {
    selectedDb.value = e[0]?.value || '';
  }

  function onDbSelectForCollectionConfirm(e: any) {
    selectedDbForCollection.value = e[0]?.value || '';
    selectedCollection.value = '';
  }

  function onPickCollection() {
    if (!selectedDbForCollection.value) {
      uni.showToast({ title: '请先选择数据库', icon: 'none' });
      return;
    }
    showCollectionSelect.value = true;
  }

  function onCollectionSelectConfirm(e: any) {
    selectedCollection.value = e[0]?.value || '';
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

  function handleBackup() {
    const typeLabels = ['所有数据库', `数据库 ${selectedDb.value}`, `集合 ${selectedDbForCollection.value}/${selectedCollection.value}`];
    uni.showModal({
      title: '确认备份',
      content: `将备份${typeLabels[backupTypeIndex.value]}，是否继续？`,
      success: async (res) => {
        if (res.confirm) {
          backupLoading.value = true;
          try {
            if (backupTypeIndex.value === 0) {
              await backupApi.backupAll();
            } else if (backupTypeIndex.value === 1) {
              await backupApi.backupDatabase(selectedDb.value);
            } else {
              await backupApi.backupCollection(selectedDbForCollection.value, selectedCollection.value);
            }
            uni.showToast({ title: '备份成功', icon: 'success' });
            await loadBackups();
          } catch {
            // handled by request
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
      content: `将从备份「${backupName}」恢复所有数据库，当前数据将被覆盖！`,
      confirmColor: '#dd524d',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await backupApi.restoreAll(backupName);
            uni.showToast({ title: `恢复成功: ${result.restoredDatabases.join(', ')}`, icon: 'none' });
          } catch {
            // handled by request
          }
        }
      },
    });
  }

  function handleRestoreDatabase(backupName: string, dbName: string) {
    uni.showModal({
      title: '确认恢复',
      content: `将恢复数据库「${dbName}」，当前数据将被覆盖！`,
      confirmColor: '#dd524d',
      success: async (res) => {
        if (res.confirm) {
          try {
            await backupApi.restoreDatabase(backupName, dbName);
            uni.showToast({ title: '恢复成功', icon: 'success' });
          } catch {
            // handled by request
          }
        }
      },
    });
  }

  function handleRestoreCollection(backupName: string, dbName: string, collection: string) {
    uni.showModal({
      title: '确认恢复',
      content: `将恢复集合「${dbName}/${collection}」，当前数据将被覆盖！`,
      confirmColor: '#dd524d',
      success: async (res) => {
        if (res.confirm) {
          try {
            await backupApi.restoreCollection(backupName, dbName, collection);
            uni.showToast({ title: '恢复成功', icon: 'success' });
          } catch {
            // handled by request
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
    margin-bottom: 24rpx;
    background: linear-gradient(135deg, #ffffff, #f0f7ff);
  }

  .backup-action-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 24rpx;
  }

  .backup-action-icon {
    width: 80rpx;
    height: 80rpx;
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

  .backup-action-type {
    margin-bottom: 20rpx;
  }

  .backup-action-select {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
    margin-bottom: 20rpx;
  }

  .backup-select-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    font-weight: 500;
  }

  .backup-select-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $uni-bg-color;
    border: 2rpx solid $uni-border-color;
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
  }

  .backup-select-placeholder {
    color: $uni-text-color-placeholder;
    font-size: $uni-font-size-base;
  }

  .backup-action-btn {
    margin-top: 8rpx;
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

  .backup-group-right {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;
  }

  .backup-group-size {
    font-size: $uni-font-size-sm;
    color: $uni-color-primary;
    font-weight: 600;
  }

  .backup-group-detail {
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 2rpx solid $uni-bg-color-grey;
  }

  .backup-db-item {
    background-color: $uni-bg-color-grey;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
  }

  .backup-db-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
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

  .backup-db-collections {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    margin-bottom: 16rpx;
  }

  .backup-collection-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8rpx 4rpx;
  }

  .backup-collection-name {
    font-size: $uni-font-size-sm;
    color: $uni-text-color;
  }

  .backup-collection-actions {
    display: flex;
    gap: 16rpx;
  }

  .backup-collection-btn {
    font-size: 24rpx;
    color: $uni-color-primary;
    padding: 4rpx 16rpx;

    &:active {
      opacity: 0.6;
    }
  }

  .backup-db-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 4rpx;
  }

  .backup-group-actions {
    display: flex;
    gap: 16rpx;
    justify-content: flex-end;
    padding-top: 8rpx;
  }

  .backup-empty {
    padding-top: 120rpx;
  }
</style>
