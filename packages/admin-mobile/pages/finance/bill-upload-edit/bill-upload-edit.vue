<template>
  <view class="edit-page">
    <scroll-view scroll-y class="edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <view class="edit-card card">
          <u-form-item label="账单导入类型" prop="billUploadType">
            <view class="edit-select" @click="showBillUploadTypeSelect = true">
              <text :class="form.billUploadType ? 'edit-select-value' : 'edit-select-placeholder'">{{ billUploadTypeLabel || '请选择' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="需处理类型" prop="handleType">
            <view class="edit-select" @click="showHandleTypeSelect = true">
              <text :class="form.handleType ? 'edit-select-value' : 'edit-select-placeholder'">{{ handleTypeLabel || '请选择' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item v-if="form.handleType === 'inflowOrOutflow'" label="流入/流出" prop="inflowOrOutflow">
            <view class="edit-select" @click="showInflowSelect = true">
              <text :class="form.inflowOrOutflow ? 'edit-select-value' : 'edit-select-placeholder'">{{ inflowLabel || '请选择' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item v-else-if="form.handleType === 'billType'" label="账单类型" prop="billType">
            <view class="edit-select" @click="showBillTypeSelect = true">
              <text :class="form.billType ? 'edit-select-value' : 'edit-select-placeholder'">{{ billTypeLabel || '请选择' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item v-else-if="form.handleType === 'billMethod'" label="账单方式" prop="billMethod">
            <view class="edit-select" @click="showBillMethodSelect = true">
              <text :class="form.billMethod ? 'edit-select-value' : 'edit-select-placeholder'">{{ billMethodLabel || '请选择' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
        </view>

        <view class="edit-card card">
          <view class="code-header">
            <text class="code-title">代码</text>
            <text class="code-tip">isAssignment 开头，boolean 类型，item 为账单数据</text>
          </view>
          <view v-if="codeFields.length > 0" class="code-fields">
            <text v-for="field in codeFields" :key="field.key" class="code-field-item">{{ field.key }}: {{ field.label }}({{ field.type }})</text>
          </view>
          <view class="code-input-btns">
            <text v-for="it in codeInputArray" :key="it" class="code-input-btn" @click="insertCode(it)">{{ it }}</text>
          </view>
          <u-textarea v-model="form.code" placeholder="请输入代码" :auto-height="true" :maxlength="-1" :cursor-spacing="20" />
        </view>
      </u-form>
    </scroll-view>

    <searchable-select
      v-model="showBillUploadTypeSelect"
      title="选择导入类型"
      :list="billUploadTypeList"
      :current-value="form.billUploadType ?? undefined"
      @confirm="
        (item) => {
          form.billUploadType = Number(item.value);
        }
      " />
    <searchable-select
      v-model="showHandleTypeSelect"
      title="选择处理类型"
      :list="handleTypeList"
      :current-value="form.handleType || undefined"
      @confirm="
        (item) => {
          form.handleType = String(item.value);
        }
      " />
    <searchable-select
      v-model="showInflowSelect"
      title="选择流入/流出"
      :list="inflowOrOutflowList"
      :current-value="form.inflowOrOutflow ?? undefined"
      @confirm="
        (item) => {
          form.inflowOrOutflow = Number(item.value);
        }
      " />
    <searchable-select
      v-model="showBillTypeSelect"
      title="选择账单类型"
      :list="billTypeSelectList"
      :current-value="form.billType ?? undefined"
      @confirm="
        (item) => {
          form.billType = Number(item.value);
        }
      " />
    <searchable-select
      v-model="showBillMethodSelect"
      title="选择账单方式"
      :list="billMethodSelectList"
      :current-value="form.billMethod ?? undefined"
      @confirm="
        (item) => {
          form.billMethod = Number(item.value);
        }
      " />

    <view class="fixed-bottom-btn">
      <u-button type="primary" shape="circle" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { billUploadApi } from '../../../api';
  import { billUploadTypeOption, handleTypeOption, inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';
  import { weChatBillUploadType, aliPayBillUploadType, bankBillUploadType } from '../../../../shared/src/constants/api-type';
  import { weChatUploadFields } from '../../../../shared/src/constants/api/we-chat-fields';
  import { aliPayUploadFields } from '../../../../shared/src/constants/api/ali-pay-fields';
  import { bankUploadFields } from '../../../../shared/src/constants/api/bank-fields';
  import { useApiTypeStore } from '../../../store';
  import SearchableSelect from '../../../components/searchable-select/searchable-select.vue';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const showBillUploadTypeSelect = ref(false);
  const showHandleTypeSelect = ref(false);
  const showInflowSelect = ref(false);
  const showBillTypeSelect = ref(false);
  const showBillMethodSelect = ref(false);
  const apiTypeStore = useApiTypeStore();

  const billUploadTypeList = billUploadTypeOption.map((item) => ({ label: item.label, value: item.value }));
  const handleTypeList = handleTypeOption.map((item) => ({ label: item.label, value: item.value }));
  const inflowOrOutflowList = inflowOrOutflowOption.map((item) => ({ label: item.label, value: item.value }));

  const billTypeSelectList = computed(() => apiTypeStore.getBillTypeOption as { label: string; value: number | string; [key: string]: string | number }[]);
  const billMethodSelectList = computed(() => apiTypeStore.getBillMethodOption as { label: string; value: number | string; [key: string]: string | number }[]);

  const form = reactive({
    billUploadType: null as number | null,
    handleType: '' as string,
    inflowOrOutflow: null as number | null,
    billType: null as number | null,
    billMethod: null as number | null,
    code: '' as string,
  });

  const billUploadTypeLabel = computed(() => billUploadTypeList.find((r) => r.value === form.billUploadType)?.label || '');
  const handleTypeLabel = computed(() => handleTypeList.find((r) => r.value === form.handleType)?.label || '');
  const inflowLabel = computed(() => inflowOrOutflowList.find((r) => r.value === form.inflowOrOutflow)?.label || '');
  const billTypeLabel = computed(() => billTypeSelectList.value.find((r) => r.value === form.billType)?.label || '');
  const billMethodLabel = computed(() => billMethodSelectList.value.find((r) => r.value === form.billMethod)?.label || '');

  const codeFields = computed(() => {
    if (form.billUploadType === weChatBillUploadType) return weChatUploadFields;
    if (form.billUploadType === aliPayBillUploadType) return aliPayUploadFields;
    if (form.billUploadType === bankBillUploadType) return bankUploadFields;
    return [];
  });

  const codeInputArray = computed(() => {
    return [
      ...codeFields.value.map((item: { key: string }) => item.key),
      'item',
      'isAssignment',
      'includes',
      '.some((fi) => .indexOf(fi)!==-1)',
      '===',
      '!==',
      '&&',
      '||',
      '!',
    ];
  });

  function insertCode(code: string) {
    form.code += code;
  }

  const rules = {
    billUploadType: [{ required: true, message: '请选择账单导入类型', trigger: 'change' }],
    handleType: [{ required: true, message: '请选择需处理类型', trigger: 'change' }],
    code: [{ required: true, message: '请输入代码', trigger: 'blur' }],
  };

  async function loadDetail(id: string) {
    try {
      const item = await billUploadApi.getOne(id);
      if (item) {
        form.billUploadType = item.billUploadType ?? null;
        form.handleType = item.handleType ?? '';
        form.inflowOrOutflow = item.inflowOrOutflow ?? null;
        form.billType = item.billType ?? null;
        form.billMethod = item.billMethod ?? null;
        form.code = item.code ?? '';
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
    if (form.handleType === 'inflowOrOutflow' && !form.inflowOrOutflow) {
      uni.showToast({ title: '请选择流入/流出', icon: 'none' });
      return;
    }
    if (form.handleType === 'billType' && !form.billType) {
      uni.showToast({ title: '请选择账单类型', icon: 'none' });
      return;
    }
    if (form.handleType === 'billMethod' && !form.billMethod) {
      uni.showToast({ title: '请选择账单方式', icon: 'none' });
      return;
    }
    loading.value = true;
    try {
      const data: any = {
        billUploadType: form.billUploadType || 0,
        handleType: form.handleType || '',
        code: form.code || '',
      };
      if (form.handleType === 'inflowOrOutflow' && form.inflowOrOutflow) data.inflowOrOutflow = form.inflowOrOutflow;
      if (form.handleType === 'billType' && form.billType) data.billType = form.billType;
      if (form.handleType === 'billMethod' && form.billMethod) data.billMethod = form.billMethod;
      if (editId.value) {
        await billUploadApi.update({ ...data, billUploadId: editId.value });
      } else {
        await billUploadApi.save(data);
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    Promise.all([apiTypeStore.getBillType(), apiTypeStore.getBillMethod()]);
  });

  onLoad((options) => {
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑上传规则' });
      loadDetail(options.id);
    } else {
      uni.setNavigationBarTitle({ title: '新建上传规则' });
    }
  });
</script>

<style lang="scss" scoped>
  .edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx 20rpx 0;
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .edit-card {
    padding: 24rpx;
    margin-bottom: 16rpx;
  }

  .edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
  }

  .edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .edit-select-placeholder {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
  }

  .code-header {
    display: flex;
    align-items: baseline;
    gap: 12rpx;
    margin-bottom: 12rpx;
  }

  .code-title {
    font-size: $uni-font-size-base;
    font-weight: 600;
    color: $uni-text-color;
    flex-shrink: 0;
  }

  .code-tip {
    font-size: 22rpx;
    color: $uni-text-color-grey;
  }

  .code-fields {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx 16rpx;
    margin-bottom: 16rpx;
    padding: 16rpx;
    background-color: #fafafa;
    border-radius: 12rpx;
  }

  .code-field-item {
    font-size: 22rpx;
    color: #e74c3c;
  }

  .code-input-btns {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 16rpx;
  }

  .code-input-btn {
    font-size: 26rpx;
    margin: 6rpx;
    background-color: $uni-color-primary;
    color: $uni-text-color-inverse;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
  }
</style>
