<template>
  <view class="article-detail">
    <view v-if="loading" class="article-detail-loading">
      <u-loading mode="circle" size="60" />
    </view>
    <template v-else-if="article">
      <scroll-view scroll-y class="article-detail-scroll">
        <view class="article-detail-body">
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

          <view ref="contentRef" class="article-detail-content card">
            <view class="article-detail-html" v-html="processedContent" />
          </view>
        </view>
      </scroll-view>

      <view v-if="headings.length > 1" class="article-detail-toc-fab" @click="showTocPopup = true">
        <u-icon name="list" size="28rpx" color="#fff" />
      </view>

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

  interface Heading {
    id: string;
    text: string;
    level: number;
  }

  const apiTypeStore = useApiTypeStore();
  const article = ref<ApiArticleItem | null>(null);
  const loading = ref(true);
  const articleId = ref('');
  const showTocPopup = ref(false);

  function extractImgUrls(html: string): string[] {
    const result: string[] = [];
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      result.push(match[1]);
    }
    return result;
  }

  function handleImgClick(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    const src = img.getAttribute('src');
    if (!src) return;
    const html = article.value?.htmlContent || article.value?.markdownContent || '';
    const urls = extractImgUrls(html);
    uni.previewImage({ current: src, urls });
  }

  function attachImageListeners() {
    const container = document.querySelector('.article-detail-content');
    if (!container) return;
    const imgs = container.querySelectorAll('img');
    imgs.forEach((img) => {
      img.addEventListener('click', handleImgClick);
    });
  }

  function removeImageListeners() {
    const container = document.querySelector('.article-detail-content');
    if (!container) return;
    const imgs = container.querySelectorAll('img');
    imgs.forEach((img) => {
      img.removeEventListener('click', handleImgClick);
    });
  }

  const categoryLabel = computed(() => {
    if (!article.value?.categoryVal) return '';
    const opt = apiTypeStore.getArticleCategoryOption.find((item) => item.value === article.value!.categoryVal);
    return opt?.label || '';
  });

  const headings = computed<Heading[]>(() => {
    if (!article.value) return [];
    const html = article.value.htmlContent || '';
    const result: Heading[] = [];
    const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        result.push({ id: `heading-${result.length}`, text, level });
      }
    }
    return result;
  });

  const processedContent = computed(() => {
    let html = article.value?.htmlContent || article.value?.markdownContent || '暂无内容';
    if (html === '暂无内容') return html;

    let idx = 0;
    html = html.replace(/<h([1-6])([^>]*)>/gi, (_match, level, attrs) => {
      const id = `heading-${idx}`;
      idx++;
      return `<h${level}${attrs} id="${id}">`;
    });

    html = html.replace(/<table/gi, '<table class="md-table"');
    html = html.replace(/<pre/gi, '<pre class="md-pre"');
    html = html.replace(/<code/gi, '<code class="md-code"');
    html = html.replace(/<img([^>]*)>/gi, (_match, attrs) => {
      const srcMatch = attrs.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch) return _match;
      let cleaned = attrs.replace(/\s+width\s*=\s*["'][^"']*["']/gi, '').replace(/\s+width\s*=\s*\d+/gi, '');
      const baseStyle = 'max-width:100%!important;height:auto!important;box-sizing:border-box';
      const styleMatch = cleaned.match(/style\s*=\s*"([^"]*)"/i);
      if (styleMatch) {
        const existing = styleMatch[1].replace(/\bwidth\s*:\s*[^;"]+[;"]?/gi, '').trim();
        cleaned = cleaned.replace(/style\s*=\s*"[^"]*"/i, `style="${baseStyle};${existing}"`);
      } else {
        cleaned = ` style="${baseStyle}" ${cleaned}`;
      }
      return `<img class="md-img"${cleaned} />`;
    });
    html = html.replace(/<blockquote/gi, '<blockquote class="md-blockquote"');

    return html;
  });

  function onTocClick(id: string) {
    showTocPopup.value = false;
    setTimeout(() => {
      uni.pageScrollTo({ selector: `#${id}`, duration: 300 });
    }, 300);
  }

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
      attachImageListeners();
    }
  }

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

  onLoad(async (options) => {
    await apiTypeStore.getArticleCategory();
    if (options?.id) {
      articleId.value = options.id;
      loadArticle(options.id);
    }
  });
  onUnmounted(() => {
    removeImageListeners();
  });
</script>

<style lang="scss" scoped>
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

  .article-detail-content {
    margin-top: 20rpx;
    padding: 30rpx;
    line-height: 1.8;
    font-size: $uni-font-size-base;
    overflow: hidden;
  }

  .article-detail-html {
    word-break: break-all;
    overflow-wrap: break-word;
  }

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
  .md-table {
    display: block;
    width: 100% !important;
    border-collapse: collapse;
    overflow-x: auto;
    font-size: 24rpx;
    margin: 16rpx 0;

    th,
    td {
      border: 1rpx solid #e5e5e5;
      padding: 12rpx 16rpx;
      text-align: left;
      word-break: break-word;
      min-width: 60rpx;
    }

    th {
      background-color: #f5f7fa;
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }
  }

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

  .md-img {
    max-width: 100% !important;
    height: auto !important;
    display: block;
    margin: 16rpx 0;
    border-radius: 8rpx;
    cursor: pointer;
    box-sizing: border-box;
  }
  .md-blockquote {
    margin: 16rpx 0;
    padding: 16rpx 24rpx;
    border-left: 6rpx solid #007aff;
    background-color: #f0f7ff;
    color: #555;
  }
</style>
