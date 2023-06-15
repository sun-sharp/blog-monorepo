import { getAppEnvConfig } from '@/utils/env';

const appEnvConfig = getAppEnvConfig();

//组装完整图片地址
export const getImgUrl = (url: string): string => {
  const { imgUrl } = appEnvConfig;
  return /(^http|https:\/\/)/g.test(url) ? url : `${imgUrl}/${url}`;
};

// 上传图片接口路径
export const getUploadImageAction = (): string => {
  const { capitalApiUrl } = appEnvConfig;
  return `${capitalApiUrl}/image/upload`;
};

// 上传微信账单接口路径
export const getUploadWeCharAction = (): string => {
  const { moneyApiUrl } = appEnvConfig;
  return `${moneyApiUrl}/we-chat/upload`;
};

// 上传支付宝账单接口路径
export const getUploadAliPayAction = (): string => {
  const { moneyApiUrl } = appEnvConfig;
  return `${moneyApiUrl}/ali-pay/upload`;
};

// 上传银行账单接口路径
export const getUploadBankAction = (): string => {
  const { moneyApiUrl } = appEnvConfig;
  return `${moneyApiUrl}/bank/upload`;
};
