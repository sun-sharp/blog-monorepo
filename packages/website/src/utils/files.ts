//组装完整图片地址
export const getImgUrl = (url: string): string => {
  if (!url) return '';
  if (/(^http|https:\/\/)/g.test(url)) return url;
  return `https://www.yangruirui.top${url}`;
};
