import { useUserStoreWidthOut } from '@/store';
import { getUploadImageAction } from '@/utils';
import { UploadCustomRequestOptions, useMessage } from 'naive-ui';
import { ExtractPropTypes, computed, reactive, toRefs } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { COMPONENT_UPLOAD } from '@/constant';

// 上次图片组件 传参
export const FormUploadImageProps = {
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
};

export const useFormUploadImage = (
  props: ExtractPropTypes<typeof FormUploadImageProps>,
  emit: (event: 'uploadChange' | 'delete' | 'update:imageList', ...args: any[]) => void
) => {
  const nMessage = useMessage();

  const state = reactive({
    showModal: false,
    previewUrl: '',
  });

  // 上传文件
  const uploadAction = getUploadImageAction();
  const userStore = useUserStoreWidthOut();
  const uploadHeaders = computed(() => {
    return {
      ...props.headers,
      source: props.source,
      timestamp: new Date().getTime(),
      Authorization: userStore.getCompleteToken,
    };
  });
  const uploadData = computed(() => {
    return {};
  });

  // 自定义导入
  const customRequest = ({ file, headers: oldHeaders, data, withCredentials, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
    const formData = new FormData();
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
      });
    }
    formData.append('image', file.file as File);
    const headers = { ...oldHeaders, 'Content-Type': 'multipart/form-data' };
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
        const infoField = COMPONENT_UPLOAD.apiInfoField;
        const imgField = COMPONENT_UPLOAD.apiImgField;
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
                    url,
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
};
