import { ApiPaginateParams } from './common';

/**
 * @description: 条件并分页获取全局类型列表参数
 */
export interface ApiCategoryFindPageData extends ApiPaginateParams {
  type?: string;
}

/**
 * @description: 创建全局类型参数
 */
export interface ApiCategorySaveData {
  // 全局类型分类
  type: string;

  // 全局类型标识
  value?: number;

  // 全局类型字符串类型的标识
  valueStr?: string;

  // 全局类型名称
  label: string;
}
