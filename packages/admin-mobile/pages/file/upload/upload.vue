<template>
  <view class="image-upload-page">
    <view class="upload-area card" @click="chooseImages">
      <u-icon name="camera" size="64" color="#ccc" />
      <text class="upload-area-text">点击选择图片</text>
      <text class="upload-area-tip">支持 JPG、PNG、GIF 格式，最多9张</text>
    </view>

    <view v-if="previewList.length > 0" class="preview-section">
      <text class="preview-title">已选择 ({{ previewList.length }}/9)</text>
      <view class="preview-grid">
        <view v-for="(item, index) in previewList" :key="index" class="preview-item">
          <u-image :src="item" width="100%" height="200rpx" mode="aspectFill" :fade="true" />
          <view class="preview-remove" @click="removeImage(index)">
            <u-icon name="close" size="24" color="#fff" />
          </view>
        </view>
      </view>
    </view>

    <view class="upload-options card">
      <u-form label-position="top">
        <u-form-item label="图片来源">
          <u-select v-model="source" :list="sourceList" placeholder="请选择来源" />
        </u-form-item>
      </u-form>
    </view>

    <view v-if="previewList.length > 0" class="upload-submit">
      <u-button type="primary" shape="circle" :loading="uploading" @click="handleUpload">开始上传 ({{ previewList.length }}张)</u-button>
    </view>

    <view v-if="uploading" class="upload-progress card">
      <u-line-progress :percentage="uploadProgress" active-color="#007aff" />
      <text class="upload-progress-text">上传中 {{ uploadProgress }}%</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { imageApi } from '../../../api';
  import { useApiTypeStore } from '../../../store';

  const apiTypeStore = useApiTypeStore();
  const previewList = ref<string[]>([]);
  const source = ref('');
  const sourceList = ref<{ label: string; value: string }[]>([]);
  const uploading = ref(false);
  const uploadProgress = ref(0);

  function chooseImages() {
    const remain = 9 - previewList.value.length;
    if (remain <= 0) {
      uni.showToast({ title: '最多选择9张图片', icon: 'none' });
      return;
    }
    uni.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        previewList.value = [...previewList.value, ...res.tempFilePaths];
      },
    });
  }

  function removeImage(index: number) {
    previewList.value.splice(index, 1);
  }

  async function handleUpload() {
    if (previewList.value.length === 0) return;
    uploading.value = true;
    uploadProgress.value = 0;

    const total = previewList.value.length;
    let uploaded = 0;

    for (const filePath of previewList.value) {
      try {
        await imageApi.upload(filePath, source.value || undefined);
        uploaded++;
        uploadProgress.value = Math.round((uploaded / total) * 100);
      } catch (e) {
        console.error(e);
      }
    }

    uploading.value = false;
    if (uploaded === total) {
      uni.showToast({ title: '全部上传成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 1000);
    } else {
      uni.showToast({ title: `成功${uploaded}/${total}张`, icon: 'none' });
    }
  }

  onMounted(async () => {
    await apiTypeStore.getImageSource();
    sourceList.value = apiTypeStore.getImageSourceOption.map((o) => ({ label: o.label, value: o.value }));
  });
</script>

<style lang="scss" scoped>
  .image-upload-page {
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }

  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60rpx 24rpx;
    border: 2rpx dashed $uni-border-color;
    background-color: $uni-bg-color-grey;
  }

  .upload-area-text {
    font-size: $uni-font-size-lg;
    color: $uni-text-color-grey;
    margin-top: 20rpx;
  }

  .upload-area-tip {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-placeholder;
    margin-top: 8rpx;
  }

  .preview-section {
    margin-top: 20rpx;
  }

  .preview-title {
    font-size: $uni-font-size-base;
    font-weight: bold;
    padding: 0 10rpx;
    display: block;
    margin-bottom: 12rpx;
  }

  .preview-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    padding: 0 10rpx;
  }

  .preview-item {
    width: calc(33.33% - 8rpx);
    position: relative;
    border-radius: $uni-border-radius-base;
    overflow: hidden;
  }

  .preview-remove {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 40rpx;
    height: 40rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload-submit {
    margin-top: 30rpx;
    padding: 0 10rpx;
  }

  .upload-progress {
    margin-top: 20rpx;
    padding: 24rpx;
  }

  .upload-progress-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 12rpx;
    text-align: center;
    display: block;
  }
</style>
