<template>
  <view class="article-detail">
    <!-- 加载状态 -->
    <view v-if="loading" class="article-detail-loading">
      <u-loading mode="circle" size="60" />
    </view>

    <!-- 文章内容 -->
    <template v-else-if="article">
      <!-- #ifdef H5 -->
      <view ref="scrollViewRef" class="article-detail-scroll" @scroll="onArticleScroll">
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

          <!-- <view class="article-detail-content card" v-html="processedHtml"></view> -->
          <view></view>
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifndef H5 -->
      <scroll-view ref="scrollViewRef" scroll-y class="article-detail-scroll" :scroll-top="scrollTopValue" scroll-with-animation @scroll="onArticleScroll">
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
        </view>
      </scroll-view>
      <!-- #endif -->

      <!-- 悬浮目录按钮 -->
      <!-- <view v-if="headings.length > 1" class="article-detail-toc-fab" @click="openTocPopup">
        <u-icon name="list" size="28" color="#fff" />
      </view> -->

      <!-- 目录侧滑弹窗 -->
      <!-- <u-popup v-model="showTocPopup" mode="right" width="70%" border-radius="20" closeable>
        <view class="article-detail-toc-popup">
          <view class="article-detail-toc-popup-header">
            <text class="article-detail-toc-popup-title">目录导航</text>
          </view>
          <scroll-view scroll-y class="article-detail-toc-popup-body" :scroll-into-view="scrollIntoViewId" scroll-with-animation>
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
      </u-popup> -->

      <view class="article-detail-footer">
        <view class="article-detail-action-btn" @click="goToHtmlCont(article.pid)">
          <text class="article-detail-action-text">详细内容</text>
        </view>
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
  import { ref, computed, nextTick, watch, onUnmounted } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { articleAPi } from '../../../api';
  import { setRefreshFlag, consumeRefreshFlag } from '../../../composables/useRefreshFlag';
  import { useApiTypeStore } from '../../../store';
  import type { ApiArticleMobileDetails } from '/#/api/blog/article';

  // ---------- 强化样式：彻底解决代码块横向滚动问题 ----------
  //   const HLJS_CSS = `
  // /* 高亮样式 */
  // .hljs { display: block; overflow-x: auto; padding: 0.5em; color: #333; background: #f8f8f8; }
  // .hljs-comment, .hljs-quote { color: #998; font-style: italic; }
  // .hljs-keyword, .hljs-selector-tag, .hljs-subst { color: #333; font-weight: bold; }
  // .hljs-number, .hljs-literal, .hljs-variable, .hljs-template-variable, .hljs-tag .hljs-attr { color: #008080; }
  // .hljs-string, .hljs-doctag { color: #d14; }
  // .hljs-title, .hljs-section, .hljs-selector-id { color: #900; font-weight: bold; }
  // .hljs-subst { font-weight: normal; }
  // .hljs-type, .hljs-class .hljs-title { color: #458; font-weight: bold; }
  // .hljs-tag, .hljs-name, .hljs-attribute { color: #000080; font-weight: normal; }
  // .hljs-regexp, .hljs-link { color: #009926; }
  // .hljs-symbol, .hljs-bullet { color: #990073; }
  // .hljs-built_in, .hljs-builtin-name { color: #0086b3; }
  // .hljs-meta { color: #999; font-weight: bold; }
  // .hljs-deletion { background: #fdd; }
  // .hljs-addition { background: #dfd; }
  // .hljs-emphasis { font-style: italic; }
  // .hljs-strong { font-weight: bold; }

  // /* 禁止全局横向滚动（覆盖所有父容器） */
  // .article-detail,
  // .article-detail-scroll,
  // .article-detail-content,
  // page,
  // view,
  // .mp-html,
  // .rich-text,
  // .article-detail-scroll > view {
  //   overflow-x: hidden !important;
  //   max-width: 100% !important;
  //   box-sizing: border-box !important;
  // }

  // /* 代码块内部横向滚动（强力覆盖 mp-html 内部所有可能的结构） */
  // pre,
  // code,
  // pre code,
  // .hljs,
  // .code-block,
  // .mp-html pre,
  // .mp-html code,
  // .mp-html pre code,
  // .article-detail-content pre,
  // .article-detail-content code,
  // .article-detail-content pre code {
  //   overflow-x: auto !important;
  //   -webkit-overflow-scrolling: touch !important;
  //   white-space: pre !important;
  //   word-break: normal !important;
  //   max-width: 100% !important;
  //   display: block !important;
  // }

  // /* 针对行内代码不滚动（仅块级代码滚动） */
  // code:not(pre code) {
  //   overflow-x: visible !important;
  //   white-space: normal !important;
  // }

  // /* 表格处理 */
  // table {
  //   display: block !important;
  //   overflow-x: auto !important;
  //   -webkit-overflow-scrolling: touch !important;
  //   max-width: 100% !important;
  // }
  // table td, table th {
  //   white-space: nowrap;
  // }

  // /* 图片自适应 */
  // img {
  //   max-width: 100% !important;
  //   height: auto !important;
  // }

  // .md-editor { height: 100%; }
  // `;

  // interface Heading {
  //   id: string;
  //   text: string;
  //   level: number;
  // }

  const apiTypeStore = useApiTypeStore();
  const article = ref<ApiArticleMobileDetails | null>(null);
  const loading = ref(true);
  const articleId = ref('');
  const showTocPopup = ref(false);
  const scrollTopValue = ref(0);
  const activeHeadingId = ref('');
  const currentScrollTop = ref(0);
  const scrollIntoViewId = ref('');
  const scrollViewRef = ref<any>(null);
  // #ifndef H5
  // const mpHtmlRef = ref<any>(null);
  // #endif
  const headingPositions = ref<number[]>([]);

  const STYLE_TAG_ID = 'article-detail-custom-style';

  const categoryLabel = computed(() => {
    if (!article.value?.categoryVal) return '';
    const opt = apiTypeStore.getArticleCategoryOption.find((item) => item.value === article.value!.categoryVal);
    return opt?.label || '';
  });

  // 简单的 Markdown 转纯文本（仅处理换行，用于降级展示）
  // function simpleMarkdownToText(md: string): string {
  //   return md.replace(/<[^>]*>/g, '').replace(/\n/g, '<br/>');
  // }

  // const rawHtml = computed(() => {
  //   if (!article.value) return '';
  //   if (article.value.htmlContent) return article.value.htmlContent;
  //   if (article.value.markdownContent) {
  //     // 不引入 marked，简单转成带换行的文本
  //     return `<pre>${simpleMarkdownToText(article.value.markdownContent)}</pre>`;
  //   }
  //   return '';
  // });

  // const processedHtml = computed(() => {
  //   let html = rawHtml.value;
  //   if (!html || html === '暂无内容') return '暂无内容';

  //   let headingIdx = 0;
  //   html = html.replace(/<h([1-6])([^>]*)>/gi, (_, level, attrs) => {
  //     const cleanedAttrs = attrs.replace(/\s+id\s*=\s*["'][^"']*["']/gi, '');
  //     return `<h${level}${cleanedAttrs} id="heading-${headingIdx++}">`;
  //   });

  //   return `<div class="md-editor"><div class="md-editor-preview"><article class="default-theme">${html}</article></div></div>`;
  // });

  // const mergedCss = computed(() => (article.value?.cssContent || '') + HLJS_CSS);

  // const headings = computed<Heading[]>(() => {
  //   if (!article.value) return [];
  //   const html = rawHtml.value;
  //   const result: Heading[] = [];
  //   const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  //   let match;
  //   let idx = 0;
  //   while ((match = regex.exec(html)) !== null) {
  //     const level = parseInt(match[1]);
  //     const text = match[2].replace(/<[^>]+>/g, '').trim();
  //     if (text) result.push({ id: `heading-${idx++}`, text, level });
  //   }
  //   return result;
  // });

  // function extractImgUrls(html: string): string[] {
  //   const result: string[] = [];
  //   const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  //   let match;
  //   while ((match = regex.exec(html)) !== null) result.push(match[1]);
  //   return result;
  // }

  // #ifdef H5
  // function bindImageClick() {
  //   const container = document.querySelector('.article-detail-content');
  //   if (container) {
  //     container.addEventListener('click', (e: Event) => {
  //       const target = e.target as HTMLElement;
  //       if (target.tagName === 'IMG') {
  //         const src = target.getAttribute('src');
  //         if (src) uni.previewImage({ current: src, urls: extractImgUrls(rawHtml.value) });
  //       }
  //     });
  //   }
  // }
  // #endif

  // #ifndef H5
  // function onMpHtmlImgTap(e: any) {
  //   uni.previewImage({ current: e.detail.src, urls: extractImgUrls(rawHtml.value) });
  // }
  // #endif

  // function updateHeadingPositions() {
  //   // #ifdef H5
  //   const headingElements = document.querySelectorAll(
  //     '.article-detail-content h1, .article-detail-content h2, .article-detail-content h3, .article-detail-content h4, .article-detail-content h5, .article-detail-content h6'
  //   );
  //   const container = document.querySelector('.article-detail-scroll');
  //   if (container) {
  //     const containerRect = container.getBoundingClientRect();
  //     const scrollTop = container.scrollTop || 0;
  //     headingPositions.value = Array.from(headingElements).map((h) => {
  //       const rect = h.getBoundingClientRect();
  //       return rect.top - containerRect.top + scrollTop;
  //     });
  //   }
  //   // #endif

  //   // #ifndef H5
  //   const query = uni.createSelectorQuery().in(mpHtmlRef.value);
  //   query.selectAll('h1,h2,h3,h4,h5,h6').boundingClientRect();
  //   query.exec((res: any) => {
  //     const rects = res[0] as UniApp.NodeInfo[];
  //     if (rects && rects.length > 0) {
  //       headingPositions.value = rects.map((r) => r.top || 0);
  //     }
  //   });
  //   // #endif
  // }

  // #ifndef H5
  // function onMpHtmlReady() {
  //   updateHeadingPositions();
  // }
  // #endif

  async function forceTocScroll() {
    if (!activeHeadingId.value) return;
    const target = 'toc-' + activeHeadingId.value;
    scrollIntoViewId.value = '';
    await nextTick();
    scrollIntoViewId.value = target;
  }

  // function openTocPopup() {
  //   showTocPopup.value = true;
  //   forceTocScroll();
  // }

  watch(showTocPopup, (val) => {
    if (!val) scrollIntoViewId.value = '';
  });

  // function onTocClick(id: string) {
  //   showTocPopup.value = false;

  //   // #ifdef H5
  //   const target = document.getElementById(id);
  //   const container = document.querySelector('.article-detail-scroll');
  //   if (target && container) {
  //     const containerRect = container.getBoundingClientRect();
  //     const targetRect = target.getBoundingClientRect();
  //     const scrollTop = targetRect.top - containerRect.top + container.scrollTop - 80;
  //     container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
  //   }
  //   // #endif

  //   // #ifndef H5
  //   const idx = headings.value.findIndex((h) => h.id === id);
  //   if (idx === -1) return;
  //   let targetScrollTop = 0;
  //   if (headingPositions.value.length > idx) {
  //     targetScrollTop = headingPositions.value[idx] - 80;
  //   }
  //   scrollTopValue.value = targetScrollTop;
  //   // #endif
  // }

  const updateActiveHeading = throttle(() => {
    // #ifdef H5
    const headingElements = document.querySelectorAll(
      '.article-detail-content h1, .article-detail-content h2, .article-detail-content h3, .article-detail-content h4, .article-detail-content h5, .article-detail-content h6'
    );
    let activeId = '';
    for (let i = 0; i < headingElements.length; i++) {
      if (headingElements[i].getBoundingClientRect().top > 0) {
        activeId = `heading-${i}`;
        break;
      }
    }
    if (!activeId && headingElements.length > 0) activeId = `heading-${headingElements.length - 1}`;
    if (activeId !== activeHeadingId.value) {
      activeHeadingId.value = activeId;
      forceTocScroll();
    }
    // #endif

    // #ifndef H5
    // const query = uni.createSelectorQuery().in(mpHtmlRef.value);
    // query.selectAll('h1,h2,h3,h4,h5,h6').boundingClientRect();
    // query.exec((res: any) => {
    //   const rects = res[0] as any[];
    //   if (!rects || rects.length === 0) return;
    //   let activeId = '';
    //   for (let i = 0; i < rects.length; i++) {
    //     if (rects[i] && rects[i].top > 0) {
    //       activeId = headings.value[i]?.id || '';
    //       break;
    //     }
    //   }
    //   if (!activeId && rects.length > 0) activeId = headings.value[rects.length - 1]?.id || '';
    //   if (activeId !== activeHeadingId.value) {
    //     activeHeadingId.value = activeId;
    //     forceTocScroll();
    //   }
    // });
    // #endif
  }, 200);

  function onArticleScroll(e: any) {
    // #ifdef H5
    currentScrollTop.value = e.target.scrollTop;
    // #endif
    // #ifndef H5
    currentScrollTop.value = e.detail.scrollTop;
    // #endif
    updateActiveHeading();
  }

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

  // #ifdef H5
  // function injectStyle(css: string) {
  //   removeStyle();
  //   const style = document.createElement('style');
  //   style.id = STYLE_TAG_ID;
  //   style.textContent = css;
  //   document.head.appendChild(style);
  // }

  function removeStyle() {
    document.getElementById(STYLE_TAG_ID)?.remove();
  }
  // #endif

  async function loadArticle(id: string) {
    loading.value = true;
    headingPositions.value = [];

    try {
      const res = await articleAPi.getDetails(id);
      article.value = res || null;
    } catch (e) {
      console.error('文章加载失败', e);
      article.value = null;
    } finally {
      loading.value = false;

      await nextTick();

      // #ifdef H5
      // if (article.value) {
      //   injectStyle((article.value.cssContent || '') + HLJS_CSS);
      //   setTimeout(() => {
      //     bindImageClick();
      //     updateHeadingPositions();
      //   }, 200);
      // }
      // #endif
    }
  }

  function goToEdit() {
    uni.navigateTo({ url: `/pages/blog/article-edit/article-edit?id=${articleId.value}` });
  }

  function goToHtmlCont(pid: string) {
    uni.navigateTo({ url: `/pages/blog/web/full?pid=${pid}` });
  }

  function handleDelete() {
    uni.showModal({
      title: '确认删除',
      content: `确定删除文章「${article.value?.title}」？`,
      success: async (res) => {
        if (res.confirm) {
          await articleAPi.remove(articleId.value);
          uni.showToast({ title: '删除成功', icon: 'success' });
          setTimeout(() => {
            setRefreshFlag('article');
            uni.navigateBack();
          }, 500);
        }
      },
    });
  }

  // onMounted(() => {
  //   console.log('文章详情页 mounted');
  // });

  onUnmounted(() => {
    // #ifdef H5
    removeStyle();
    // #endif
  });

  onLoad(async (options: any) => {
    console.log('onLoad 参数:', options);
    await apiTypeStore.getArticleCategory();
    if (options?.id) {
      articleId.value = options.id;
      loadArticle(options.id);
    } else {
      console.warn('缺少文章ID');
      loading.value = false;
    }
  });

  onShow(() => {
    if (articleId.value && consumeRefreshFlag('article')) {
      loadArticle(articleId.value);
      setRefreshFlag('article');
    }
  });
</script>

<style lang="scss" scoped>
  .article-detail {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;
    overflow-x: hidden; /* 根容器禁止横向滚动 */
  }

  .article-detail-scroll {
    flex: 1;
    height: 0;
    overflow-x: hidden !important; /* 强制禁止横向滚动 */
    /* #ifdef H5 */
    overflow-y: auto;
    scroll-behavior: smooth;
    /* #endif */
  }

  .article-detail-body {
    padding: 20rpx;
    /* #ifdef H5 */
    padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
    /* #endif */
    /* #ifndef H5 */
    padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
    /* #endif */
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
    overflow-x: hidden !important; /* 强制禁止横向滚动 */
    width: 100%;
    box-sizing: border-box;
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
