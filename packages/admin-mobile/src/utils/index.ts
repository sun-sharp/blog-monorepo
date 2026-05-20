import { APP_ENV_CONFIG } from '@/constant';
export * from '@shared/utils/index';

export const getUploadImageAction = (): string => {
  const { capitalApiUrl } = APP_ENV_CONFIG;
  return `${capitalApiUrl}/image/upload`;
};

export const getUploadWeCharAction = (): string => {
  const { blogApiUrl } = APP_ENV_CONFIG;
  return `${blogApiUrl}/money/we-chat/upload`;
};

export const getUploadAliPayAction = (): string => {
  const { blogApiUrl } = APP_ENV_CONFIG;
  return `${blogApiUrl}/money/ali-pay/upload`;
};

export const getUploadBankAction = (): string => {
  const { blogApiUrl } = APP_ENV_CONFIG;
  return `${blogApiUrl}/money/bank/upload`;
};
