<template>
  <n-card :bordered="false" class="pro-card">
    <article-list v-show="showType === 'list'" />
    <article-add v-if="showType === 'add'" @changeShowType="changeShowType" />
  </n-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import articleList from './article-list.vue';
  import articleAdd from './article-add.vue';

  const showType = ref('list');

  const changeShowType = (type: string) => {
    showType.value = type;
  };
</script>
<style lang="scss" scoped></style>
