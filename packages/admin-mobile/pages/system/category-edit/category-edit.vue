<template>
  <view class="category-edit-page">
    <scroll-view scroll-y class="category-edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <view class="category-edit-card card">
          <text class="category-edit-section-title">分类信息</text>
          <u-form-item label="类型" prop="type" required>
            <view class="category-edit-select" @click="showTypeSelect = true">
              <text :class="form.type ? 'category-edit-select-value' : 'category-edit-select-placeholder'">
                {{ typeLabel || '请选择类型' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#999" />
            </view>
          </u-form-item>
          <u-form-item label="标签" prop="label" required>
            <u-input v-model="form.label" placeholder="请输入标签" :cursor-spacing="20" />
          </u-form-item>
        </view>

        <view class="category-edit-card card">
          <text class="category-edit-section-title">数值设置</text>
          <u-form-item label="数值" prop="value">
            <u-number-box v-model="form.value" :min="0" :disabled="!!form.valueStr" />
          </u-form-item>
          <u-form-item label="字符串值" prop="valueStr">
            <u-input v-model="form.valueStr" placeholder="请输入字符串值" :disabled="!!form.value" :cursor-spacing="20" />
          </u-form-item>
        </view>
      </u-form>
    </scroll-view>

    <u-select v-model="showTypeSelect" :list="categoryTypeList" title="选择类型" @confirm="onTypeConfirm" />

    <view class="fixed-bottom-btn">
      <u-button type="primary" shape="circle" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { setRefreshFlag } from '../../../composables/useRefreshFlag';
  import { onLoad } from '@dcloudio/uni-app';
  import { categoryApi } from '../../../api';
  import { categoryTypeOption } from '../../../../shared/src/constants/api-type';
  import { useApiTypeStore } from '../../../store';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const showTypeSelect = ref(false);
  const apiTypeStore = useApiTypeStore();

  const categoryTypeList = categoryTypeOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    type: '' as string,
    value: 0,
    valueStr: '',
    label: '',
  });

  const typeLabel = computed(() => {
    const item = categoryTypeList.find((o) => o.value === form.type);
    return item?.label || '';
  });

  const rules = {
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
  };

  function onTypeConfirm(e: any) {
    form.type = e[0]?.value ?? '';
  }

  async function loadCategory(categoryId: string) {
    try {
      const category = await categoryApi.getOne(categoryId);
      if (category) {
        form.type = category.type;
        form.label = category.label;
        form.value = category.value ?? 0;
        form.valueStr = category.valueStr ?? '';
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSave() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    loading.value = true;
    try {
      const data = { ...form };
      if (editId.value) {
        await categoryApi.update({ ...data, categoryId: editId.value });
      } else {
        await categoryApi.save(data);
      }
      apiTypeStore.againGetApiType(form.type);
      uni.showToast({ title: '保存成功', icon: 'success' });
      setRefreshFlag('category');
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onLoad((options) => {
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑分类' });
      loadCategory(options.id);
    } else {
      uni.setNavigationBarTitle({ title: '新建分类' });
    }
  });
</script>

<style lang="scss" scoped>
  .category-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .category-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx 20rpx 0;
    box-sizing: border-box;
  }

  .category-edit-card {
    padding: 24rpx;
    margin-bottom: 16rpx;
  }

  .category-edit-section-title {
    font-size: $uni-font-size-lg;
    font-weight: 600;
    color: $uni-text-color;
    display: block;
    margin-bottom: 20rpx;
  }

  .category-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
  }

  .category-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .category-edit-select-placeholder {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
  }
</style>
