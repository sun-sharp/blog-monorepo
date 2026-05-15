<script lang="ts" setup>
  import { ReaderOutline } from '@/utils';
  import { MdPreview, MdCatalog } from 'md-editor-v3';
  // preview.css相比style.css少了编辑器那部分样式
  import 'md-editor-v3/lib/preview.css';
  import { ref } from 'vue';

  defineProps({
    editorId: {
      type: String,
      default: 'preview-only',
    },
    markdownText: {
      type: String,
      default: '',
    },
  });

  // 展示目录
  const showCatalog = ref(false);
  const showCatalogChange = () => {
    showCatalog.value = !showCatalog.value;
  };
</script>

<template>
  <div class="md-edit-preview">
    <MdPreview class="md-edit-preview__cont" :editor-id="editorId" :model-value="markdownText" />
    <n-icon size="18" class="catalog-icon" @click="showCatalogChange()">
      <ReaderOutline />
    </n-icon>
    <div v-show="showCatalog" class="catalog-cont">
      <MdCatalog :editor-id="editorId" />
    </div>
  </div>
</template>

<style lang="scss">
  .md-edit-preview {
    position: relative;
    width: 100%;
    min-height: 300px;
    border: 1px solid #ddd;

    &:hover {
      .catalog-icon {
        color: #333;
      }
    }

    &__cont {
      width: 100%;
      height: 100%;
    }

    .catalog-icon {
      position: absolute;
      top: 5px;
      right: 15px;
      color: #cfcfcf;
      cursor: pointer;
    }

    .catalog-cont {
      position: absolute;
      top: 30px;
      right: 15px;
      z-index: 4999;
      width: 200px;
      height: 200px;
      overflow-y: auto;
      background-color: #fafaff;
      box-shadow: 0 0 2px 2px rgb(0 0 0 / 5%);
    }
  }
</style>
