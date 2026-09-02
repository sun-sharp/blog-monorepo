export const arrEnumToObj = (
  arr: Array<any>,
  value: string = 'value',
  label: string = 'label',
): {
  [x: string]: string | number;
} => {
  const obj: any = {};
  arr.forEach((item) => {
    obj[item[value]] = item[label];
  });
  return obj;
};

export const isArrayEqual = (
  arr1: Array<string | number>,
  arr2: Array<string | number>,
): boolean => {
  return arr1.join(',') === arr2.join(',');
};

/**
 * 创建一个基于类型值哈希取模的资源分配器
 * @param pool 资源池（任意类型数组）
 * @param hashFn 可选的自定义哈希函数，用于将字符串转为数字，默认使用简单哈希
 * @returns 函数 (type: string) => T，根据类型值返回固定资源
 */
export function createTypeMapper<T>(
  pool: T[],
  hashFn?: (str: string) => number,
): (type: string) => T {
  const cache: Record<string, T> = {};
  const defaultHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // 转为32位整数
    }
    return Math.abs(hash);
  };
  const hash = hashFn || defaultHash;

  return (type: string): T => {
    if (!cache[type]) {
      const idx = hash(type) % pool.length;
      cache[type] = pool[idx];
    }
    return cache[type];
  };
}
