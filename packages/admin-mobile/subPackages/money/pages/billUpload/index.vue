<template>
  <view class="page">
    <view class="search-bar">
      <u-search v-model="keyword" placeholder="搜索导入规则" @search="onSearch" @custom="onSearch" />
    </view>

    <scroll-view scroll-y class="list-scroll" @scrolltolower="onLoadMore">
      <view class="list-item" v-for="item in dataList" :key="item.billUploadId">
        <view class="item-main">
          <view class="item-info">
            <text class="item-title">{{ item.billJudgeKey }}</text>
            <text class="item-desc">类型: {{ billUploadTypeMap[item.billUploadType] || item.billUploadType }} · 方式: {{ item.judgeWay }}</text>
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
        <text class="form-title">{{ isEdit ? '编辑规则' : '新增规则' }}</text>
        <u-form :model="formData" label-width="180rpx">
          <u-form-item label="账单类型"><u-input v-model="formData.billUploadType" placeholder="1-微信 2-支付宝 3-银行" border="surround" type="number" /></u-form-item>
          <u-form-item label="判断字段"><u-input v-model="formData.billJudgeKey" placeholder="请输入" border="surround" /></u-form-item>
          <u-form-item label="处理类型"><u-input v-model="formData.handleType" placeholder="请输入" border="surround" /></u-form-item>
          <u-form-item label="判断方式"><u-input v-model="formData.judgeWay" placeholder="indexOf/includes" border="surround" /></u-form-item>
          <u-form-item label="判断值"><u-input v-model="formData.judgeVal" placeholder="请输入" border="surround" /></u-form-item>
        </u-form>
        <u-button type="primary" text="确定" @click="onSubmit" customStyle="margin-top: 24rpx" />
      </view>
    </u-popup>

    <u-button type="primary" icon="plus" text="新增规则" @click="onAdd" customStyle="position: fixed; right: 32rpx; bottom: 32rpx; z-index: 9;" />
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { billUploadApi } from '@/api';
import { DEFAULT_PAGESIZE, billUploadTypeMap } from '@/constant';

const keyword = ref('');
const dataList = ref<any[]>([]);
const current = ref(1);
const total = ref(0);
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');
const showForm = ref(false);
const isEdit = ref(false);
const formData = reactive({ billUploadId: '', billUploadType: 1, billJudgeKey: '', handleType: '', judgeWay: 'indexOf', judgeVal: '', priorityWeight: 0 });

const fetchData = async (reset = false) => {
  if (reset) { current.value = 1; dataList.value = []; }
  loadStatus.value = 'loading';
  try {
    const res = await billUploadApi.getPage({ current: current.value, size: DEFAULT_PAGESIZE });
    if (reset) { dataList.value = res.list || []; } else { dataList.value.push(...(res.list || [])); }
    total.value = res.total || 0;
    loadStatus.value = dataList.value.length >= total.value ? 'nomore' : 'loadmore';
  } catch { loadStatus.value = 'loadmore'; }
};

const onSearch = () => fetchData(true);
const onLoadMore = () => { if (loadStatus.value !== 'nomore') { current.value++; fetchData(); } };
const onAdd = () => { isEdit.value = false; Object.assign(formData, { billUploadId: '', billUploadType: 1, billJudgeKey: '', handleType: '', judgeWay: 'indexOf', judgeVal: '' }); showForm.value = true; };
const onEdit = (item: any) => { isEdit.value = true; Object.assign(formData, item); showForm.value = true; };
const onRemove = (item: any) => {
  uni.showModal({ title: '提示', content: '确定删除此规则吗？', success: async (res) => { if (res.confirm) { await billUploadApi.remove(item.billUploadId); fetchData(true); } } });
};
const onSubmit = async () => {
  try { if (isEdit.value) { await billUploadApi.update(formData as any); } else { await billUploadApi.save(formData as any); } showForm.value = false; fetchData(true); } catch { console.error; }
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
