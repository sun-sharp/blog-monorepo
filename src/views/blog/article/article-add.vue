<template>
  <div class="article-add">
    <div class="article-add-head">
      <span>md编辑器</span>
    </div>

    <md-editor-input />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import MdEditorInput from '@/components/md-editor/md-editor-input.vue';

  export default defineComponent({
    name: 'ArticleAdd',
    components: {
      MdEditorInput,
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="scss" scoped></style>
