<template>
  <n-card :bordered="false" class="pro-card">
    <article-list v-show="showType === 'list'" ref="articleListRef" :category-options="categoryOptions" @edit-change="editChange" @add-change="addChange" />
    <article-add v-if="showType === 'add'" :row="rowParams" :category-options="categoryOptions" @changeShowType="changeShowType" @finished="addFinished" />
  </n-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted, onActivated } from 'vue';
  import { articleCategoryAPi } from '@/api';
  import articleList from './article-list.vue';
  import articleAdd from './article-add.vue';

  const articleListRef = ref<any>(null);

  // 切换组件展示
  const showType = ref('list');
  const changeShowType = (type: string) => {
    showType.value = type;
  };

  // 添加完成
  const addFinished = () => {
    articleListRef.value.searchSubmit();
  };

  // 新增传参
  const addChange = () => {
    changeShowType('add');
    rowParams.value = {};
  };

  // 编辑传参
  const rowParams = ref<any>({});
  const editChange = (row: Recordable) => {
    changeShowType('add');
    rowParams.value = row;
  };

  // 文章分类
  const categoryOptions = ref([]);
  // 获取文章分类数据
  const loadArticleCategoryAll = () => {
    articleCategoryAPi.getArticleCategoryAll().then((res) => {
      categoryOptions.value = res.map((m: any) => ({
        value: m.value,
        label: m.name,
      }));
    });
  };

  // 初始化
  const init = () => {
    loadArticleCategoryAll();
  };

  onActivated(init);
  onMounted(init);
</script>
<style lang="scss" scoped></style>
