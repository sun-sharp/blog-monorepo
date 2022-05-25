<template>
  <n-upload
    :headers="uploadHeaders"
    :data="uploadData"
    :show-remove-button="showRemoveButton"
    :disabled="disabled"
    :max="max"
    :multiple="multiple"
    :custom-request="customRequest"
    list-type="image"
    :file-list="fileList"
  >
    <n-button :type="buttonType">{{ buttonText }}</n-button>
  </n-upload>
</template>

<script lang="ts">
  import { useUserStoreWidthOut } from '@/store/modules/user';
  import axios, { AxiosRequestConfig } from 'axios';
  import { UploadCustomRequestOptions, useMessage } from 'naive-ui';
  import { defineComponent, toRefs, reactive, computed } from 'vue';

  export default defineComponent({
    name: 'FormUploadExcel',
    props: {
      headers: {
        type: Object,
        default: () => ({}),
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      max: {
        type: Number,
        default: Infinity,
      },
      value: {
        type: Array,
        default: () => [],
      },
      showRemoveButton: {
        type: Boolean,
        default: true,
      },
      source: {
        type: String,
        default: '',
      },
      buttonType: {
        type: String,
        default: '',
      },
      buttonText: {
        type: String,
        default: '上传文件',
      },
      action: {
        type: String,
        required: true,
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      fileList: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:fileList', 'uploadChange'],
    setup(props, { emit }) {
      const { action, headers, source } = toRefs(props);
      const nMessage = useMessage();

      const state = reactive({
        showModal: false,
      });

      // 上传文件
      const uploadAction = computed(() => {
        return action.value;
      });
      const userStore = useUserStoreWidthOut();
      const completeToken = userStore.getCompleteToken;
      const uploadHeaders = computed(() => {
        return {
          ...headers.value,
          source: source.value,
          timestamp: new Date().getTime(),
          Authorization: completeToken,
        };
      });
      const uploadData = computed(() => {
        return {};
      });

      const customRequest = ({ file, headers, data, withCredentials, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
        const formData = new FormData();
        if (data) {
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
          });
        }
        formData.append('file', file.file as File);
        axios
          .request({
            url: uploadAction.value as string,
            method: 'POST',
            data: formData,
            withCredentials,
            headers,
            onUploadProgress: ({ loaded, total }) => {
              onProgress({ percent: Math.ceil((loaded / total) * 100) });
            },
          } as AxiosRequestConfig)
          .then((res: any) => {
            const { code, message = '上传失败', result } = res.data;
            if (code === 0 && typeof result === 'object' && result instanceof Array && result.length > 0) {
              nMessage.success(message);
              emit('uploadChange', result);
              emit('update:fileList', result);
              onFinish();
            } else {
              nMessage.error(message);
              onError();
            }
          })
          .catch((error) => {
            nMessage.error(error.message);
            onError();
          });
      };

      return {
        ...toRefs(state),
        uploadHeaders,
        uploadData,
        customRequest,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .upload {
    width: 100%;
    overflow: hidden;

    &-card {
      width: auto;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      &-item {
        margin: 0 8px 8px 0;
        position: relative;
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

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
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: all 0.3s;
            content: ' ';
          }

          .img-box {
            position: relative;
            //padding: 8px;
            //border: 1px solid #d9d9d9;
            border-radius: 2px;
          }

          .img-box-actions {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 10;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:hover {
              background: 0 0;
            }

            .action-icon {
              color: rgba(255, 255, 255, 0.85);

              &:hover {
                cursor: pointer;
                color: #fff;
              }
            }
          }
        }
      }

      &-item-select-picture {
        border: 1px dashed #d9d9d9;
        border-radius: 2px;
        cursor: pointer;
        background: #fafafa;
        color: #666;

        .upload-title {
          color: #666;
        }
      }
    }
  }
</style>
