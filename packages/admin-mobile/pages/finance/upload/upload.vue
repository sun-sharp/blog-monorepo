<template>
  <view class="upload-page">
    <scroll-view scroll-y class="upload-scroll">
      <view class="upload-section card">
        <text class="upload-section-title">导入账单</text>
        <text class="upload-section-desc">选择账单类型并上传对应的账单文件</text>
      </view>

      <view class="upload-types card">
        <u-radio-group v-model="uploadType" placement="column">
          <view v-for="item in uploadTypeOptions" :key="item.value" class="upload-type-item" @click="uploadType = item.value">
            <u-radio :name="item.value" :label="item.label" active-color="#007aff" />
            <text class="upload-type-desc">{{ item.desc }}</text>
          </view>
        </u-radio-group>
      </view>

      <view class="upload-action card">
        <u-button type="primary" icon="file-text" @click="chooseFile">选择文件</u-button>
        <text class="upload-tip">支持 CSV、Excel 格式文件</text>
      </view>

      <view v-if="selectedFile" class="upload-file card">
        <view class="upload-file-info">
          <u-icon name="file-text" size="40" color="#007aff" />
          <view class="upload-file-detail">
            <text class="upload-file-name">{{ selectedFile }}</text>
            <text class="upload-file-size">已选择文件</text>
          </view>
          <u-icon name="close" color="#999" @click="selectedFile = ''" />
        </view>
      </view>

      <view v-if="uploading" class="upload-progress card">
        <u-line-progress :percentage="uploadProgress" active-color="#007aff" />
        <text class="upload-progress-text">上传中 {{ uploadProgress }}%</text>
      </view>

      <view class="upload-submit">
        <u-button type="primary" :loading="uploading" :disabled="!selectedFile" @click="handleUpload">开始导入</u-button>
      </view>

      <view class="upload-help card">
        <text class="upload-help-title">使用说明</text>
        <view class="upload-help-item">
          <u-icon name="checkmark-circle" size="28" color="#4cd964" />
          <text class="upload-help-text">微信账单：导出CSV文件后上传</text>
        </view>
        <view class="upload-help-item">
          <u-icon name="checkmark-circle" size="28" color="#4cd964" />
          <text class="upload-help-text">支付宝账单：导出CSV文件后上传</text>
        </view>
        <view class="upload-help-item">
          <u-icon name="checkmark-circle" size="28" color="#4cd964" />
          <text class="upload-help-text">银行账单：导出Excel文件后上传</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const uploadType = ref(1);
  const selectedFile = ref('');
  const uploading = ref(false);
  const uploadProgress = ref(0);

  const uploadTypeOptions = [
    { value: 1, label: '微信账单', desc: '微信支付导出的账单文件' },
    { value: 2, label: '支付宝账单', desc: '支付宝导出的账单文件' },
    { value: 3, label: '银行账单', desc: '银行导出的流水文件' },
  ];

  function chooseFile() {
    // #ifdef H5
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        selectedFile.value = file.name;
      }
    };
    input.click();
    // #endif

    // #ifndef H5
    uni.chooseFile({
      count: 1,
      extension: ['.csv', '.xlsx', '.xls'],
      success: (res) => {
        const files = Array.isArray(res.tempFiles) ? res.tempFiles : [];
        if (files[0]) {
          selectedFile.value = (files[0] as any).name || '';
        }
      },
    });
    // #endif
  }

  async function handleUpload() {
    if (!selectedFile.value) return;
    uploading.value = true;
    uploadProgress.value = 0;

    const interval = setInterval(() => {
      uploadProgress.value += Math.random() * 15;
      if (uploadProgress.value >= 100) {
        uploadProgress.value = 100;
        clearInterval(interval);
        uploading.value = false;
        uni.showToast({ title: '导入成功', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 1000);
      }
    }, 300);
  }
</script>

<style lang="scss" scoped>
  .upload-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $uni-bg-color-grey;
  }

  .upload-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }

  .upload-section {
    text-align: center;
    padding: 40rpx 24rpx;
  }

  .upload-section-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    display: block;
  }

  .upload-section-desc {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 8rpx;
    display: block;
  }

  .upload-type-item {
    display: flex;
    flex-direction: column;
    padding: 16rpx 0;
    border-bottom: 1rpx solid $uni-border-color;

    &:last-child {
      border-bottom: none;
    }
  }

  .upload-type-desc {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 4rpx;
    padding-left: 48rpx;
  }

  .upload-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx 24rpx;
  }

  .upload-tip {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 12rpx;
  }

  .upload-file-info {
    display: flex;
    align-items: center;
  }

  .upload-file-detail {
    flex: 1;
    margin-left: 16rpx;
  }

  .upload-file-name {
    font-size: $uni-font-size-base;
    display: block;
  }

  .upload-file-size {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    display: block;
    margin-top: 4rpx;
  }

  .upload-progress {
    padding: 24rpx;
  }

  .upload-progress-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 12rpx;
    text-align: center;
    display: block;
  }

  .upload-submit {
    margin: 30rpx 10rpx;
  }

  .upload-help-title {
    font-size: $uni-font-size-base;
    font-weight: bold;
    display: block;
    margin-bottom: 16rpx;
  }

  .upload-help-item {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .upload-help-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-left: 12rpx;
  }
</style>
