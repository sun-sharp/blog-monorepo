<template>
  <view>
    <list-page ref="listPageRef" :api-fn="roleApi.getPage" search-placeholder="搜索角色" search-key="name" show-fab @fabClick="goToAdd">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.roleId" :options="swipeOptions" @click="onSwipeClick($event, item)">
            <u-cell-item :title="item.name" :label="item.roleCode" @click="goToEdit(item.roleId)">
              <template #value>
                <u-tag :text="roleTypeObj[item.roleType] || '未知'" type="info" size="mini" plain />
              </template>
            </u-cell-item>
          </u-swipe-action>
        </u-cell-group>
      </template>
    </list-page>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { roleApi } from '../../../api';
  import { roleTypeOption } from '../../../../shared/src/constants/api-type';
  import type { ApiRoleItem } from '/#/api/capital/role';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();

  const roleTypeObj: Record<number, string> = {};
  roleTypeOption.forEach((item) => {
    roleTypeObj[item.value] = item.label;
  });

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

  function goToAdd() {
    uni.navigateTo({ url: '/pages/system/role-edit/role-edit' });
  }

  function goToEdit(roleId: string) {
    uni.navigateTo({ url: `/pages/system/role-edit/role-edit?id=${roleId}` });
  }

  function onSwipeClick(event: any, item: ApiRoleItem) {
    const index = event.index;
    if (index === 0) {
      goToEdit(item.roleId);
    } else if (index === 1) {
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
  }

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>
