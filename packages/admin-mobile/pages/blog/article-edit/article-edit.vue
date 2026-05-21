<template>
  <view class="article-edit-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="标题" prop="title">
        <u-input v-model="form.title" placeholder="请输入文章标题" />
      </u-form-item>
      <u-form-item label="简介" prop="brief">
        <u-textarea v-model="form.brief" placeholder="请输入文章简介" :maxlength="300" count />
      </u-form-item>
      <u-form-item label="分类" prop="categoryVal">
        <u-select v-model="form.categoryVal" :list="categoryList" placeholder="请选择分类" />
      </u-form-item>
      <u-form-item label="加密" prop="isPrivate">
        <u-switch v-model="form.isPrivate" />
      </u-form-item>
      <u-form-item label="内容" prop="markdownContent">
        <u-textarea v-model="form.markdownContent" placeholder="请输入Markdown内容" :height="400" />
      </u-form-item>
    </u-form>

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave(false)">保存</u-button>
      <u-button type="warning" :loading="loading" style="margin-left: 20rpx" @click="handleSave(true)">加密保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { articleAPi } from '../../../api';
  import { useApiTypeStore } from '../../../store';
  import type { ApiArticleItem } from '/#/api/blog/article';

  const apiTypeStore = useApiTypeStore();
  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');

  const form = reactive({
    title: '',
    brief: '',
    categoryVal: null as number | null,
    isPrivate: false,
    markdownContent: '',
    htmlContent: '',
    cssContent: '',
  });

  const rules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    brief: [{ required: true, message: '请输入简介', trigger: 'blur' }],
    categoryVal: [{ required: true, message: '请选择分类', trigger: 'change' }],
    markdownContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  };

  const categoryList = ref<{ label: string; value: number }[]>([]);

  async function loadCategoryList() {
    await apiTypeStore.getArticleCategory();
    categoryList.value = apiTypeStore.getArticleCategoryOption.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  }

  async function loadArticle(id: string) {
    try {
      const res = await articleAPi.getFindPage({ current: 1, size: 1, keywords: '' });
      const article = res.list?.find((a: ApiArticleItem) => a.articleId === id);
      if (article) {
        form.title = article.title;
        form.brief = article.brief;
        form.categoryVal = article.categoryVal;
        form.isPrivate = article.isPrivate;
        form.markdownContent = article.markdownContent;
        form.htmlContent = article.htmlContent;
        form.cssContent = article.cssContent;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSave(isPrivate: boolean) {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    loading.value = true;
    try {
      const data = {
        title: form.title,
        brief: form.brief,
        categoryVal: form.categoryVal as number,
        markdownContent: form.markdownContent,
        htmlContent: form.markdownContent,
        cssContent: '',
        isPrivate,
      };
      if (editId.value) {
        await articleAPi.update({ ...data, articleId: editId.value });
      } else {
        await articleAPi.save(data);
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onLoad(async (options) => {
    await loadCategoryList();
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑文章' });
      loadArticle(options.id);
    }
  });
</script>

<style lang="scss" scoped>
  .article-edit-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
