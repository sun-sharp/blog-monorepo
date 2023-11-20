<script lang="ts" setup>
  import { FormUploadImageProps, useFormUploadImage } from './hooks/useFormUploadImage';

  const props = defineProps(FormUploadImageProps);

  const emit = defineEmits(['uploadChange', 'delete', 'update:imageList']);

  const { showModal, previewUrl, uploadHeaders, uploadData, customRequest } = useFormUploadImage(props, emit);
</script>

<template>
  <n-upload
    list-type="image-card"
    :headers="uploadHeaders"
    :show-remove-button="showRemoveButton"
    :data="uploadData"
    :disabled="disabled"
    :max="max"
    :custom-request="customRequest"
    :default-file-list="imageList"
  >
    上传图片
  </n-upload>

  <!--预览图片-->
  <n-modal v-model:show="showModal" preset="card" title="预览" :bordered="false" :style="{ width: '520px' }">
    <img :src="previewUrl" />
  </n-modal>
</template>
