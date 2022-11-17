<template>
  <article-list v-show="showType === 'list'" />
  <article-add v-if="showType === 'add'" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import articleList from './article-list.vue';
  import articleAdd from './article-add.vue';

  const showType = ref('add');
</script>
<style lang="scss" scoped></style>
