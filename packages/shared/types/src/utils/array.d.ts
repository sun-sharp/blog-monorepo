export declare const arrEnumToObj: (arr: Array<any>, value?: string, label?: string) => {
    [x: string]: string | number;
};
export declare const isArrayEqual: (arr1: Array<string | number>, arr2: Array<string | number>) => boolean;
/**
 * 创建一个基于类型值哈希取模的资源分配器
 * @param pool 资源池（任意类型数组）
 * @param hashFn 可选的自定义哈希函数，用于将字符串转为数字，默认使用简单哈希
 * @returns 函数 (type: string) => T，根据类型值返回固定资源
 */
export declare function createTypeMapper<T>(pool: T[], hashFn?: (str: string) => number): (type: string) => T;
//# sourceMappingURL=array.d.ts.map