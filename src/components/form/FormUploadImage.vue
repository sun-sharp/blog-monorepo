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

<!-- <style lang="scss" scoped>
  .upload {
    width: 100%;
    overflow: hidden;

    &-card {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: auto;
      height: auto;

      &-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 8px 8px 0;
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;

        &:hover {
          background: 0 0;

          .upload-card-item-info::before {
            opacity: 1;
          }

          &-info::before {
            opacity: 1;
          }
        }

        &-info {
          position: relative;
          height: 100%;
          padding: 0;
          overflow: hidden;

          &:hover {
            .img-box-actions {
              opacity: 1;
            }
          }

          &::before {
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            background-color: rgb(0 0 0 / 50%);
            opacity: 0;
            transition: all 0.3s;
            content: ' ';
          }

          .img-box {
            position: relative;
            border-radius: 2px;
          }

          .img-box-actions {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: all 0.3s;

            &:hover {
              background: 0 0;
            }

            .action-icon {
              color: rgb(255 255 255 / 85%);

              &:hover {
                color: #fff;
                cursor: pointer;
              }
            }
          }
        }
      }

      &-item-select-picture {
        color: #666;
        background: #fafafa;
        border: 1px dashed #d9d9d9;
        border-radius: 2px;
        cursor: pointer;

        .upload-title {
          color: #666;
        }
      }
    }
  }
</style> -->
