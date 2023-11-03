import { useUserStoreWidthOut } from '@/store';
import { UploadCustomRequestOptions, useMessage } from 'naive-ui';
import { ExtractPropTypes, computed } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';

// 上次文件组件 传参
export const FormUploadExcelProps = {
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
};

// 上次文件组件
export const useFormUploadExcel = (
  props: ExtractPropTypes<typeof FormUploadExcelProps>,
  emit: (event: 'update:fileList' | 'uploadChange', ...args: any[]) => void
) => {
  const nMessage = useMessage();

  // 上传文件
  const uploadAction = computed(() => {
    return props.action;
  });
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

  // 自定义导入
  const customRequest = ({ file, headers: oldHeaders, data, withCredentials, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
    const formData = new FormData();
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
      });
    }
    formData.append('file', file.file as File);
    const headers = { ...oldHeaders, 'Content-Type': 'multipart/form-data' };
    axios
      .request({
        url: uploadAction.value as string,
        method: 'POST',
        data: formData,
        withCredentials,
        headers,
        onUploadProgress: ({ loaded, total = 1 }) => {
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
    uploadHeaders,
    uploadData,
    customRequest,
  };
};
