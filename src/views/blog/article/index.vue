<template>
  <article-list v-show="showType === 'list'" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import articleList from './article-list.vue';

  const showType = ref('list');
</script>
<style lang="scss" scoped></style>
