import { useEnvSetting } from '@/hooks/setting';

const envSetting = useEnvSetting();

//组装完整图片地址
export const getImgUrl = (url: string): string => {
  const { imgUrl } = envSetting;
  return /(^http|https:\/\/)/g.test(url) ? url : `${imgUrl}${url}`;
};
