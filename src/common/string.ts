// 过滤掉\n，空格
export const filterStr = (str: any): string => {
  if (typeof str !== 'string') {
    return str ? String(str) : '';
  }
  return str.replace(/\n/g, '').replace(/[ ]/g, '');
};
