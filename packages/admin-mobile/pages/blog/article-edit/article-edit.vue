<template>
  <view class="article-edit-page">
    <scroll-view scroll-y class="article-edit-scroll">
      <!-- 基本信息 -->
      <view class="article-edit-card">
        <view class="article-edit-section-header">
          <u-icon name="file-text" size="36rpx" color="#007aff" />
          <text class="article-edit-section-title">基本信息</text>
        </view>
        <view class="article-edit-form">
          <view class="article-edit-field">
            <view class="article-edit-label-wrap">
              <text class="article-edit-required">*</text>
              <text class="article-edit-label">标题</text>
            </view>
            <u-input v-model="form.title" placeholder="请输入文章标题" border clearable :cursor-spacing="20" />
          </view>
          <view class="article-edit-field">
            <view class="article-edit-label-wrap">
              <text class="article-edit-required">*</text>
              <text class="article-edit-label">简介</text>
            </view>
            <u-textarea v-model="form.brief" placeholder="用一段话简短介绍这篇文章..." :maxlength="300" count auto-height :cursor-spacing="20" />
          </view>
        </view>
      </view>

      <!-- 文章设置 -->
      <view class="article-edit-card">
        <view class="article-edit-section-header">
          <u-icon name="setting" size="36rpx" color="#007aff" />
          <text class="article-edit-section-title">文章设置</text>
        </view>
        <view class="article-edit-form">
          <view class="article-edit-field article-edit-field-row" @click="showCategory = true">
            <view class="article-edit-label-wrap">
              <text class="article-edit-required">*</text>
              <text class="article-edit-label">分类</text>
            </view>
            <view class="article-edit-field-value">
              <text :class="{ 'article-edit-placeholder': !categoryLabel }">
                {{ categoryLabel || '请选择分类' }}
              </text>
              <u-icon name="arrow-right" size="32rpx" color="#c0c4cc" />
            </view>
          </view>
          <view class="article-edit-field article-edit-field-row" @click="showCssName = true">
            <view class="article-edit-label-wrap">
              <text class="article-edit-required">*</text>
              <text class="article-edit-label">文章css名称</text>
            </view>
            <view class="article-edit-field-value">
              <text :class="{ 'article-edit-placeholder': !cssNameLabel }">
                {{ cssNameLabel || '请选择css名称' }}
              </text>
              <u-icon name="arrow-right" size="32rpx" color="#c0c4cc" />
            </view>
          </view>
          <view class="article-edit-field article-edit-field-row">
            <text class="article-edit-label">加密</text>
            <view class="article-edit-field-value">
              <text v-if="form.isPrivate" class="article-edit-tip">开启后仅自己可见</text>
              <u-switch v-model="form.isPrivate" active-color="#f0ad4e" />
            </view>
          </view>
        </view>
      </view>

      <!-- 文章内容 -->
      <view v-if="showMdSection" class="article-edit-card">
        <view class="article-edit-section-header">
          <u-icon name="file-text" size="36rpx" color="#007aff" />
          <text class="article-edit-section-title">文章内容</text>
        </view>
        <view class="article-edit-form">
          <!-- 选择文件 -->
          <view class="upload-action">
            <u-button type="primary" icon="file-text" :disabled="uploading" @click="chooseMdFile">选择文件</u-button>
            <text class="upload-tip">支持 .md、.markdown、.txt 格式文件</text>
          </view>

          <!-- 已选文件展示（账单上传样式） -->
          <view v-if="mdFileName" class="upload-file">
            <view class="upload-file-info">
              <u-icon name="file-text" size="40" color="#007aff" />
              <view class="upload-file-detail">
                <text class="upload-file-name">{{ mdFileName }}</text>
                <text class="upload-file-size">已选择文件</text>
              </view>
              <u-icon name="close" color="#999" @click.stop="clearMdContent" />
            </view>
          </view>

          <!-- 上传进度 -->
          <view v-if="uploading" class="upload-progress">
            <u-line-progress :percent="uploadProg" active-color="#007aff" />
            <text class="upload-progress-text">解析中...</text>
          </view>

          <!-- 预览按钮 -->
          <view v-if="hasMdContent && !uploading" class="preview-action">
            <u-button type="primary" plain icon="eye" @click="handlePreviewMd">预览</u-button>
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="article-edit-footer">
        <view class="article-edit-save-btn" @click="handleSave">
          <u-loading v-if="loading" mode="circle" size="32rpx" color="#fff" />
          <u-icon v-else name="checkmark-circle" size="36rpx" color="#fff" />
          <text class="article-edit-save-text">{{ loading ? '保存中...' : '保存文章' }}</text>
        </view>
      </view>

      <u-picker
        v-model="showCategory"
        mode="selector"
        :default-selector="categoryDefault"
        :preserve-selection="false"
        :range="categoryRange"
        range-key="label"
        @confirm="onCategoryConfirm" />

      <u-picker
        v-model="showCssName"
        mode="selector"
        :default-selector="cssNameDefault"
        :preserve-selection="false"
        :range="cssNameRange"
        range-key="label"
        @confirm="onCssNameConfirm" />
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { setRefreshFlag } from '../../../composables/useRefreshFlag';
  import { onLoad } from '@dcloudio/uni-app';
  import { articleAPi, articleCssApi } from '../../../api';
  import { useApiTypeStore, useUserStore } from '../../../store';
  import { UploadMdResult } from '/#/api';

  const userStore = useUserStore();

  const apiTypeStore = useApiTypeStore();
  const loading = ref(false);
  const editId = ref('');
  const showCategory = ref(false);
  const showCssName = ref(false);

  // 新增状态
  const mdFileName = ref('');
  const uploading = ref(false);
  const uploadProg = ref(0);

  // 是否展示 MD 上传区块（小程序端不支持 web-view 预览，去掉该功能）
  const showMdSection = computed(() => {
    let show = true;
    // #ifdef MP-WEIXIN
    show = false;
    // #endif
    return show;
  });

  // 是否有可预览的内容
  const hasMdContent = computed(() => !!form.markdownContent.trim());

  const form = reactive({
    title: '',
    brief: '',
    categoryVal: null as number | null,
    cssName: 'default',
    isPrivate: false,
    markdownContent: '',
  });

  // css 名称选项
  const cssNameRange = ref<{ label: string; value: string }[]>([]);
  const cssNameDefault = computed(() => {
    const idx = cssNameRange.value.findIndex((item) => item.value === form.cssName);
    return idx >= 0 ? [idx] : [0];
  });
  const cssNameLabel = computed(() => cssNameRange.value.find((item) => item.value === form.cssName)?.label || '');

  async function loadCssNameOptions() {
    try {
      const res = await articleCssApi.list();
      const list = Array.isArray(res) && res.length > 0 ? res : [{ name: 'default' }];
      cssNameRange.value = list.map((item) => ({ label: item.name, value: item.name }));
      if (!cssNameRange.value.find((item) => item.value === form.cssName) && cssNameRange.value[0]) {
        form.cssName = cssNameRange.value[0].value;
      }
    } catch {
      cssNameRange.value = [{ label: 'default', value: 'default' }];
    }
  }

  function onCssNameConfirm(e: Array<number>) {
    const idx = e[0];
    form.cssName = cssNameRange.value[idx]?.value || 'default';
  }

  const categoryRange = computed(() =>
    apiTypeStore.getArticleCategoryOption.map((item) => ({
      label: item.label,
      value: item.value,
    }))
  );

  const categoryDefault = computed(() => {
    if (form.categoryVal == null) return [0];
    const idx = categoryRange.value.findIndex((item) => item.value === form.categoryVal);
    return idx >= 0 ? [idx] : [0];
  });

  const categoryLabel = computed(() => {
    if (form.categoryVal == null) return '';
    const opt = categoryRange.value.find((item) => item.value === form.categoryVal);
    return opt?.label || '';
  });

  function onCategoryConfirm(e: Array<number>) {
    const idx = e[0];
    form.categoryVal = typeof idx === 'number' ? categoryRange.value[idx].value : null;
  }

  function validate(): boolean {
    if (!form.title.trim()) {
      uni.showToast({ title: '请输入文章标题', icon: 'none' });
      return false;
    }
    if (!form.brief.trim()) {
      uni.showToast({ title: '请输入文章简介', icon: 'none' });
      return false;
    }
    if (form.categoryVal == null) {
      uni.showToast({ title: '请选择文章分类', icon: 'none' });
      return false;
    }
    if (!form.cssName.trim()) {
      uni.showToast({ title: '请选择文章css名称', icon: 'none' });
      return false;
    }
    // 小程序端不校验 MD 内容（不支持上传）
    let needMdCheck = true;
    // #ifdef MP-WEIXIN
    needMdCheck = false;
    // #endif
    if (needMdCheck && !form.markdownContent.trim()) {
      uni.showToast({ title: '请上传文章内容（MD 文件）', icon: 'none' });
      return false;
    }

    return true;
  }

  async function loadArticle(id: string) {
    try {
      const article = await articleAPi.getDetails(id);
      if (article) {
        form.title = article.title;
        form.brief = article.brief;
        form.categoryVal = article.categoryVal;
        form.cssName = article.cssName || 'default';
        form.isPrivate = article.isPrivate;
        form.markdownContent = article.markdownContent || '';
        mdFileName.value = '';
      }
    } catch (e) {
      console.error(e);
    }
  }

  // H5 专用：XHR + FormData 上传
  async function uploadH5(file: File) {
    uploading.value = true;
    const formData = new FormData();
    formData.append('file', file);
    const token = userStore.getToken;
    const authHead = import.meta.env.VITE_AUTHORIZATION_HEAD || 'Bearer ';
    const BLOG_API_URL = import.meta.env.VITE_BLOG_API_URL || '/blog-api';
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${BLOG_API_URL}/article/upload_md`);
        xhr.setRequestHeader('Authorization', authHead + token);
        xhr.setRequestHeader('css-name', form.cssName || 'default');
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.code === 0) resolve(data.result);
            else reject(new Error(data.message));
          } catch {
            reject(new Error('解析失败'));
          }
        };
        xhr.onerror = () => reject(new Error('网络错误'));
        xhr.send(formData);
      });
      setMdContent(result, file.name);
    } catch (e: any) {
      uni.showToast({ title: e.message || '上传失败', icon: 'none' });
    } finally {
      uploading.value = false;
    }
  }

  // 非 H5 上传
  async function handleMdUpload(filePath: string, fileName?: string) {
    uploading.value = true;
    try {
      const result = await articleAPi.uploadMd(filePath);
      const name = normalizeFileName(fileName, filePath);
      setMdContent(result, name);
    } catch (e: any) {
      uni.showToast({ title: e.message || '上传失败', icon: 'none' });
    } finally {
      uploading.value = false;
    }
  }

  // 处理 app/鸿蒙等端返回的中文文件名乱码：
  // 取路径最后一段，并解码 URL 编码的命名
  function normalizeFileName(fileName?: string, filePath?: string): string {
    let name = (fileName || filePath || 'content.md').trim();
    // 取最后的 basename（兼容返回完整路径的情况）
    const slashParts = name.split(/[\\/]/);
    name = slashParts[slashParts.length - 1] || name;
    try {
      if (/%[0-9A-Fa-f]{2}/.test(name)) {
        name = decodeURIComponent(name);
      }
    } catch {
      // 解码失败保持原样
    }
    return name || 'content.md';
  }

  function setMdContent(result: UploadMdResult, fileName: string) {
    form.markdownContent = result.markdownContent;
    mdFileName.value = fileName;
  }

  function clearMdContent() {
    form.markdownContent = '';
    mdFileName.value = '';
  }

  // 全端文件选择
  function chooseMdFile() {
    // #ifdef H5
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      await uploadH5(file);
    };
    input.click();
    // #endif

    // #ifdef MP-WEIXIN
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['.md', '.markdown', '.txt'],
      success: (res) => {
        const temp = res.tempFiles?.[0] as any;
        if (temp) handleMdUpload(temp.path, temp.name);
      },
    });
    // #endif

    // #ifndef H5 || MP-WEIXIN
    uni.chooseFile({
      count: 1,
      extension: ['.md', '.markdown', '.txt'],
      success: (res) => {
        const temp: any = Array.isArray(res.tempFiles) ? res.tempFiles[0] : null;
        const path = temp?.path ?? res.tempFilePaths?.[0];
        if (path) handleMdUpload(path, temp?.name);
      },
    });
    // #endif
  }

  // 预览：将当前 md 内容走临时预览接口渲染（与详情内容预览同一 web-view 页面）
  async function handlePreviewMd() {
    if (!form.markdownContent.trim()) {
      uni.showToast({ title: '请先上传文章内容', icon: 'none' });
      return;
    }
    uni.showLoading({ title: '生成预览中...', mask: true });
    try {
      const res = await articleAPi.previewTemp({ markdownContent: form.markdownContent, cssName: form.cssName || 'default' });
      if (res?.previewId) {
        uni.navigateTo({ url: `/pages/blog/web/full?pid=${res.previewId}` });
      } else {
        uni.showToast({ title: '生成预览失败', icon: 'none' });
      }
    } catch (e: any) {
      uni.showToast({ title: e.message || '生成预览失败', icon: 'none' });
    } finally {
      uni.hideLoading();
    }
  }

  async function handleSave() {
    if (!validate()) return;

    loading.value = true;
    try {
      const data: any = {
        title: form.title.trim(),
        brief: form.brief.trim(),
        categoryVal: form.categoryVal as number,
        cssName: form.cssName || 'default',
        isPrivate: form.isPrivate,
      };
      // 仅在非空时携带 md，避免编辑时清空库内容
      if (form.markdownContent.trim()) {
        data.markdownContent = form.markdownContent;
      }
      if (editId.value) {
        await articleAPi.update({ ...data, articleId: editId.value });
      } else {
        await articleAPi.save(data);
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        setRefreshFlag('article');
        uni.navigateBack();
      }, 500);
    } finally {
      loading.value = false;
    }
  }

  onLoad(async (options) => {
    await Promise.all([apiTypeStore.getArticleCategory(), loadCssNameOptions()]);
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑文章' });
      loadArticle(options.id);
    } else {
      uni.setNavigationBarTitle({ title: '新建文章' });
    }
  });
</script>

<style lang="scss" scoped>
  .article-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .article-edit-scroll {
    flex: 1;
    width: 100%;
    height: 0;
    padding: 20rpx;
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .article-edit-card {
    background-color: $uni-bg-color;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }

  .article-edit-section-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding-bottom: 24rpx;
    margin-bottom: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }

  .article-edit-section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: $uni-text-color;
  }

  .article-edit-form {
    display: flex;
    flex-direction: column;
  }

  .article-edit-field {
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .article-edit-label-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .article-edit-required {
    color: #ff3b30;
    font-size: 26rpx;
    margin-right: 4rpx;
  }

  .article-edit-label {
    display: block;
    font-size: 26rpx;
    color: $uni-text-color;
    font-weight: 500;
    flex-shrink: 0;
  }

  .article-edit-field-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    margin-bottom: 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .article-edit-label-wrap {
      margin-bottom: 0;
    }

    .article-edit-label {
      margin-bottom: 0;
    }
  }

  .article-edit-field-value {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 26rpx;
    color: $uni-text-color;
  }

  .article-edit-placeholder {
    color: $uni-text-color-placeholder;
  }

  .article-edit-tip {
    font-size: 22rpx;
    color: $uni-text-color-grey;
  }

  .article-edit-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background-color: $uni-bg-color;
    border-top: 1rpx solid #e5e5e5;
    z-index: 100;
  }

  .article-edit-save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    width: 100%;
    max-width: 600rpx;
    height: 88rpx;
    border-radius: 44rpx;
    background: linear-gradient(135deg, #007aff, #0055d5);
    box-shadow: 0 6rpx 20rpx rgba(0, 122, 255, 0.3);
  }

  .article-edit-save-text {
    font-size: 30rpx;
    font-weight: 600;
    color: #fff;
  }

  .upload-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx 0 20rpx;
  }

  .upload-tip {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 16rpx;
  }

  .upload-file {
    padding: 24rpx;
    margin-bottom: 20rpx;
    background-color: $uni-bg-color;
    border-radius: 16rpx;
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
    padding: 10rpx 0 20rpx;
  }

  .upload-progress-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 12rpx;
    text-align: center;
    display: block;
  }

  .preview-action {
    margin-top: 10rpx;
  }
</style>
