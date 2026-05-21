<template>
  <view class="home-page">
    <view class="home-user card" @click="goToAccount">
      <u-avatar :src="userInfo.avatar || '/static/logo.png'" size="80" />
      <view class="home-user-info">
        <text class="home-user-name">{{ userInfo.nickname || '未登录' }}</text>
        <text class="home-user-role">{{ userInfo.roleName || '' }}</text>
      </view>
      <u-icon name="arrow-right" color="#999" />
    </view>

    <view class="home-todo card">
      <view class="home-todo-header">
        <text class="home-todo-title">待办事项</text>
        <u-subsection :list="['进行中', '已完成']" :current="todoState === 1 ? 0 : 1" mode="subsection" @change="onTodoStateChange" />
      </view>
      <view v-if="waitForDoClassifyOption.length > 0" class="home-todo-tabs">
        <u-tabs :list="classifyTabs" :current="currentClassify" :scrollable="true" @click="onClassifyClick" />
      </view>
      <view v-if="todoLoading" class="home-todo-loading">
        <u-loading mode="circle" />
      </view>
      <view v-else-if="todoList.length === 0" class="home-todo-empty">
        <u-empty mode="data" text="暂无待办" icon-size="120" />
      </view>
      <view v-else class="home-todo-list">
        <u-cell-group>
          <u-cell-item v-for="item in todoList" :key="item.waitForDoId" :title="item.title" :label="item.deadline || ''" @click="onTodoClick(item)">
            <template #icon>
              <u-checkbox :model-value="item.state === 2" active-color="#007aff" shape="circle" @change="onTodoCheck(item)" />
            </template>
          </u-cell-item>
        </u-cell-group>
      </view>
      <view class="home-todo-add">
        <u-input v-model="newTodoTitle" placeholder="添加新待办，回车提交" clearable @confirm="addTodo">
          <template #suffix>
            <u-button type="primary" size="mini" @click="addTodo">添加</u-button>
          </template>
        </u-input>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { useUserStore, useApiTypeStore } from '../../store';
  import { waitForDoApi } from '../../api';
  import type { ApiWaitForDoItem } from '/#/api/capital/wait-for-do';

  const userStore = useUserStore();
  const apiTypeStore = useApiTypeStore();

  const userInfo = computed(() => userStore.getUserInfo);
  const todoState = ref(1);
  const currentClassify = ref(0);
  const todoList = ref<ApiWaitForDoItem[]>([]);
  const todoLoading = ref(false);
  const newTodoTitle = ref('');

  const waitForDoClassifyOption = computed(() => apiTypeStore.getWaitForDoClassifyOption);

  const classifyTabs = computed(() => {
    const tabs = waitForDoClassifyOption.value.map((item) => ({ name: item.label }));
    return [{ name: '全部' }, ...tabs];
  });

  async function loadTodoList() {
    todoLoading.value = true;
    try {
      const classify = currentClassify.value === 0 ? undefined : waitForDoClassifyOption.value[currentClassify.value - 1]?.value;
      const res = await waitForDoApi.classifyAll(classify as any, todoState.value);
      todoList.value = res || [];
    } catch {
      todoList.value = [];
    } finally {
      todoLoading.value = false;
    }
  }

  function onTodoStateChange(index: number) {
    todoState.value = index === 0 ? 1 : 2;
    loadTodoList();
  }

  function onClassifyClick(item: any) {
    currentClassify.value = item.index;
    loadTodoList();
  }

  async function onTodoCheck(item: ApiWaitForDoItem) {
    const newState = item.state === 1 ? 2 : 1;
    try {
      await waitForDoApi.updateState({
        waitForDoId: item.waitForDoId,
        state: newState,
        ...(newState === 2 ? { completionTime: new Date() } : { $unset: { completionTime: '' } }),
      });
      loadTodoList();
    } catch (e) {
      console.error(e);
    }
  }

  function onTodoClick(item: ApiWaitForDoItem) {
    uni.navigateTo({ url: `/pages/home/wait-for-do-detail?id=${item.waitForDoId}` });
  }

  async function addTodo() {
    if (!newTodoTitle.value.trim()) return;
    try {
      const classify =
        currentClassify.value === 0 ? waitForDoClassifyOption.value[0]?.value || 0 : waitForDoClassifyOption.value[currentClassify.value - 1]?.value || 0;
      await waitForDoApi.save({
        title: newTodoTitle.value.trim(),
        classify: classify as number,
        deadline: '',
        state: 1,
      });
      newTodoTitle.value = '';
      loadTodoList();
    } catch (e) {
      console.error(e);
    }
  }

  function goToAccount() {
    uni.navigateTo({ url: '/pages/setting/account/account' });
  }

  onMounted(async () => {
    await apiTypeStore.getWaitForDoClassify();
    loadTodoList();
  });

  onShow(() => {
    if (userInfo.value.userId) {
      loadTodoList();
    }
  });
</script>

<style lang="scss" scoped>
  .home-page {
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }

  .home-user {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 30rpx;
    background-color: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    margin-bottom: 20rpx;
  }

  .home-user-info {
    flex: 1;
    margin-left: 24rpx;
    display: flex;
    flex-direction: column;
  }

  .home-user-name {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .home-user-role {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
  }

  .home-todo {
    background-color: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    padding: 24rpx;
  }

  .home-todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  .home-todo-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .home-todo-tabs {
    margin-bottom: 20rpx;
  }

  .home-todo-loading,
  .home-todo-empty {
    display: flex;
    justify-content: center;
    padding: 60rpx 0;
  }

  .home-todo-list {
    max-height: 600rpx;
    overflow-y: auto;
  }

  .home-todo-add {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid $uni-border-color;
  }
</style>
