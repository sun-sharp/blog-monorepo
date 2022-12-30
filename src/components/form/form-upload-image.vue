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

<script lang="ts">
  import { componentUpload } from '@/constant';
  import { useUserStoreWidthOut } from '@/store/modules/user';
  import { getImgUrl, getUploadImageAction } from '@/utils';
  import axios, { AxiosRequestConfig } from 'axios';
  import { UploadCustomRequestOptions, useMessage } from 'naive-ui';
  import { defineComponent, toRefs, reactive, computed } from 'vue';

  export default defineComponent({
    name: 'FormUploadImage',
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
      imageList: {
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
    emits: ['uploadChange', 'delete', 'update:imageList'],
    setup(props, { emit }) {
      const nMessage = useMessage();

      const state = reactive({
        showModal: false,
        previewUrl: '',
      });

      // 上传文件
      const uploadAction = getUploadImageAction();
      const userStore = useUserStoreWidthOut();
      const completeToken = userStore.getCompleteToken;
      const uploadHeaders = computed(() => {
        return {
          ...props.headers,
          source: props.source,
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
        formData.append('image', file.file as File);
        axios
          .request({
            url: uploadAction as string,
            method: 'POST',
            data: formData,
            withCredentials,
            headers,
            onUploadProgress: ({ loaded, total = 1 }) => {
              onProgress({ percent: Math.ceil((loaded / total) * 100) });
            },
          } as AxiosRequestConfig)
          .then((res: any) => {
            const infoField = componentUpload.apiSetting.infoField;
            const imgField = componentUpload.apiSetting.imgField;
            const aData = res.data || {};
            const { code, message = '上传失败' } = aData;
            const result = aData[infoField];
            if (code === 0 && typeof result === 'object') {
              const url = result[imgField];
              nMessage.success(message);
              emit('uploadChange', result);
              emit(
                'update:imageList',
                url
                  ? [
                      {
                        url: getImgUrl(url),
                        key: url,
                        status: 'finished',
                      },
                    ]
                  : []
              );
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
