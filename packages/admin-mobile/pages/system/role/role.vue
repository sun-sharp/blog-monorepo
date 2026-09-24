<template>
  <u-config-provider :dark-mode="mode">
    <view class="role-page" :class="{ dark: isDark }">
      <list-page
        ref="listPageRef"
        :api-fn="roleApi.getPage"
        search-placeholder="搜索角色"
        search-key="name"
        show-fab
        @fabClick="goToAdd"
        @itemLongpress="onLongPress">
        <template #default="{ list, longpress }">
          <view v-for="item in list" :key="item.roleId" class="role-item card" :class="{ dark: isDark }" @click="goToEdit(item.roleId)" @longpress="longpress(item)">
            <view class="role-item-left">
              <view class="role-item-icon">
                <u-icon name="account" size="32" color="#fff" />
              </view>
              <view class="role-item-info">
                <text class="role-item-name" :class="{ dark: isDark }">{{ item.name }}</text>
                <text class="role-item-code" :class="{ dark: isDark }">{{ item.roleCode }}</text>
              </view>
            </view>
            <view class="role-item-right">
              <u-tag :text="roleTypeObj[item.roleType] || '未知'" type="info" size="mini" plain />
              <u-icon name="arrow-right" size="28" :color="isDark ? '#7d8085' : '#ccc'" />
            </view>
          </view>
        </template>
      </list-page>
    </view>
  </u-config-provider>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { consumeRefreshFlag } from '../../../composables/useRefreshFlag';
  import { useFilterBackPress } from '../../../composables/useFilterBackPress';
  import { roleApi } from '../../../api';
  import { useAppTheme } from '../../../composables/useAppTheme';
  import { roleTypeOption } from '../../../../shared/src/constants/api-type';
  import type { ApiRoleItem } from '/#/api/capital/role';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();
  const { isDark, mode } = useAppTheme();

  useFilterBackPress(listPageRef);

  const roleTypeObj: Record<number, string> = {};
  roleTypeOption.forEach((item) => {
    roleTypeObj[item.value] = item.label;
  });

  function goToAdd() {
    uni.navigateTo({ url: '/pages/system/role-edit/role-edit' });
  }

  function goToEdit(roleId: string) {
    uni.navigateTo({ url: `/pages/system/role-edit/role-edit?id=${roleId}` });
  }

  function onLongPress(item: ApiRoleItem) {
    uni.showModal({
      title: '确认删除',
      content: `确定删除角色「${item.name}」？`,
      success: async (res) => {
        if (res.confirm) {
          await roleApi.remove(item.roleId);
          listPageRef.value?.refresh();
        }
      },
    });
  }

  onShow(() => {
    if (consumeRefreshFlag('role')) listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .role-page {
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
    transition: background-color 0.2s;

    &.dark {
      background-color: $dark-page-bg;
    }
  }

  .role-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    margin: 0 20rpx 16rpx;

    &:first-child {
      margin-top: 12rpx;
    }

    &:active {
      opacity: 0.85;
    }
  }

  .role-item-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;
    min-width: 0;
  }

  .role-item-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 16rpx;
    background: linear-gradient(135deg, #4facfe, #007aff);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .role-item-info {
    flex: 1;
    min-width: 0;
  }

  .role-item-name {
    font-size: $uni-font-size-lg;
    font-weight: 500;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.dark {
      color: $dark-text-color;
    }
  }

  .role-item-code {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
    display: block;

    &.dark {
      color: $dark-text-color-3;
    }
  }

  .role-item-right {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;
  }
</style>
