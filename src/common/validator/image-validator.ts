export const httpOrHttpsReg = /(^http|https:\/\/)/g;

/**
 * @description: 验证图片是否带有http或https
 * @param {string} url
 * @return {*}
 */
export const imageIsHasHttpOrHttps = (url: string): boolean => {
  return httpOrHttpsReg.test(url);
};
