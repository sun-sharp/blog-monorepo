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
  // 账单导入类型：1=微信账单, 2=支付宝账单, 3=银行账单
  billUploadType: number;

  // 需处理类型：'inflowOrOutflow'=流入/流出, 'billType'=账单类型, 'billMethod'=账单方式
  handleType: string;

  // 流入/流出：1=流入, 2=流出（handleType 为 inflowOrOutflow 时使用）
  inflowOrOutflow: number;

  // 账单类型：系统定义的账单分类编号，如餐饮、交通等（handleType 为 billType 时使用）
  billType: number;

  // 账单方式：系统定义的支付方式编号，如微信零钱、银行卡等（handleType 为 billMethod 时使用）
  billMethod: number;

  // 代码：判断条件，以 isAssignment 开头的 boolean 表达式，item 为账单数据
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
