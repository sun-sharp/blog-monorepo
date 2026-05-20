<template>
  <view class="page">
    <view class="search-bar">
      <u-search v-model="keyword" placeholder="搜索角色" @search="onSearch" @custom="onSearch" />
    </view>

    <scroll-view scroll-y class="list-scroll" @scrolltolower="onLoadMore">
      <view class="list-item" v-for="item in dataList" :key="item.roleId">
        <view class="item-main">
          <view class="item-info">
            <text class="item-title">{{ item.name }}</text>
            <text class="item-desc">{{ item.roleCode }} · {{ item.roleType === 1 ? '全部权限' : '自定义权限' }}</text>
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
        <text class="form-title">{{ isEdit ? '编辑角色' : '新增角色' }}</text>
        <u-form :model="formData" label-width="160rpx">
          <u-form-item label="角色名称">
            <u-input v-model="formData.name" placeholder="请输入角色名称" border="surround" />
          </u-form-item>
          <u-form-item label="角色编码">
            <u-input v-model="formData.roleCode" placeholder="请输入角色编码" border="surround" />
          </u-form-item>
          <u-form-item label="权限类型">
            <u-input v-model="formData.roleType" placeholder="1-全部 2-自定义" border="surround" type="number" />
          </u-form-item>
        </u-form>
        <u-button type="primary" text="确定" @click="onSubmit" customStyle="margin-top: 24rpx" />
      </view>
    </u-popup>

    <u-button type="primary" icon="plus" text="新增角色" @click="onAdd" customStyle="position: fixed; right: 32rpx; bottom: 32rpx; z-index: 9;" />
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { roleApi } from '@/api';
import { DEFAULT_PAGESIZE } from '@/constant';

const keyword = ref('');
const dataList = ref<any[]>([]);
const current = ref(1);
const total = ref(0);
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');
const showForm = ref(false);
const isEdit = ref(false);

const formData = reactive({ roleId: '', name: '', roleCode: '', roleType: 2, menuPermission: [], apiPermission: [] });

const fetchData = async (reset = false) => {
  if (reset) { current.value = 1; dataList.value = []; }
  loadStatus.value = 'loading';
  try {
    const res = await roleApi.getPage({ current: current.value, size: DEFAULT_PAGESIZE, name: keyword.value || undefined, roleCode: undefined });
    if (reset) { dataList.value = res.list || []; } else { dataList.value.push(...(res.list || [])); }
    total.value = res.total || 0;
    loadStatus.value = dataList.value.length >= total.value ? 'nomore' : 'loadmore';
  } catch { loadStatus.value = 'loadmore'; }
};

const onSearch = () => fetchData(true);
const onLoadMore = () => { if (loadStatus.value !== 'nomore') { current.value++; fetchData(); } };
const onAdd = () => { isEdit.value = false; Object.assign(formData, { roleId: '', name: '', roleCode: '', roleType: 2, menuPermission: [], apiPermission: [] }); showForm.value = true; };
const onEdit = (item: any) => { isEdit.value = true; Object.assign(formData, item); showForm.value = true; };
const onRemove = (item: any) => {
  uni.showModal({ title: '提示', content: `确定删除角色 ${item.name} 吗？`, success: async (res) => { if (res.confirm) { await roleApi.remove(item.roleId); fetchData(true); } } });
};
const onSubmit = async () => {
  try { if (isEdit.value) { await roleApi.update(formData as any); } else { await roleApi.save(formData as any); } showForm.value = false; fetchData(true); } catch { console.error; }
};

onMounted(() => fetchData(true));
</script>

<style lang="scss" scoped>
.page { padding: 20rpx; }
.search-bar { margin-bottom: 20rpx; }
.list-scroll { height: calc(100vh - 160rpx); }
.list-item { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; }
.item-info { flex: 1; }
.item-title { display: block; font-size: 28rpx; color: #303133; font-weight: bold; }
.item-desc { display: block; font-size: 24rpx; color: #909399; margin-top: 4rpx; }
.item-actions { display: flex; gap: 16rpx; margin-top: 16rpx; justify-content: flex-end; }
.form-popup { padding: 32rpx; }
.form-title { display: block; font-size: 32rpx; font-weight: bold; text-align: center; margin-bottom: 24rpx; }
</style>
