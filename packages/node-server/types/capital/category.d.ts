/**
 * @description: 全局类型的id
 */
export interface ApiCategoryId {
  // 全局类型id
  categoryId: string;
}

/**
 * @description: 全局类型数据字段
 */
export interface ApiCategory {
  // 全局类型分类
  type: string;

  // 全局类型标识
  value: number;

  // 全局类型字符串类型的标识
  valueStr: string;

  // 全局类型名称
  label: string;
}

/**
 * @description: 全局类型的列表每项
 */
export interface ApiCategoryItem extends ApiCategory, ApiCategoryId {}
