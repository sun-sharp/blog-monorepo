/**
 * @description: 过滤掉\n，空格
 * @param {any} str
 * @return {string}
 */
export const filterStr = (str: any): string => {
  if (typeof str !== 'string') {
    return str ? String(str) : '';
  }
  return str.replace(/\n/g, '').replace(/[ ]/g, '');
};

/**
 * @description: 处理数据为字符串，null和undefined转换为''
 * @param {any} val
 * @return {string}
 */
export const safeString = (val: any): string => {
  return val != null ? String(val) : '';
};

/**
 * @description: 可以执行字符串里的代码的方法
 * @param {string} code
 * @param {Record<string, any>} [scope]
 * @return {any}
 */
export const runCode = (code: string, scope?: Record<string, any>): any => {
  if (!scope) {
    return eval(code);
  }

  const keys = Object.keys(scope);
  const values = Object.values(scope);

  const fn = new Function(...keys, code + ';return { __values__: [' + keys.join(',') + '], __keys__: [' + keys.map((k) => `'${k}'`).join(',') + '] };');

  const res = fn(...values);
  const resultObj: Record<string, any> = {};
  res.__keys__.forEach((k: string, i: number) => {
    resultObj[k] = res.__values__[i];
  });
  return resultObj;
};
