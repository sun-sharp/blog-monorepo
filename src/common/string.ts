// 过滤掉\n，空格
export const filterStr = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str.replace(/\n/g, '').replace(/[ ]/g, '');
};
