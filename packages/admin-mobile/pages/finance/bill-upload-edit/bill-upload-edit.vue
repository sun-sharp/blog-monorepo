<template>
  <view class="bill-upload-edit-page">
    <scroll-view scroll-y class="bill-upload-edit-scroll" :style="scrollStyle">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <u-form-item label="账单导入类型" prop="billUploadType">
          <view class="bill-upload-edit-select" @click="showBillUploadTypeSelect = true">
            <text class="bill-upload-edit-select-value">{{ billUploadTypeLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item label="需处理类型" prop="handleType">
          <view class="bill-upload-edit-select" @click="showHandleTypeSelect = true">
            <text class="bill-upload-edit-select-value">{{ handleTypeLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item v-if="form.handleType === 'inflowOrOutflow'" label="流入/流出" prop="inflowOrOutflow">
          <view class="bill-upload-edit-select" @click="showInflowSelect = true">
            <text class="bill-upload-edit-select-value">{{ inflowLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item v-else-if="form.handleType === 'billType'" label="账单类型" prop="billType">
          <view class="bill-upload-edit-select" @click="showBillTypeSelect = true">
            <text class="bill-upload-edit-select-value">{{ billTypeLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item v-else-if="form.handleType === 'billMethod'" label="账单方式" prop="billMethod">
          <view class="bill-upload-edit-select" @click="showBillMethodSelect = true">
            <text class="bill-upload-edit-select-value">{{ billMethodLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item label="代码" prop="code">
          <view class="bill-upload-edit-code-label">
            <text>代码</text>
            <view class="bill-upload-edit-info" @click="showCodeHelp = true">
              <u-icon name="info-circle" size="28" color="#f0a020" />
            </view>
          </view>
          <u-textarea v-model="form.code" placeholder="请输入代码" :auto-height="true" :maxlength="-1" />
        </u-form-item>
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

    <u-popup v-model="showCodeHelp" mode="bottom" length="60%" :border-radius="24" :safe-area-inset-bottom="true">
      <view class="bill-upload-edit-help">
        <view class="bill-upload-edit-help-header">
          <text class="bill-upload-edit-help-title">代码说明</text>
          <view class="bill-upload-edit-help-close" @click="showCodeHelp = false">
            <u-icon name="close" size="36" color="#999" />
          </view>
        </view>
        <scroll-view scroll-y class="bill-upload-edit-help-body">
          <text class="bill-upload-edit-help-text">代码用于判断账单导入的类型</text>
          <text class="bill-upload-edit-help-text">isAssignment必须在开头，并且为boolean类型。</text>
          <text class="bill-upload-edit-help-text">item为账单的一条数据，其中的字段为：</text>
          <view v-for="field in codeFields" :key="field.key" class="bill-upload-edit-help-field">
            <text class="bill-upload-edit-help-field-key">{{ field.key }}</text>
            <text class="bill-upload-edit-help-field-label">: {{ field.label }}</text>
          </view>
        </scroll-view>
      </view>
    </u-popup>

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
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
  const showCodeHelp = ref(false);
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

  const scrollTopOffset = ref(0);
  const scrollStyle = computed(() => {
    const offset = scrollTopOffset.value;
    if (offset > 0) {
      return { height: `calc(100vh - ${offset}px)` };
    }
    return {};
  });

  const billUploadTypeLabel = computed(() => billUploadTypeList.find((r) => r.value === form.billUploadType)?.label || '');
  const handleTypeLabel = computed(() => handleTypeList.find((r) => r.value === form.handleType)?.label || '');
  const inflowLabel = computed(() => inflowOrOutflowList.find((r) => r.value === form.inflowOrOutflow)?.label || '');
  const billTypeLabel = computed(() => billTypeSelectList.value.find((r) => r.value === form.billType)?.label || '');
  const billMethodLabel = computed(() => billMethodSelectList.value.find((r) => r.value === form.billMethod)?.label || '');

  const codeFields = computed(() => {
    if (form.billUploadType === weChatBillUploadType) {
      return weChatUploadFields;
    } else if (form.billUploadType === aliPayBillUploadType) {
      return aliPayUploadFields;
    } else if (form.billUploadType === bankBillUploadType) {
      return bankUploadFields;
    }
    return [];
  });

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
      if (form.handleType === 'inflowOrOutflow' && form.inflowOrOutflow) {
        data.inflowOrOutflow = form.inflowOrOutflow;
      }
      if (form.handleType === 'billType' && form.billType) {
        data.billType = form.billType;
      }
      if (form.handleType === 'billMethod' && form.billMethod) {
        data.billMethod = form.billMethod;
      }
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

  function calcScrollHeight() {
    try {
      const sysInfo = uni.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 0;
      const navBarHeight = 44;
      const bottomBtnHeight = 50;
      scrollTopOffset.value = statusBarHeight + navBarHeight + bottomBtnHeight;
    } catch {
      scrollTopOffset.value = 0;
    }
  }

  onMounted(() => {
    calcScrollHeight();
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
  .bill-upload-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .bill-upload-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
  }

  .bill-upload-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
  }

  .bill-upload-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .bill-upload-edit-code-label {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 8rpx;
  }

  .bill-upload-edit-info {
    display: flex;
    align-items: center;
  }

  .bill-upload-edit-help {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;
    overflow: hidden;
  }

  .bill-upload-edit-help-header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 32rpx 30rpx 16rpx;
  }

  .bill-upload-edit-help-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;
  }

  .bill-upload-edit-help-close {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f5f5f5;
  }

  .bill-upload-edit-help-body {
    flex: 1;
    height: 0;
    padding: 0 30rpx 30rpx;
  }

  .bill-upload-edit-help-text {
    display: block;
    font-size: 28rpx;
    color: $uni-text-color;
    margin-bottom: 12rpx;
  }

  .bill-upload-edit-help-field {
    display: flex;
    margin-bottom: 8rpx;
  }

  .bill-upload-edit-help-field-key {
    font-size: 28rpx;
    color: #ff5b5b;
  }

  .bill-upload-edit-help-field-label {
    font-size: 28rpx;
    color: $uni-text-color;
  }
</style>
