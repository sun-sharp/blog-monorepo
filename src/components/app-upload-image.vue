<template>
  <!-- <n-upload
    v-bind="$props"
    :action="uploadAction"
    :headers="uploadHeaders"
    name="image"
    :data="uploadData"
    :file-list-style="{ display: 'none' }"
    @before-upload="beforeUpload"
    @finish="finish"
  >
    上传图片
  </n-upload> -->

  <n-upload
    list-type="image-card"
    :headers="uploadHeaders"
    :show-remove-button="showRemoveButton"
    :data="uploadData"
    :disabled="disabled"
    :max="max"
    :custom-request="customRequest"
  >
    上传图片
  </n-upload>

  <!--预览图片-->
  <n-modal v-model:show="showModal" preset="card" title="预览" :bordered="false" :style="{ width: '520px' }">
    <img :src="previewUrl" />
  </n-modal>
</template>

<script lang="ts">
  import { imageApi } from '@/api';
  import { useUserStoreWidthOut } from '@/store/modules/user';
  import { UploadCustomRequestOptions, useMessage } from 'naive-ui';
  import { defineComponent, toRefs, reactive, computed } from 'vue';

  export default defineComponent({
    name: 'AppUploadImage',
    props: {
      headers: {
        type: Object,
        default: () => ({}),
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      // ...NUpload.props,
      // accept: {
      //   type: String,
      //   default: '.jpg,.png,.jpeg,.svg,.gif',
      // },
      // helpText: {
      //   type: String as PropType<string>,
      //   default: '',
      // },
      // maxSize: {
      //   type: Number as PropType<number>,
      //   default: 2,
      // },
      max: {
        type: Number,
        default: Infinity,
      },
      value: {
        type: Array,
        default: () => [],
      },
      // width: {
      //   type: Number as PropType<number>,
      //   default: 104,
      // },
      // height: {
      //   type: Number as PropType<number>,
      //   default: 104, //建议不小于这个尺寸 太小页面可能显示有异常
      // },
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
    setup(props, { emit }) {
      console.log(props);
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
      const userStore = useUserStoreWidthOut();
      const token = userStore.getToken;
      const uploadHeaders = computed(() => {
        return {
          ...props.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
          source: props.source,
          timestamp: new Date().getTime(),
          Authorization: token,
        };
      });
      const uploadData = computed(() => {
        return {};
      });

      // //赋值默认图片显示
      // if (props.value.length) {
      //   state.imgList = props.value.map((item) => {
      //     return getImgUrl(item);
      //   });
      // }

      // //预览
      // function preview(url: string) {
      //   state.showModal = true;
      //   state.previewUrl = url;
      // }

      // //删除
      // function remove(index: number) {
      //   dialog.info({
      //     title: '提示',
      //     content: '你确定要删除吗？',
      //     positiveText: '确定',
      //     negativeText: '取消',
      //     onPositiveClick: () => {
      //       state.imgList.splice(index, 1);
      //       state.originalImgList.splice(index, 1);
      //       emit('uploadChange', state.originalImgList);
      //       emit('delete', state.originalImgList);
      //     },
      //     onNegativeClick: () => {},
      //   });
      // }

      // function checkFileType(fileType: string) {
      //   return componentSetting.upload.fileType.includes(fileType);
      // }

      // //上传之前
      // function beforeUpload({ file }) {
      //   const fileInfo = file.file;
      //   const { maxSize, accept } = props;
      //   const acceptRef = (isString(accept) && accept.split(',')) || [];

      //   // 设置最大值，则判断
      //   if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
      //     message.error(`上传文件最大值不能超过${maxSize}M`);
      //     return false;
      //   }

      //   // 设置类型,则判断
      //   const fileType = componentSetting.upload.fileType;
      //   if (acceptRef.length > 0 && !checkFileType(fileInfo.type)) {
      //     message.error(`只能上传文件类型为${fileType.join(',')}`);
      //     return false;
      //   }

      //   return true;
      // }

      // //上传结束
      // function finish({ event: Event }) {
      //   console.log(Event, 'event');
      //   const res = JSON.parse(Event.target.response);
      //   const infoField = componentSetting.upload.apiSetting.infoField;
      //   const imgField = componentSetting.upload.apiSetting.imgField;
      //   const { code } = res;
      //   const message = res.msg || res.message || '上传失败';
      //   const result = res[infoField];
      //   //成功
      //   if (code === ResultEnum.SUCCESS) {
      //     let imgUrl: string = getImgUrl(result[imgField]);
      //     state.imgList.push(imgUrl);
      //     state.originalImgList.push(result[imgField]);
      //     emit('uploadChange', state.originalImgList);
      //   } else message.error(message);
      // }

      const customRequest = ({ file, headers, data, withCredentials, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
        console.log(file);
        imageApi
          .uploadImage({
            data: {
              image: file.file as File,
              ...data,
            },
            headers,
            withCredentials,
            onUploadProgress: ({ loaded, total }) => {
              onProgress({ percent: Math.ceil((loaded / total) * 100) });
            },
          })
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

      return {
        ...toRefs(state),
        uploadHeaders,
        uploadData,
        // uploadAction,
        // finish,
        // preview,
        // remove,
        // // eslint-disable-next-line vue/no-dupe-keys
        // maxNumber: props.maxNumber,
        // // eslint-disable-next-line vue/no-dupe-keys
        // helpText: props.helpText,
        // // eslint-disable-next-line vue/no-dupe-keys
        // showRemoveButton: props.showRemoveButton,
        // beforeUpload,
        // getCSSProperties,
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
