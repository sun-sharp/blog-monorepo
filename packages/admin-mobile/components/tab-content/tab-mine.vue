<template>
  <scroll-view scroll-y class="mine-page" :class="{ dark: themeStore.isDark }">
    <!-- 顶部用户卡片：头像在上，名称/角色在下，右上角设置+主题 -->
    <view class="mine-card">
      <view class="mine-card-tools">
        <view class="mine-tool-btn" @click="goToSetting">
          <u-icon name="setting" size="40" color="#fff" />
        </view>
        <view class="mine-tool-btn" @click="toggleTheme">
          <u-icon :name="themeStore.isDark ? 'star-fill' : 'star'" size="40" color="#fff" />
        </view>
      </view>
      <u-avatar :src="getImgUrl(userInfo.avatar) || '/static/logo.png'" size="128" />
      <text class="mine-card-name">{{ userInfo.nickname || '未登录' }}</text>
      <text class="mine-card-role">{{ userInfo.roleName || '普通用户' }}</text>
    </view>

    <!-- 一级入口：尿酸血糖测量 -->
    <view class="mine-section card" :class="{ dark: themeStore.isDark }">
      <u-cell-group :border="false">
        <u-cell-item title="尿酸血糖测量" icon="file-text" @click="navigateTo('/pages/system/uric/uric')" />
      </u-cell-group>
    </view>

    <!-- 分组标题入口 -->
    <view class="mine-section card" :class="{ dark: themeStore.isDark }">
      <u-cell-group :border="false">
        <u-cell-item title="博客" icon="calendar" @click="navigateTo('/pages/setting/group-blog/group-blog')" />
        <u-cell-item title="财务" icon="red-packet" @click="navigateTo('/pages/setting/group-finance/group-finance')" />
        <u-cell-item title="文件" icon="photo" @click="navigateTo('/pages/setting/group-file/group-file')" />
        <u-cell-item title="系统" icon="setting" @click="navigateTo('/pages/setting/group-system/group-system')" />
      </u-cell-group>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore, useThemeStore } from '../../store';
  import { getImgUrl } from '../../../shared/src/utils/files';

  defineProps<{ active: boolean }>();

  const userStore = useUserStore();
  const themeStore = useThemeStore();
  const userInfo = computed(() => userStore.getUserInfo);

  function toggleTheme() {
    themeStore.toggle();
    uni.showToast({ title: themeStore.isDark ? '已开启深色模式' : '已开启浅色模式', icon: 'none' });
  }

  function goToSetting() {
    uni.navigateTo({ url: '/pages/setting/setting/setting' });
  }

  function navigateTo(url: string) {
    uni.navigateTo({ url });
  }
</script>

<style lang="scss" scoped>
  .mine-page {
    height: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    background-color: $uni-bg-color-grey;
    transition: background-color 0.2s;

    &.dark {
      background-color: #1b1b1f;
    }
  }

  .mine-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 24rpx 40rpx;
    margin-bottom: 20rpx;
    border-radius: 24rpx;
    background: linear-gradient(135deg, #4a7dff, #2f54eb);
    color: #fff;
  }

  .mine-card-tools {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    display: flex;
    gap: 28rpx;
  }

  .mine-tool-btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.2);
  }

  .mine-card-name {
    margin-top: 20rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
  }

  .mine-card-role {
    margin-top: 10rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.85);
  }

  .mine-section {
    margin-bottom: 20rpx;
    padding: 0 !important;
    transition: background-color 0.2s;

    &.dark {
      background-color: #2c2c30;
    }
  }
</style>
