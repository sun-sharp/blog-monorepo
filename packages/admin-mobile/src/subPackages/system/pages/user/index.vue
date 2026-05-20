<template>
  <view class="page">
    <view class="search-bar">
      <u-search v-model="keyword" placeholder="搜索用户" @search="onSearch" @custom="onSearch" />
    </view>

    <scroll-view scroll-y class="list-scroll" @scrolltolower="onLoadMore">
      <view class="list-item" v-for="item in dataList" :key="item.userId">
        <view class="item-main">
          <u-avatar :src="item.avatar || ''" size="40" />
          <view class="item-info">
            <text class="item-title">{{ item.nickname }}</text>
            <text class="item-desc">{{ item.username }} · {{ item.roleName }}</text>
          </view>
        </view>
        <view class="item-actions">
          <u-button type="primary" size="mini" text="编辑" @click="onEdit(item)" />
          <u-button type="error" size="mini" text="删除" @click="onRemove(item)" />
        </view>
      </view>
      <u-loadmore :status="loadStatus" />
    </scroll-view>

    <u-popup :show="showForm" mode="bottom" round="16" @close="showForm = false">
      <view class="form-popup">
        <text class="form-title">{{ isEdit ? '编辑用户' : '新增用户' }}</text>
        <u-form :model="formData" label-width="160rpx">
          <u-form-item label="昵称">
            <u-input v-model="formData.nickname" placeholder="请输入昵称" border="surround" />
          </u-form-item>
          <u-form-item label="用户名">
            <u-input v-model="formData.username" placeholder="请输入用户名" border="surround" :disabled="isEdit" />
          </u-form-item>
          <u-form-item label="角色" v-if="!isEdit">
            <u-input v-model="formData.roleCode" placeholder="请输入角色编码" border="surround" />
          </u-form-item>
          <u-form-item label="密码" v-if="!isEdit">
            <u-input v-model="formData.password" type="password" placeholder="请输入密码" border="surround" />
          </u-form-item>
        </u-form>
        <u-button type="primary" text="确定" @click="onSubmit" customStyle="margin-top: 24rpx" />
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { userApi } from '@/api';
import { DEFAULT_PAGESIZE } from '@/constant';

const keyword = ref('');
const dataList = ref<any[]>([]);
const current = ref(1);
const total = ref(0);
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');
const showForm = ref(false);
const isEdit = ref(false);

const formData = reactive({
  userId: '',
  nickname: '',
  username: '',
  roleCode: '',
  password: '',
});

const fetchData = async (reset = false) => {
  if (reset) {
    current.value = 1;
    dataList.value = [];
  }
  loadStatus.value = 'loading';
  try {
    const res = await userApi.getPage({
      current: current.value,
      size: DEFAULT_PAGESIZE,
      nickname: keyword.value || undefined,
      username: undefined,
    });
    if (reset) {
      dataList.value = res.list || [];
    } else {
      dataList.value.push(...(res.list || []));
    }
    total.value = res.total || 0;
    loadStatus.value = dataList.value.length >= total.value ? 'nomore' : 'loadmore';
  } catch (error) {
    loadStatus.value = 'loadmore';
  }
};

const onSearch = () => fetchData(true);
const onLoadMore = () => {
  if (loadStatus.value !== 'nomore') {
    current.value++;
    fetchData();
  }
};

const onEdit = (item: any) => {
  isEdit.value = true;
  Object.assign(formData, { userId: item.userId, nickname: item.nickname, username: item.username, roleCode: '', password: '' });
  showForm.value = true;
};

const onRemove = (item: any) => {
  uni.showModal({
    title: '提示',
    content: `确定删除用户 ${item.nickname} 吗？`,
    success: async (res) => {
      if (res.confirm) {
        await userApi.remove(item.userId);
        fetchData(true);
      }
    },
  });
};

const onSubmit = async () => {
  try {
    if (isEdit.value) {
      await userApi.updateUserInfo({ nickname: formData.nickname, username: formData.username, avatar: '' });
    }
    showForm.value = false;
    fetchData(true);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => fetchData(true));
</script>

<style lang="scss" scoped>
.page { padding: 20rpx; }
.search-bar { margin-bottom: 20rpx; }
.list-scroll { height: calc(100vh - 160rpx); }
.list-item { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; }
.item-main { display: flex; align-items: center; }
.item-info { flex: 1; margin-left: 16rpx; }
.item-title { display: block; font-size: 28rpx; color: #303133; font-weight: bold; }
.item-desc { display: block; font-size: 24rpx; color: #909399; margin-top: 4rpx; }
.item-actions { display: flex; gap: 16rpx; margin-top: 16rpx; justify-content: flex-end; }
.form-popup { padding: 32rpx; }
.form-title { display: block; font-size: 32rpx; font-weight: bold; text-align: center; margin-bottom: 24rpx; }
</style>
