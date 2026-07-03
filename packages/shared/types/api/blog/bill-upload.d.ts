import { ApiPaginateParams } from '/#/api/common';

/**
 * @description: 账单导入的id
 */
export interface ApiBillUploadId {
  // 账单导入id
  billUploadId: string;
}

// 基础字段映射
export interface BillUploadFields {
// 账单导入类型
  billUploadType: number;

  // 需处理类型
  handleType: string;

  // 流入/流出
  inflowOrOutflow: number;

  // 账单类型
  billType: number;

  // 账单方式
  billMethod: number;

  // 代码
  code: string;
}

// 必需的API键
export type RequiredApiKeys = 'billUploadType' | 'handleType' | 'code';

// 可选的API键
export type OptionalApiKeys = Exclude<keyof BillUploadFields, RequiredApiKeys>;

/**
 * @description: 账单导入的数据字段
 * API 接口：必填字段直接使用类型，可选字段添加 ? 修饰
 */
export type ApiBillUpload = {
  [K in RequiredApiKeys]: BillUploadFields[K];
} & {
  [K in OptionalApiKeys]?: BillUploadFields[K];
};

/**
 * @description: 创建账单导入参数
 */
export type ApiBillUploadSaveData = ApiBillUpload;

/**
 * @description: 修改账单导入参数
 */
export type ApiBillUploadUpdateData = ApiBillUploadSaveData & ApiBillUploadId;

/**
 * @description: 账单导入的列表每项
 */
export type ApiBillUploadItem = ApiBillUpload & ApiBillUploadId;


/**
 * @description: 账单导入列表查询传参
 */

export type ApiBillUploadSearchParams = Partial<Pick<BillUploadFields, 'billUploadType' | 'handleType'>>;

/**
 * @description: 条件并分页获取账单导入列表参数
 */
export type ApiBillUploadFindPageData = ApiPaginateParams & ApiBillUploadSearchParams;
