import { ApiPaginateParams } from './common';

/**
 * @description: 全局类型查询传参
 */
export type ApiCategorySearchParams = {
  type?: string;
};

/**
 * @description: 条件并分页获取全局类型列表参数
 */
export type ApiCategoryFindPageData = ApiPaginateParams & ApiCategorySearchParams;

/**
 * @description: 全局类型的id
 */
export interface ApiCategoryId {
  // 用户id
  categoryId: string;
}

/**
 * @description: 用户的数据字段
 */
export interface ApiCategory {
  // 全局类型分类
  type: string;

  // 全局类型标识
  value?: number;

  // 全局类型字符串类型的标识
  valueStr?: string;

  // 全局类型名称
  label: string;
}

/**
 * @description: 创建全局类型参数
 */
export type ApiCategorySaveData = ApiCategory;

/**
 * @description: 修改全局类型参数
 */
export interface ApiCategoryUpdateData extends ApiCategorySaveData, ApiCategoryId {}

/**
 * @description: 用户的列表每项
 */
export interface ApiCategoryItem extends ApiCategory, ApiCategoryId {}
