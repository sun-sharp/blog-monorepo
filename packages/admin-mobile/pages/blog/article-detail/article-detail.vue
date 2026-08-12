<template>
  <view class="article-detail">
    <scroll-view scroll-y class="article-detail-scroll">
      <view v-if="loading" class="article-detail-loading">
        <u-loading mode="circle" size="60" />
        <text class="article-detail-loading-text">加载中...</text>
      </view>

      <template v-else-if="article">
        <view class="article-detail-info card">
          <view class="info-row">
            <text class="info-label">标题</text>
            <text class="info-value">{{ article.title || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">分类</text>
            <text class="info-value">{{ categoryLabel || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">作者</text>
            <text class="info-value">{{ article.authorNickname || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">创建时间</text>
            <text class="info-value">{{ article.createTime?.slice(0, 10) || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">是否加密</text>
            <text class="info-value">{{ article.isPrivate ? '加密' : '公开' }}</text>
          </view>
          <view v-if="article.brief" class="info-row">
            <text class="info-label">简介</text>
            <text class="info-value">{{ article.brief }}</text>
          </view>
        </view>

        <view class="article-detail-action">
          <u-button type="primary" shape="circle" icon="eye" @click="goToHtmlCont(article.pid)">详细内容</u-button>
        </view>
      </template>

      <view v-else class="article-detail-empty">
        <u-empty mode="data" text="文章不存在" />
      </view>
    </scroll-view>

    <view v-if="article" class="article-detail-footer">
      <view class="article-detail-action-btn" @click="goToEdit">
        <u-icon name="edit-pen" size="30" color="#007aff" />
        <text class="article-detail-action-text">编辑</text>
      </view>
      <view class="article-detail-action-btn article-detail-action-btn-danger" @click="handleDelete">
        <u-icon name="trash" size="30" color="#dd524d" />
        <text class="article-detail-action-text article-detail-action-text-danger">删除</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { articleAPi } from '../../../api';
  import { setRefreshFlag, consumeRefreshFlag } from '../../../composables/useRefreshFlag';
  import { useApiTypeStore } from '../../../store';
  import type { ApiArticleMobileDetails } from '/#/api/blog/article';

  const apiTypeStore = useApiTypeStore();
  const article = ref<ApiArticleMobileDetails | null>(null);
  const loading = ref(true);
  const articleId = ref('');

  const categoryLabel = computed(() => {
    if (!article.value?.categoryVal) return '';
    const opt = apiTypeStore.getArticleCategoryOption.find((item) => item.value === article.value!.categoryVal);
    return opt?.label || '';
  });

  async function loadArticle(id: string) {
    loading.value = true;
    try {
      const res = await articleAPi.getDetails(id);
      article.value = res || null;
    } catch (e) {
      console.error('文章加载失败', e);
      article.value = null;
    } finally {
      loading.value = false;
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

  onLoad(async (options: any) => {
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
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .article-detail-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    box-sizing: border-box;
  }

  .article-detail-loading,
  .article-detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
  }

  .article-detail-loading-text {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }

  .article-detail-info {
    padding: 10rpx 24rpx;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20rpx 0;
    border-bottom: 1rpx solid $uni-border-color;

    &:last-child {
      border-bottom: none;
    }
  }

  .info-label {
    flex-shrink: 0;
    font-size: $uni-font-size-base;
    color: $uni-text-color-grey;
    margin-right: 24rpx;
  }

  .info-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
    text-align: right;
    word-break: break-all;
  }

  .article-detail-action {
    margin-top: 30rpx;
    padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  }

  .article-detail-footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40rpx;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background-color: #ffffff;
    border-top: 1rpx solid #e5e5e5;
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
