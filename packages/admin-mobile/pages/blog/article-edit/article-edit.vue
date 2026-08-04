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

      <!-- 文章内容编辑区域已移除，保存时将保持原有内容不变 -->

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
  import { onLoad } from '@dcloudio/uni-app';
  import { articleAPi } from '../../../api';
  import { useApiTypeStore } from '../../../store';

  const apiTypeStore = useApiTypeStore();
  const loading = ref(false);
  const editId = ref('');
  const showCategory = ref(false);

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
        form.markdownContent = article.markdownContent;
        form.htmlContent = article.htmlContent || ''; // 保存原始的 htmlContent
        form.cssContent = article.cssContent;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSave() {
    if (!validate()) return;

    loading.value = true;
    try {
      const data = {
        title: form.title.trim(),
        brief: form.brief.trim(),
        categoryVal: form.categoryVal as number,
        markdownContent: form.markdownContent, // 原样保存
        htmlContent: form.htmlContent, // 原样保存（不重新生成）
        cssContent: form.cssContent, // 原样保存
        isPrivate: form.isPrivate,
      };
      if (editId.value) {
        await articleAPi.update({ ...data, articleId: editId.value });
      } else {
        await articleAPi.save(data);
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        uni.$emit('detailUpdated'); // 通知详情页更新数据
        uni.$emit('listUpdated'); // 通知列表页更新数据
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
    background-color: $uni-bg-color-grey;
  }

  .article-edit-scroll {
    flex: 1;
    width: 100%;
    height: 0;
    padding: 20rpx;
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
</style>
