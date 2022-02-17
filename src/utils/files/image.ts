import { getAppEnvConfig } from '@/utils/env';

const appEnvConfig = getAppEnvConfig();

//组装完整图片地址
export const getImgUrl = (url: string): string => {
  const { imgUrl } = appEnvConfig;
  return /(^http|https:\/\/)/g.test(url) ? url : `${imgUrl}/${url}`;
};

// 上传接口路径
export const getUploadAction = (): string => {
  const { fileApiUrl } = appEnvConfig;
  return `${fileApiUrl}/image/upload`;
};
