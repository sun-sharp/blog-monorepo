import { ApiPaginateParams } from './common';

/**
 * @description: 分页参数
 */
export interface ApiFindPageData extends ApiPaginateParams {
  type?: string;
}

/**
 * @description: 保存参数
 */
export interface ApiSaveData {
  // 全局类型分类
  type: string;

  // 全局类型标识
  value?: number;

  // 全局类型字符串类型的标识
  valueStr?: string;

  // 全局类型名称
  label: string;
}
