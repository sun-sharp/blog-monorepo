<script lang="ts" setup>
  import { useArticleConfigure } from './hooks/useArticleConfigure';
  import ArticleList from './components/ArticleList.vue';
  import ArticleAdd from './components/ArticleAdd.vue';

  const { showType, articleListRef, articleCategoryOption, rowParams, editChange, addChange, changeShowType, addFinished } = useArticleConfigure();
</script>

<template>
  <n-card :bordered="false">
    <article-list
      v-show="showType === 'list'"
      ref="articleListRef"
      :category-options="articleCategoryOption"
      @edit-change="editChange"
      @add-change="addChange"
    />
    <article-add
      v-if="showType === 'add'"
      :row="rowParams"
      :category-options="articleCategoryOption"
      @changeShowType="changeShowType"
      @finished="addFinished"
    />
  </n-card>
</template>
