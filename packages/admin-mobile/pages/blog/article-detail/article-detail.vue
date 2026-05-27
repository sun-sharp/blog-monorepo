<template>
  <view class="article-detail">
    <view v-if="loading" class="article-detail-loading">
      <u-loading mode="circle" size="60" />
    </view>
    <template v-else-if="article">
      <scroll-view scroll-y class="article-detail-scroll">
        <view class="article-detail-body">
          <!-- 头部信息 -->
          <view class="article-detail-header card">
            <text class="article-detail-title">{{ article.title }}</text>
            <view class="article-detail-meta">
              <view class="article-detail-meta-item">
                <u-icon name="calendar" size="22" color="#999" />
                <text class="article-detail-meta-text">{{ article.createTime?.slice(0, 10) }}</text>
              </view>
              <view class="article-detail-meta-item">
                <u-icon name="account" size="22" color="#999" />
                <text class="article-detail-meta-text">{{ article.authorNickname || '未知作者' }}</text>
              </view>
              <u-tag v-if="article.isPrivate" text="加密" type="warning" size="mini" plain />
              <u-tag v-if="categoryLabel" :text="categoryLabel" type="primary" size="mini" plain />
            </view>
            <text v-if="article.brief" class="article-detail-brief">{{ article.brief }}</text>
          </view>

          <!-- 内容区：条件编译 -->
          <!-- #ifdef H5 -->
          <div ref="vditorPreviewRef" class="article-detail-content card vditor-preview-wrapper"></div>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <view class="article-detail-content card">
            <mp-html :content="processedHtml" @imgtap="onMpHtmlImgTap" />
          </view>
          <!-- #endif -->
        </view>
      </scroll-view>

      <!-- 悬浮目录按钮 -->
      <view v-if="headings.length > 1" class="article-detail-toc-fab" @click="showTocPopup = true">
        <u-icon name="list" size="28" color="#fff" />
      </view>

      <!-- 目录侧滑弹窗 -->
      <u-popup v-model="showTocPopup" mode="right" width="70%" border-radius="20" closeable>
        <view class="article-detail-toc-popup">
          <view class="article-detail-toc-popup-header">
            <text class="article-detail-toc-popup-title">目录导航</text>
          </view>
          <scroll-view scroll-y class="article-detail-toc-popup-body">
            <view v-for="(h, i) in headings" :key="i" :class="['article-detail-toc-item', `article-detail-toc-indent-${h.level}`]" @click="onTocClick(h.id)">
              <text class="article-detail-toc-text">{{ h.text }}</text>
            </view>
          </scroll-view>
        </view>
      </u-popup>

      <!-- 底部操作栏 -->
      <view class="article-detail-footer">
        <view class="article-detail-action-btn" @click="goToEdit">
          <u-icon name="edit-pen" size="30" color="#007aff" />
          <text class="article-detail-action-text">编辑</text>
        </view>
        <view class="article-detail-action-btn article-detail-action-btn-danger" @click="handleDelete">
          <u-icon name="trash" size="30" color="#dd524d" />
          <text class="article-detail-action-text article-detail-action-text-danger">删除</text>
        </view>
      </view>
    </template>
    <view v-else class="article-detail-empty">
      <u-empty mode="data" text="文章不存在" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, nextTick, onUnmounted } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { articleAPi } from '../../../api';
  import { useApiTypeStore } from '../../../store';
  import type { ApiArticleItem } from '/#/api/blog/article';

  // 类型定义
  interface Heading {
    id: string;
    text: string;
    level: number;
  }

  // 条件导入：H5 端使用 Vditor
  // #ifdef H5
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  // #endif

  // 非 H5 端使用 mp-html
  // #ifndef H5
  import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';
  // #endif

  // ==================== 响应式数据 ====================
  const apiTypeStore = useApiTypeStore();
  const article = ref<ApiArticleItem | null>(null);
  const loading = ref(true);
  const articleId = ref('');
  const showTocPopup = ref(false);

  // Vditor 预览容器（仅 H5）
  // #ifdef H5
  const vditorPreviewRef = ref<HTMLDivElement>();
  // #endif

  // ==================== 计算属性 ====================
  // 分类标签
  const categoryLabel = computed(() => {
    if (!article.value?.categoryVal) return '';
    const opt = apiTypeStore.getArticleCategoryOption.find((item) => item.value === article.value!.categoryVal);
    return opt?.label || '';
  });

  // 原始内容（HTML 或 Markdown）
  const rawContent = computed(() => article.value?.htmlContent || article.value?.markdownContent || '');

  // 提取图片 URL（公用）
  function extractImgUrls(html: string): string[] {
    const result: string[] = [];
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      result.push(match[1]);
    }
    return result;
  }

  // ==================== 目录提取（平台通用） ====================
  const headings = computed<Heading[]>(() => {
    if (!article.value) return [];
    const html = rawContent.value;
    const result: Heading[] = [];
    const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;
    let idx = 0;
    while ((match = regex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        result.push({ id: `heading-${idx++}`, text, level });
      }
    }
    return result;
  });

  // 目录点击跳转
  function onTocClick(id: string) {
    showTocPopup.value = false;
    // H5 端和小程序端都能用 uni.pageScrollTo
    setTimeout(() => {
      uni.pageScrollTo({ selector: `#${id}`, duration: 300 });
    }, 300);
  }

  // ==================== 非 H5 端：mp-html 渲染 ====================
  // #ifndef H5
  // 增强 HTML 样式（表格、代码块、图片自适应等）
  const processedHtml = computed(() => {
    let html = rawContent.value;
    if (!html || html === '暂无内容') return '暂无内容';

    // 给标题添加 id（用于目录跳转）
    let idx = 0;
    html = html.replace(/<h([1-6])([^>]*)>/gi, (_, level, attrs) => {
      const id = `heading-${idx++}`;
      return `<h${level}${attrs} id="${id}">`;
    });

    // 表格样式增强
    html = html.replace(/<table/gi, '<table class="md-table"');
    html = html.replace(/<th\b/gi, '<th class="md-th"');
    html = html.replace(/<td\b/gi, '<td class="md-td"');
    html = html.replace(/<tr\b/gi, '<tr class="md-tr"');
    html = html.replace(/<pre/gi, '<pre class="md-pre"');
    html = html.replace(/<code/gi, '<code class="md-code"');

    // 图片自适应 + 添加点击预览标记（mp-html 默认支持预览，但需要传递 urls）
    html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
      // 提取 src
      const srcMatch = attrs.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch) return match;
      // 移除可能的宽高属性，添加 style
      let cleaned = attrs
        .replace(/\s+width\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\s+width\s*=\s*\d+/gi, '')
        .replace(/\s+height\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\s+height\s*=\s*\d+/gi, '');
      const baseStyle = 'max-width:100%!important;height:auto!important;box-sizing:border-box';
      const styleMatch = cleaned.match(/style\s*=\s*"([^"]*)"/i);
      if (styleMatch) {
        const existing = styleMatch[1].replace(/\bwidth\s*:\s*[^;]+[;"]?/gi, '').trim();
        cleaned = cleaned.replace(/style\s*=\s*"[^"]*"/i, `style="${baseStyle};${existing}"`);
      } else {
        cleaned = ` style="${baseStyle}" ${cleaned}`;
      }
      return `<img class="md-img"${cleaned} />`;
    });

    // blockquote 样式
    html = html.replace(/<blockquote/gi, '<blockquote class="md-blockquote"');

    return html;
  });

  // mp-html 图片点击事件
  function onMpHtmlImgTap(e: any) {
    const { src } = e.detail;
    const urls = extractImgUrls(rawContent.value);
    uni.previewImage({ current: src, urls });
  }
  // #endif

  // ==================== H5 端：Vditor 预览渲染 ====================
  // #ifdef H5
  async function renderWithVditor() {
    if (!vditorPreviewRef.value) return;
    const content = rawContent.value;
    if (!content || content === '暂无内容') {
      vditorPreviewRef.value.innerHTML = '<p>暂无内容</p>';
      return;
    }

    // 使用 Vditor 的预览方法，它会自动渲染 Markdown 或 HTML
    // 注意：Vditor.preview 是静态方法，不需要实例
    Vditor.preview(vditorPreviewRef.value, content, {
      mode: 'light', // 添加 mode 属性，可选 'light' 或 'dark'
      theme: { current: 'light' },
      hljs: {},
      after: () => {
        attachImagePreview();
        addHeadingIds();
      },
    });
  }

  // 为 Vditor 渲染后的标题添加 id，以便目录跳转
  function addHeadingIds() {
    if (!vditorPreviewRef.value) return;
    const headings = vditorPreviewRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((el, idx) => {
      if (!el.id) {
        el.id = `heading-${idx}`;
      }
    });
  }

  // 绑定图片点击预览事件
  function attachImagePreview() {
    if (!vditorPreviewRef.value) return;
    const imgs = vditorPreviewRef.value.querySelectorAll('img');
    imgs.forEach((img) => {
      img.removeEventListener('click', handleImageClick);
      img.addEventListener('click', handleImageClick);
    });
  }

  function handleImageClick(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    const src = img.getAttribute('src');
    if (!src) return;
    const urls = extractImgUrls(rawContent.value);
    uni.previewImage({ current: src, urls });
  }
  // #endif

  // ==================== 加载文章 ====================
  async function loadArticle(id: string) {
    loading.value = true;
    try {
      const res = await articleAPi.getDetails(id);
      article.value = res || null;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
      await nextTick();

      // 渲染内容
      // #ifdef H5
      if (article.value) {
        await renderWithVditor();
      }
      // #endif

      // 非 H5 端 mp-html 会自动渲染，无需额外处理
    }
  }

  // ==================== 操作函数 ====================
  function goToEdit() {
    uni.navigateTo({ url: `/pages/blog/article-edit/article-edit?id=${articleId.value}` });
  }

  function handleDelete() {
    uni.showModal({
      title: '确认删除',
      content: `确定删除文章「${article.value?.title}」？`,
      success: async (res) => {
        if (res.confirm) {
          await articleAPi.remove(articleId.value);
          uni.showToast({ title: '删除成功', icon: 'success' });
          setTimeout(() => uni.navigateBack(), 500);
        }
      },
    });
  }

  // ==================== 生命周期 ====================
  onLoad(async (options) => {
    await apiTypeStore.getArticleCategory();
    if (options?.id) {
      articleId.value = options.id;
      loadArticle(options.id);
    }
  });

  onUnmounted(() => {
    // H5 端清理 Vditor 预览容器（避免内存泄漏）
    // #ifdef H5
    if (vditorPreviewRef.value) {
      vditorPreviewRef.value.innerHTML = '';
    }
    // #endif
  });
</script>

<style lang="scss" scoped>
  // ========== 页面布局 ==========
  .article-detail {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;
  }

  .article-detail-scroll {
    flex: 1;
    height: 0;
  }

  .article-detail-body {
    padding: 20rpx;
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
  }

  .article-detail-loading,
  .article-detail-empty {
    display: flex;
    justify-content: center;
    padding-top: 200rpx;
  }

  // ========== 头部卡片 ==========
  .article-detail-header {
    padding: 30rpx;
  }

  .article-detail-title {
    font-size: 40rpx;
    font-weight: bold;
    display: block;
    line-height: 1.4;
  }

  .article-detail-meta {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-top: 16rpx;
    flex-wrap: wrap;
  }

  .article-detail-meta-item {
    display: flex;
    align-items: center;
    gap: 6rpx;
  }

  .article-detail-meta-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-placeholder;
  }

  .article-detail-brief {
    display: block;
    margin-top: 20rpx;
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    line-height: 1.6;
    padding-top: 16rpx;
    border-top: 1rpx solid #f0f0f0;
  }

  // ========== 内容卡片 ==========
  .article-detail-content {
    margin-top: 20rpx;
    padding: 30rpx;
    line-height: 1.8;
    font-size: $uni-font-size-base;
    overflow: hidden;
  }

  // Vditor 预览容器样式调整（H5）
  .vditor-preview-wrapper {
    :deep(.vditor-reset) {
      padding: 0 !important;
      background: transparent !important;
      font-size: inherit;
      line-height: inherit;
    }
  }

  // ========== 悬浮目录按钮 ==========
  .article-detail-toc-fab {
    position: fixed;
    right: 30rpx;
    bottom: calc(160rpx + env(safe-area-inset-bottom));
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #007aff, #0055d5);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
    z-index: 99;
  }

  // ========== 目录弹窗 ==========
  .article-detail-toc-popup {
    padding: 30rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .article-detail-toc-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }

  .article-detail-toc-popup-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .article-detail-toc-popup-body {
    flex: 1;
    height: 0;
    padding-top: 16rpx;
  }

  .article-detail-toc-item {
    padding: 14rpx 0;
  }

  .article-detail-toc-indent-1 {
    padding-left: 0;
  }
  .article-detail-toc-indent-2 {
    padding-left: 28rpx;
  }
  .article-detail-toc-indent-3 {
    padding-left: 56rpx;
  }
  .article-detail-toc-indent-4 {
    padding-left: 84rpx;
  }
  .article-detail-toc-indent-5 {
    padding-left: 112rpx;
  }
  .article-detail-toc-indent-6 {
    padding-left: 140rpx;
  }

  .article-detail-toc-text {
    font-size: $uni-font-size-sm;
    color: #007aff;
    line-height: 1.5;
  }

  // ========== 底部操作栏 ==========
  .article-detail-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40rpx;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background-color: #ffffff;
    border-top: 1rpx solid #e5e5e5;
    z-index: 100;
  }

  .article-detail-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    padding: 16rpx 40rpx;
    border-radius: 44rpx;
    min-width: 180rpx;
  }

  .article-detail-action-text {
    font-size: $uni-font-size-base;
    color: #007aff;
  }

  .article-detail-action-text-danger {
    color: #dd524d;
  }
</style>

<style lang="scss">
  // ========== 全局样式（供 mp-html 和 Vditor 共用） ==========
  // 表格样式
  .md-table {
    display: block;
    width: 100% !important;
    border-collapse: collapse;
    overflow-x: auto;
    font-size: 24rpx;
    margin: 16rpx 0;

    .md-th,
    .md-td {
      border: 1rpx solid #e5e5e5;
      padding: 12rpx 16rpx;
      text-align: left;
      word-break: break-word;
      min-width: 60rpx;
    }

    .md-th {
      background-color: #f5f7fa;
      font-weight: bold;
    }

    .md-tr:nth-child(even) {
      background-color: #fafafa;
    }
  }

  // 代码块样式
  .md-pre {
    display: block;
    width: 100% !important;
    overflow-x: auto;
    background-color: #f6f8fa;
    border-radius: 8rpx;
    padding: 20rpx;
    margin: 16rpx 0;
    font-size: 24rpx;
    line-height: 1.6;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }

  .md-code {
    font-size: 24rpx;
    word-break: break-all;
  }

  // 图片样式
  .md-img {
    max-width: 100% !important;
    height: auto !important;
    display: block;
    margin: 16rpx 0;
    border-radius: 8rpx;
    cursor: pointer;
    box-sizing: border-box;
  }

  // 引用块样式
  .md-blockquote {
    margin: 16rpx 0;
    padding: 16rpx 24rpx;
    border-left: 6rpx solid #007aff;
    background-color: #f0f7ff;
    color: #555;
  }
</style>
