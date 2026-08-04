<template>
  <scroll-view scroll-y class="home-page">
    <view class="home-quick-nav card">
      <text class="home-section-title">快捷功能</text>
      <u-grid :col="3" :border="false">
        <u-grid-item @click="navigateTo('/pages/blog/schedule/schedule')">
          <view class="nav-icon-wrap nav-icon-green">
            <u-icon name="calendar" size="40" color="#fff" />
          </view>
          <text class="nav-label">日程</text>
        </u-grid-item>
        <u-grid-item @click="navigateTo('/pages/finance/upload/upload')">
          <view class="nav-icon-wrap nav-icon-orange">
            <u-icon name="download" size="40" color="#fff" />
          </view>
          <text class="nav-label">导入</text>
        </u-grid-item>
        <u-grid-item @click="navigateTo('/pages/finance/summary/summary')">
          <view class="nav-icon-wrap nav-icon-blue">
            <u-icon name="grid" size="40" color="#fff" />
          </view>
          <text class="nav-label">汇总</text>
        </u-grid-item>
      </u-grid>
    </view>

    <view class="home-todo card">
      <view class="home-todo-header">
        <view class="home-section-title-row">
          <u-icon name="list" size="32" color="#007aff" />
          <text class="home-section-title">待办事项</text>
        </view>
        <u-subsection
          :list="['进行中', '已完成']"
          :current="todoState === 1 ? 0 : 1"
          mode="subsection"
          active-color="#007aff"
          size="mini"
          @change="onTodoStateChange" />
      </view>
      <view v-if="waitForDoClassifyOption.length > 0" class="home-todo-tabs">
        <u-tabs :list="classifyTabs" :current="currentClassify" :scrollable="true" active-color="#007aff" @change="onClassifyClick" />
      </view>
      <view class="home-todo-add">
        <u-input
          v-model="newTodoTitle"
          placeholder="添加新待办，回车提交"
          clearable
          shape="round"
          :custom-style="{ background: '#f5f5f5' }"
          :cursor-spacing="20"
          @confirm="addTodo" />
        <u-button type="primary" size="mini" shape="circle" class="home-todo-add-btn" @click="addTodo">添加</u-button>
      </view>
      <view v-if="todoLoading" class="home-todo-center">
        <u-loading mode="circle" />
      </view>
      <view v-else-if="todoList.length === 0" class="home-todo-center">
        <u-empty mode="data" text="暂无待办" icon-size="120" />
      </view>
      <view v-else class="home-todo-list">
        <view v-for="item in todoList" :key="item.waitForDoId" class="home-todo-item" @click="onTodoClick(item)">
          <u-checkbox :model-value="item.state === 2" active-color="#007aff" shape="circle" @change="onTodoCheck(item)" />
          <view class="home-todo-item-content">
            <text :class="{ 'home-todo-done': item.state === 2 }" class="home-todo-item-title">{{ item.title }}</text>
            <text v-if="item.deadline" class="home-todo-item-deadline">{{ item.deadline }}</text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useUserStore, useApiTypeStore } from '../../store';
  import { waitForDoApi } from '../../api';
  import type { ApiWaitForDoItem } from '/#/api/capital/wait-for-do';

  const props = defineProps<{ active: boolean }>();

  const userStore = useUserStore();
  const apiTypeStore = useApiTypeStore();

  const userInfo = computed(() => userStore.getUserInfo);
  const todoState = ref(1);
  const currentClassify = ref(0);
  const todoList = ref<ApiWaitForDoItem[]>([]);
  const todoLoading = ref(false);
  const newTodoTitle = ref('');
  const inited = ref(false);

  const waitForDoClassifyOption = computed(() => apiTypeStore.getWaitForDoClassifyOption);

  const classifyTabs = computed(() => {
    const tabs = waitForDoClassifyOption.value.map((item) => ({ name: item.label }));
    return [{ name: '全部' }, ...tabs];
  });

  async function loadTodoList() {
    todoLoading.value = true;
    try {
      const classify = currentClassify.value === 0 ? undefined : waitForDoClassifyOption.value[currentClassify.value - 1]?.value;
      const res = await waitForDoApi.classifyAll(todoState.value, classify);
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

  function onClassifyClick(index: number) {
    currentClassify.value = index;
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

  // function goToAccount() {
  //   uni.navigateTo({ url: '/pages/setting/account/account' });
  // }

  function navigateTo(url: string) {
    uni.navigateTo({ url });
  }

  onMounted(async () => {
    await apiTypeStore.getWaitForDoClassify();
    loadTodoList();
    inited.value = true;
  });

  watch(
    () => props.active,
    (val) => {
      if (val && inited.value && userInfo.value.userId) {
        loadTodoList();
      }
    }
  );
</script>

<style lang="scss" scoped>
  .home-page {
    height: 100%;
    padding: 0 20rpx;
    padding-bottom: 20rpx;
    box-sizing: border-box;
  }

  .home-section-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .home-section-title-row {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }

  .nav-icon-wrap {
    width: 80rpx;
    height: 80rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-icon-blue {
    background: linear-gradient(135deg, #4facfe, #007aff);
  }

  .nav-icon-green {
    background: linear-gradient(135deg, #43e97b, #38f9d7);
  }

  .nav-icon-orange {
    background: linear-gradient(135deg, #fa709a, #fee140);
  }

  .nav-label {
    font-size: $uni-font-size-sm;
    margin-top: 12rpx;
  }

  .home-todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  .home-todo-tabs {
    margin-bottom: 16rpx;
  }

  .home-todo-center {
    display: flex;
    justify-content: center;
    padding: 60rpx 0;
  }

  .home-todo-list {
    // max-height: 450rpx;
    // overflow-y: auto;
  }

  .home-todo-item {
    display: flex;
    align-items: center;
    padding: 16rpx 0;
    border-bottom: 1rpx solid $uni-border-color;

    &:last-child {
      border-bottom: none;
    }
  }

  .home-todo-item-content {
    flex: 1;
    margin-left: 16rpx;
  }

  .home-todo-item-title {
    font-size: $uni-font-size-base;
  }

  .home-todo-done {
    text-decoration: line-through;
    color: $uni-text-color-grey;
  }

  .home-todo-item-deadline {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 4rpx;
    display: block;
  }

  .home-todo-add {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid $uni-border-color;
  }

  .home-todo-add-btn {
    flex-shrink: 0;
  }
</style>
