<template>
  <u-config-provider :dark-mode="mode">
    <scroll-view scroll-y class="mine-page" :class="{ dark: isDark }">
      <view class="mine-head">
        <view class="mine-head-tools">
          <view class="mine-tool-btn" @click="goToSetting">
            <u-icon name="setting" size="40" :color="isDark ? '#fff' : '#333'" />
          </view>
          <view class="mine-tool-btn" @click="toggleTheme">
            <u-icon :name="isDark ? 'star-fill' : 'star'" size="40" :color="isDark ? '#fff' : '#333'" />
          </view>
        </view>
      </view>
      <!-- 顶部用户卡片：头像在上，名称/角色在下，右上角设置+主题 -->
      <view class="mine-card">
        <u-avatar :src="getImgUrl(userInfo.avatar) || '/static/logo.png'" size="128" @click="navigateTo('/pages/setting/account/account')" />
        <text class="mine-card-name" :class="{ dark: isDark }">{{ userInfo.nickname || '未登录' }}</text>
        <text class="mine-card-role" :class="{ dark: isDark }">{{ userInfo.roleName || '普通用户' }}</text>
      </view>

      <!-- 一级入口：尿酸血糖测量 -->
      <view class="mine-section card" :class="{ dark: isDark }">
        <u-cell-group :border="false">
          <u-cell-item title="尿酸血糖测量" icon="file-text" @click="navigateTo('/pages/system/uric/uric')" />
        </u-cell-group>
      </view>

      <!-- 分组标题入口 -->
      <view class="mine-section card" :class="{ dark: isDark }">
        <u-cell-group :border="false">
          <u-cell-item title="博客管理" icon="calendar" @click="navigateTo('/pages/setting/group-blog/group-blog')" />
          <u-cell-item title="财务管理" icon="red-packet" @click="navigateTo('/pages/setting/group-finance/group-finance')" />
          <u-cell-item title="文件管理" icon="photo" @click="navigateTo('/pages/setting/group-file/group-file')" />
          <u-cell-item title="系统管理" icon="setting" @click="navigateTo('/pages/setting/group-system/group-system')" />
        </u-cell-group>
      </view>
    </scroll-view>
  </u-config-provider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '../../store';
  import { useAppTheme } from '../../composables/useAppTheme';
  import { getImgUrl } from '../../../shared/src/utils/files';

  defineProps<{ active: boolean }>();

  const userStore = useUserStore();
  const { isDark, mode, toggle } = useAppTheme();
  const userInfo = computed(() => userStore.getUserInfo);

  function toggleTheme() {
    toggle();
    uni.showToast({ title: isDark.value ? '已开启深色模式' : '已开启浅色模式', icon: 'none' });
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

  .mine-head {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 10rpx 10rpx;
  }

  .mine-head-tools {
    display: flex;
    gap: 28rpx;
  }

  .mine-tool-btn {
    // width: 36rpx;
  }

  .mine-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 24rpx 40rpx;
    margin-bottom: 20rpx;
    border-radius: 24rpx;
    color: #333;
  }

  .mine-card-name {
    margin-top: 20rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;

    &.dark {
      color: #fff;
    }
  }

  .mine-card-role {
    margin-top: 10rpx;
    font-size: 26rpx;
    color: #333;

    &.dark {
      color: #fff;
    }
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
