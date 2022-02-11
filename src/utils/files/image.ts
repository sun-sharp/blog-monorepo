import { useGlobSetting } from '@/hooks/setting';

const globSetting = useGlobSetting();

//组装完整图片地址
export const getImgUrl = (url: string): string => {
  const { imgUrl } = globSetting;
  return /(^http|https:\/\/)/g.test(url) ? url : `${imgUrl}${url}`;
};
