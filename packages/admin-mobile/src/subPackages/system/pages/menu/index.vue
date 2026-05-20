<template>
  <view class="page">
    <view class="search-bar">
      <u-search v-model="keyword" placeholder="搜索菜单" @search="onSearch" @custom="onSearch" />
    </view>

    <scroll-view scroll-y class="list-scroll">
      <view class="list-item" v-for="item in dataList" :key="item.menuId">
        <view class="item-main">
          <view class="item-info">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-desc">{{ item.name }} · {{ menuTypeObj[item.menuType] || '未知' }}</text>
          </view>
        </view>
        <view class="item-actions">
          <u-button type="primary" size="mini" text="编辑" @click="onEdit(item)" />
          <u-button type="error" size="mini" text="删除" @click="onRemove(item)" />
        </view>
      </view>
      <u-loadmore status="nomore" />
    </scroll-view>

    <u-popup :show="showForm" mode="bottom" round="16" @close="showForm = false">
      <view class="form-popup">
        <text class="form-title">{{ isEdit ? '编辑菜单' : '新增菜单' }}</text>
        <u-form :model="formData" label-width="160rpx">
          <u-form-item label="菜单名称"><u-input v-model="formData.name" placeholder="请输入" border="surround" /></u-form-item>
          <u-form-item label="标题"><u-input v-model="formData.title" placeholder="请输入" border="surround" /></u-form-item>
          <u-form-item label="菜单类型"><u-input v-model="formData.menuType" placeholder="1-目录 5-菜单 6-内嵌 7-外链" border="surround" type="number" /></u-form-item>
          <u-form-item label="组件路径"><u-input v-model="formData.component" placeholder="请输入" border="surround" /></u-form-item>
          <u-form-item label="排序"><u-input v-model="formData.sort" placeholder="请输入" border="surround" type="number" /></u-form-item>
        </u-form>
        <u-button type="primary" text="确定" @click="onSubmit" customStyle="margin-top: 24rpx" />
      </view>
    </u-popup>

    <u-button type="primary" icon="plus" text="新增菜单" @click="onAdd" customStyle="position: fixed; right: 32rpx; bottom: 32rpx; z-index: 9;" />
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { menuApi } from '@/api';
import { menuTypeObj } from '@/constant';

const keyword = ref('');
const dataList = ref<any[]>([]);
const showForm = ref(false);
const isEdit = ref(false);
const formData = reactive({ menuId: '', name: '', title: '', menuType: 5, component: '', sort: 0, parentId: '0', hidden: false, keepAlive: true, icon: '' });

const fetchData = async () => {
  try { dataList.value = await menuApi.getMenuList(); } catch { console.error; }
};

const onSearch = () => fetchData();
const onAdd = () => { isEdit.value = false; Object.assign(formData, { menuId: '', name: '', title: '', menuType: 5, component: '', sort: 0, parentId: '0' }); showForm.value = true; };
const onEdit = (item: any) => { isEdit.value = true; Object.assign(formData, item); showForm.value = true; };
const onRemove = (item: any) => {
  uni.showModal({ title: '提示', content: `确定删除菜单 ${item.title} 吗？`, success: async (res) => { if (res.confirm) { await menuApi.removeMenu(item.menuId); fetchData(); } } });
};
const onSubmit = async () => {
  try { if (isEdit.value) { await menuApi.updateMenu(formData as any); } else { await menuApi.saveMenu(formData as any); } showForm.value = false; fetchData(); } catch { console.error; }
};

onMounted(() => fetchData());
</script>

<style lang="scss" scoped>
.page { padding: 20rpx; }
.search-bar { margin-bottom: 20rpx; }
.list-scroll { height: calc(100vh - 120rpx); }
.list-item { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; }
.item-info { flex: 1; }
.item-title { display: block; font-size: 28rpx; color: #303133; font-weight: bold; }
.item-desc { display: block; font-size: 24rpx; color: #909399; margin-top: 4rpx; }
.item-actions { display: flex; gap: 16rpx; margin-top: 16rpx; justify-content: flex-end; }
.form-popup { padding: 32rpx; }
.form-title { display: block; font-size: 32rpx; font-weight: bold; text-align: center; margin-bottom: 24rpx; }
</style>
