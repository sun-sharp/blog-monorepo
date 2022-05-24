<template>
  <n-upload
    :headers="uploadHeaders"
    :show-remove-button="showRemoveButton"
    :data="uploadData"
    :disabled="disabled"
    :max="max"
    :custom-request="customRequest"
    :create-thumbnail-url="createThumbnailUrl"
  >
    <n-button>上传文件</n-button>
  </n-upload>
</template>

<script lang="ts">
  import { useUserStoreWidthOut } from '@/store/modules/user';
  import { getUploadAction } from '@/utils';
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
    },
    emits: ['uploadChange', 'delete'],
    setup(props) {
      console.log(props, 'props');
      // const getCSSProperties = computed(() => {
      //   return {
      //     width: `${props.width}px`,
      //     height: `${props.height}px`,
      //   };
      // });

      const message = useMessage();
      // const dialog = useDialog();

      const state = reactive({
        showModal: false,
        previewUrl: '',
        originalImgList: [] as string[],
        imgList: [] as string[],
      });

      // 上传文件
      const uploadAction = getUploadAction();
      const userStore = useUserStoreWidthOut();
      const token = userStore.getToken;
      const uploadHeaders = computed(() => {
        return {
          ...props.headers,
          source: props.source,
          timestamp: new Date().getTime(),
          Authorization: token,
        };
      });
      const uploadData = computed(() => {
        return {};
      });

      const customRequest = ({ file, headers, data, withCredentials, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
        console.log(file, headers, withCredentials);
        const formData = new FormData();
        if (data) {
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
          });
        }
        formData.append('image', file.file as File);
        console.log(formData);
        axios
          .request({
            url: uploadAction as string,
            method: 'POST',
            data: formData,
            withCredentials,
            headers,
            onUploadProgress: ({ loaded, total }) => {
              onProgress({ percent: Math.ceil((loaded / total) * 100) });
            },
          } as AxiosRequestConfig)
          .then((res) => {
            console.log(res);
            // const infoField = componentSetting.upload.apiSetting.infoField;
            // const imgField = componentSetting.upload.apiSetting.imgField;
            // const { code } = res;
            // const message = res.msg || res.message || '上传失败';
            // const result = res[infoField];
            // message.success(e.data);
            onFinish();
          })
          .catch((error) => {
            message.success(error.message);
            onError();
          });
      };

      // 自定义文件的缩略图
      const createThumbnailUrl = (file: File): Promise<string> => {
        console.log(file);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg');
          }, 1000);
        });
      };

      return {
        ...toRefs(state),
        uploadHeaders,
        uploadData,
        customRequest,
        createThumbnailUrl,
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
