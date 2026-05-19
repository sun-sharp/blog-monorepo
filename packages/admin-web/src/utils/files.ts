import { APP_ENV_CONFIG } from '@/constant';

export { getImgUrl } from '@shared/utils/files';

// 上传图片接口路径
export const getUploadImageAction = (): string => {
  const { capitalApiUrl } = APP_ENV_CONFIG;
  return `${capitalApiUrl}/image/upload`;
};

// 上传微信账单接口路径
export const getUploadWeCharAction = (): string => {
  const { blogApiUrl } = APP_ENV_CONFIG;
  return `${blogApiUrl}/money/we-chat/upload`;
};

// 上传支付宝账单接口路径
export const getUploadAliPayAction = (): string => {
  const { blogApiUrl } = APP_ENV_CONFIG;
  return `${blogApiUrl}/money/ali-pay/upload`;
};

// 上传银行账单接口路径
export const getUploadBankAction = (): string => {
  const { blogApiUrl } = APP_ENV_CONFIG;
  return `${blogApiUrl}/money/bank/upload`;
};
