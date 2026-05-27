<template>
  <view class="article-detail">
    <!-- 加载状态 -->
    <view v-if="loading" class="article-detail-loading">
      <u-loading mode="circle" size="60" />
    </view>

    <!-- 文章内容 -->
    <template v-else-if="article">
      <scroll-view ref="scrollViewRef" scroll-y class="article-detail-scroll" :scroll-top="scrollTopValue" scroll-with-animation @scroll="onArticleScroll">
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
            <mp-html ref="mpHtmlRef" :content="processedHtml" @imgtap="onMpHtmlImgTap" @ready="onMpHtmlReady" />
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
          <scroll-view scroll-y class="article-detail-toc-popup-body" :scroll-into-view="'toc-' + activeHeadingId" scroll-with-animation>
            <view
              v-for="(h, i) in headings"
              :id="'toc-' + h.id"
              :key="i"
              :class="['article-detail-toc-item', `article-detail-toc-indent-${h.level}`, { 'article-detail-toc-item-active': h.id === activeHeadingId }]"
              @click="onTocClick(h.id)">
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

    <!-- 空状态 -->
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

  // ==================== 响应式数据 ====================
  const apiTypeStore = useApiTypeStore();
  const article = ref<ApiArticleItem | null>(null);
  const loading = ref(true);
  const articleId = ref('');
  const showTocPopup = ref(false);
  const scrollTopValue = ref(0);
  const activeHeadingId = ref('');
  const currentScrollTop = ref(0); // 记录 scroll-view 当前滚动位置

  const scrollViewRef = ref<any>(null);
  const mpHtmlRef = ref<any>(null);

  // 预计算标题位置（仅非 H5 端使用）
  const headingPositions = ref<number[]>([]);

  // #ifdef H5
  const vditorPreviewRef = ref<HTMLDivElement>();
  // #endif

  // ==================== 计算属性 ====================
  const categoryLabel = computed(() => {
    if (!article.value?.categoryVal) return '';
    const opt = apiTypeStore.getArticleCategoryOption.find((item) => item.value === article.value!.categoryVal);
    return opt?.label || '';
  });

  const rawContent = computed(() => article.value?.htmlContent || article.value?.markdownContent || '');

  function extractImgUrls(html: string): string[] {
    const result: string[] = [];
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      result.push(match[1]);
    }
    return result;
  }

  // ==================== 目录提取（统一使用 heading-0, heading-1...） ====================
  const headings = computed<Heading[]>(() => {
    if (!article.value) return [];
    const html = rawContent.value;
    const result: Heading[] = [];
    const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match;
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

  // ==================== 非 H5 端：mp-html 渲染，强制设置 heading id ====================
  // #ifndef H5
  const processedHtml = computed(() => {
    let html = rawContent.value;
    if (!html || html === '暂无内容') return '暂无内容';

    let headingIdx = 0;
    html = html.replace(/<h([1-6])([^>]*)>/gi, (_, level, attrs) => {
      const cleanedAttrs = attrs.replace(/\s+id\s*=\s*["'][^"']*["']/gi, '');
      return `<h${level}${cleanedAttrs} id="heading-${headingIdx++}">`;
    });

    html = html.replace(/<table/gi, '<table class="md-table"');
    html = html.replace(/<th\b/gi, '<th class="md-th"');
    html = html.replace(/<td\b/gi, '<td class="md-td"');
    html = html.replace(/<tr\b/gi, '<tr class="md-tr"');
    html = html.replace(/<pre/gi, '<pre class="md-pre"');
    html = html.replace(/<code/gi, '<code class="md-code"');

    html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
      const srcMatch = attrs.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch) return match;
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

    html = html.replace(/<blockquote/gi, '<blockquote class="md-blockquote"');
    return html;
  });

  function onMpHtmlImgTap(e: any) {
    const { src } = e.detail;
    const urls = extractImgUrls(rawContent.value);
    uni.previewImage({ current: src, urls });
  }

  // 预计算标题位置（解决鸿蒙等端 id 选择器可能失效的问题）
  function updateHeadingPositions() {
    const query = uni.createSelectorQuery().in(mpHtmlRef.value);
    // 用标签选择器查询所有标题，避免依赖 id
    query.selectAll('h1,h2,h3,h4,h5,h6').boundingClientRect();
    query.exec((res: any) => {
      const rects = res[0] as UniApp.NodeInfo[];
      if (rects && rects.length > 0) {
        // 初始时 scrollTop 为 0，所以 rect.top 就是标题相对于内容顶部的偏移
        headingPositions.value = rects.map((r) => r.top || 0);
      } else {
        // 如果 selectAll 也失败，则无法跳转，但仍避免崩溃
        console.warn('updateHeadingPositions: 未能获取到标题节点');
      }
    });
  }

  function onMpHtmlReady() {
    // mp-html 渲染完成，计算所有标题的位置
    updateHeadingPositions();
  }
  // #endif

  // ==================== H5 端：Vditor 预览，强制设置 heading id ====================
  // #ifdef H5
  async function renderWithVditor() {
    if (!vditorPreviewRef.value) return;
    const content = rawContent.value;
    if (!content || content === '暂无内容') {
      vditorPreviewRef.value.innerHTML = '<p>暂无内容</p>';
      return;
    }

    Vditor.preview(vditorPreviewRef.value, content, {
      mode: 'light',
      theme: { current: 'light' },
      hljs: {},
      after: () => {
        forceHeadingIds();
        attachImagePreview();
      },
    });
  }

  function forceHeadingIds() {
    if (!vditorPreviewRef.value) return;
    const headingNodes = vditorPreviewRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headingNodes.forEach((el, idx) => {
      el.id = `heading-${idx}`;
    });
  }

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

  // ==================== 目录点击跳转 ====================
  function onTocClick(id: string) {
    showTocPopup.value = false;

    // #ifdef H5
    // H5 端：使用查询方式
    nextTick(() => {
      setTimeout(() => {
        const query = uni.createSelectorQuery();
        query.select(`#${id}`).boundingClientRect();
        query.exec((res: any) => {
          if (res[0]) {
            const targetTop = res[0].top;
            scrollTopValue.value = currentScrollTop.value + targetTop - 80;
          } else {
            console.warn(`H5 目录跳转失败：未找到节点 #${id}`);
          }
        });
      }, 300);
    });
    // #endif

    // #ifndef H5
    // 非 H5 端：使用预计算的位置，无需再次查询
    const idx = headings.value.findIndex((h) => h.id === id);
    if (idx !== -1 && headingPositions.value.length > idx) {
      const targetPos = headingPositions.value[idx];
      scrollTopValue.value = targetPos - 80; // 预计算的位置已经是相对于内容顶部的偏移
    } else {
      console.warn(`目录跳转失败：未找到标题 ${id} 的位置信息`);
    }
    // #endif
  }

  // ==================== 滚动监听：更新当前活动标题 ====================
  function throttle(fn: Function, delay: number) {
    let timer: any = null;
    return function (this: any, ...args: any[]) {
      if (timer) return;
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    };
  }

  const updateActiveHeading = throttle(async () => {
    let query;
    // #ifdef H5
    query = uni.createSelectorQuery();
    headings.value.forEach((h) => {
      query.select(`#${h.id}`).boundingClientRect();
    });
    // #endif
    // #ifndef H5
    // 非 H5 端：用 selectAll 查询所有标题，取它们的 top，然后匹配当前滚动位置
    query = uni.createSelectorQuery().in(mpHtmlRef.value);
    query.selectAll('h1,h2,h3,h4,h5,h6').boundingClientRect();
    // #endif

    query.exec((res: any) => {
      let rects;
      // #ifdef H5
      rects = res;
      // #endif
      // #ifndef H5
      rects = res[0] || [];
      // #endif

      let activeId = '';
      for (let i = 0; i < rects.length; i++) {
        if (rects[i] && rects[i].top > 0) {
          activeId = headings.value[i]?.id || '';
          break;
        }
      }
      if (!activeId && rects.length > 0) {
        activeId = headings.value[rects.length - 1]?.id || '';
      }
      if (activeId !== activeHeadingId.value) {
        activeHeadingId.value = activeId;
      }
    });
  }, 200);

  function onArticleScroll(e: any) {
    currentScrollTop.value = e.detail.scrollTop;
    updateActiveHeading();
  }

  // ==================== 加载文章 ====================
  async function loadArticle(id: string) {
    loading.value = true;
    // 重置位置缓存
    headingPositions.value = [];

    try {
      const res = await articleAPi.getDetails(id);
      article.value = res || null;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
      await nextTick();

      // #ifdef H5
      if (article.value) {
        await renderWithVditor();
      }
      // #endif
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
  onLoad(async (options: any) => {
    await apiTypeStore.getArticleCategory();
    if (options?.id) {
      articleId.value = options.id;
      loadArticle(options.id);
    }
  });

  onUnmounted(() => {
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
    border-radius: 8rpx;
    transition: background 0.2s;
  }

  .article-detail-toc-item-active {
    background-color: #f0f7ff;
    .article-detail-toc-text {
      color: #0055d5;
      font-weight: bold;
    }
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
  // ========== 全局样式：纯 CSS 代码块美化（无 JS 高亮） ==========
  .md-pre {
    display: block;
    width: 100% !important;
    overflow-x: auto;
    background: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: 12rpx;
    padding: 24rpx;
    margin: 20rpx 0;
    font-size: 24rpx;
    line-height: 1.6;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    position: relative;

    &::before {
      content: '';
      display: block;
      height: 12rpx;
      margin-bottom: 16rpx;
      background:
        radial-gradient(circle at 8rpx 50%, #ccc 1.5rpx, transparent 2rpx), radial-gradient(circle at 24rpx 50%, #ccc 1.5rpx, transparent 2rpx),
        radial-gradient(circle at 40rpx 50%, #ccc 1.5rpx, transparent 2rpx);
    }
  }

  .md-code {
    font-family: 'Menlo', 'Consolas', 'Courier New', monospace;
    color: #24292e;
    white-space: pre;
    word-break: normal;
    word-wrap: normal;
  }

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
