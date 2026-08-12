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
            <text class="article-edit-label">标题</text>
            <u-input v-model="form.title" placeholder="请输入文章标题" border clearable :cursor-spacing="20" />
          </view>
          <view class="article-edit-field">
            <text class="article-edit-label">简介</text>
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
            <text class="article-edit-label">分类</text>
            <view class="article-edit-field-value">
              <text :class="{ 'article-edit-placeholder': !categoryLabel }">
                {{ categoryLabel || '请选择分类' }}
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
      <view class="article-edit-card">
        <view class="article-edit-section-header">
          <u-icon name="file-text" size="36rpx" color="#007aff" />
          <text class="article-edit-section-title">文章内容</text>
        </view>
        <view class="article-edit-form">
          <!-- 上传按钮 / 已有文件展示 -->
          <view class="article-edit-md-upload" @click="chooseMdFile">
            <u-icon name="upload" size="36rpx" color="#007aff" />
            <text>{{ mdFileName || (form.markdownContent ? '已有内容（点击替换）' : '上传 MD 文件') }}</text>
            <u-icon v-if="mdFileName" name="close" size="32rpx" color="#999" @click.stop="clearMdContent" />
          </view>

          <!-- 上传进度 -->
          <u-line-progress v-if="uploading" :percent="uploadProg" active-color="#007aff" />
          <text v-if="uploading" class="article-edit-md-progress-text">解析中...</text>

          <!-- 预览区域 -->
          <view v-if="previewHtml" class="article-edit-md-preview">
            <!-- #ifdef H5 -->
            <view class="article-edit-md-preview-content" v-html="previewHtml" />
            <!-- #endif -->
            <!-- #ifndef H5 -->
            <mp-html :content="previewHtml" :css="previewCss" />
            <!-- #endif -->
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
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { setRefreshFlag } from '../../../composables/useRefreshFlag';
  import { onLoad } from '@dcloudio/uni-app';
  import { articleAPi } from '../../../api';
  import { useApiTypeStore, useUserStore } from '../../../store';
  import { UploadMdResult } from '/#/api';

  // ---------- 强化样式：彻底解决代码块横向滚动问题 ----------
  const HLJS_CSS = `
/* 高亮样式 */
.hljs { display: block; overflow-x: auto; padding: 0.5em; color: #333; background: #f8f8f8; }
.hljs-comment, .hljs-quote { color: #998; font-style: italic; }
.hljs-keyword, .hljs-selector-tag, .hljs-subst { color: #333; font-weight: bold; }
.hljs-number, .hljs-literal, .hljs-variable, .hljs-template-variable, .hljs-tag .hljs-attr { color: #008080; }
.hljs-string, .hljs-doctag { color: #d14; }
.hljs-title, .hljs-section, .hljs-selector-id { color: #900; font-weight: bold; }
.hljs-subst { font-weight: normal; }
.hljs-type, .hljs-class .hljs-title { color: #458; font-weight: bold; }
.hljs-tag, .hljs-name, .hljs-attribute { color: #000080; font-weight: normal; }
.hljs-regexp, .hljs-link { color: #009926; }
.hljs-symbol, .hljs-bullet { color: #990073; }
.hljs-built_in, .hljs-builtin-name { color: #0086b3; }
.hljs-meta { color: #999; font-weight: bold; }
.hljs-deletion { background: #fdd; }
.hljs-addition { background: #dfd; }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: bold; }

/* 禁止全局横向滚动（覆盖所有父容器） */
.article-detail,
.article-detail-scroll,
.article-detail-content,
page,
view,
.mp-html,
.rich-text,
.article-detail-scroll > view {
  overflow-x: hidden !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* 代码块内部横向滚动（强力覆盖 mp-html 内部所有可能的结构） */
pre,
code,
pre code,
.hljs,
.code-block,
.mp-html pre,
.mp-html code,
.mp-html pre code,
.article-detail-content pre,
.article-detail-content code,
.article-detail-content pre code {
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch !important;
  white-space: pre !important;
  word-break: normal !important;
  max-width: 100% !important;
  display: block !important;
}

/* 针对行内代码不滚动（仅块级代码滚动） */
code:not(pre code) {
  overflow-x: visible !important;
  white-space: normal !important;
}

/* 表格处理 */
table {
  display: block !important;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch !important;
  max-width: 100% !important;
}
table td, table th {
  white-space: nowrap;
}

/* 图片自适应 */
img {
  max-width: 100% !important;
  height: auto !important;
}

.md-editor { height: 100%; }
`;

  const userStore = useUserStore();

  const apiTypeStore = useApiTypeStore();
  const loading = ref(false);
  const editId = ref('');
  const showCategory = ref(false);

  // 新增状态
  const mdFileName = ref('');
  const uploading = ref(false);
  const uploadProg = ref(0);

  // 预览 computed（与 article-detail 的 processedHtml 结构一致）
  const previewHtml = computed(() => {
    if (!form.htmlContent) return '';
    return `<div class="md-editor"><div class="md-editor-preview"><article class="default-theme">${form.htmlContent}</article></div></div>`;
  });
  const previewCss = computed(() => (form.cssContent || '') + HLJS_CSS);

  const form = reactive({
    title: '',
    brief: '',
    categoryVal: null as number | null,
    isPrivate: false,
    markdownContent: '',
    htmlContent: '', // 新增字段，保存原始的 HTML 内容
    cssContent: '',
  });

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
    // console.log('选择了分类：', JSON.stringify(e));
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
    if (!form.markdownContent.trim()) {
      uni.showToast({ title: '请上传文章内容（MD 文件）', icon: 'none' });
      return false;
    }

    // 不再校验内容，因为内容不可编辑
    return true;
  }

  async function loadArticle(id: string) {
    try {
      const article = await articleAPi.getDetails(id);
      if (article) {
        form.title = article.title;
        form.brief = article.brief;
        form.categoryVal = article.categoryVal;
        form.isPrivate = article.isPrivate;
        // form.markdownContent = article.markdownContent;
        // form.htmlContent = article.htmlContent || ''; // 保存原始的 htmlContent
        // form.cssContent = article.cssContent;
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
        xhr.setRequestHeader('css-name', 'default');
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
  async function handleMdUpload(filePath: string) {
    uploading.value = true;
    try {
      const result = await articleAPi.uploadMd(filePath);
      const name = filePath.split('/').pop() || 'content.md';
      setMdContent(result, name);
    } catch (e: any) {
      uni.showToast({ title: e.message || '上传失败', icon: 'none' });
    } finally {
      uploading.value = false;
    }
  }

  function setMdContent(result: UploadMdResult, fileName: string) {
    form.markdownContent = result.markdownContent;
    form.htmlContent = result.htmlContent;
    form.cssContent = result.cssContent || '';
    mdFileName.value = fileName;
  }

  function clearMdContent() {
    form.markdownContent = '';
    form.htmlContent = '';
    form.cssContent = '';
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
        if (res.tempFiles?.[0]) handleMdUpload(res.tempFiles[0].path);
      },
    });
    // #endif

    // #ifndef H5 || MP-WEIXIN
    uni.chooseFile({
      count: 1,
      extension: ['.md', '.markdown', '.txt'],
      success: (res) => {
        const path = Array.isArray(res.tempFiles) ? (res.tempFiles[0] as any)?.path : res.tempFilePaths?.[0];
        if (path) handleMdUpload(path);
      },
    });
    // #endif
  }

  async function handleSave() {
    if (!validate()) return;

    loading.value = true;
    try {
      const data = {
        title: form.title.trim(),
        brief: form.brief.trim(),
        categoryVal: form.categoryVal as number,
        cssName: 'default',
        markdownContent: form.markdownContent, // 原样保存
        isPrivate: form.isPrivate,
      };
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
    await apiTypeStore.getArticleCategory();
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

  .article-edit-label {
    display: block;
    font-size: 26rpx;
    color: $uni-text-color;
    font-weight: 500;
    margin-bottom: 12rpx;
    flex-shrink: 0;
    width: 100rpx;
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

  .article-edit-md-upload {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 24rpx;
    background-color: #f5f8ff;
    border-radius: 12rpx;
    border: 2rpx dashed #d0d9f0;
  }
  .article-edit-md-progress-text {
    font-size: 22rpx;
    color: $uni-text-color-grey;
    margin-top: 8rpx;
    display: block;
  }
  .article-edit-md-preview {
    margin-top: 20rpx;
    border: 1rpx solid #eee;
    border-radius: 12rpx;
    overflow: hidden;
  }
  .article-edit-md-preview-content {
    padding: 24rpx;
    max-height: 600rpx;
    overflow-y: auto;
  }
</style>
