/**
 * @description: 账单导入列表查询传参
 */
export type ApiBillUploadSearchParams = {};

/**
 * @description: 条件并分页获取账单导入列表参数
 */
export type ApiBillUploadFindPageData = ApiPaginateParams & ApiBillUploadSearchParams;

/**
 * @description: 账单导入的id
 */
export interface ApiBillUploadId {
  // 账单导入id
  billUploadId: string;
}

/**
 * @description: 账单导入的数据字段
 */
export interface ApiBillUpload {
  // 账单导入类型
  billUploadType: number;

  // 账单判断字段
  billJudgeKey: string;

  // 需处理类型
  handleType: number;

  // 流入/流出
  inflowOrOutflow?: number;

  // 账单类型
  billType?: number;

  // 账单方式
  billMethod?: number;

  // 判断方式
  judgeWay: string;

  // 判断取值
  judgeVal: Array<string>;
}

/**
 * @description: 创建账单导入参数
 */
export type ApiBillUploadSaveData = ApiBillUpload;

/**
 * @description: 修改账单导入参数
 */
export interface ApiBillUploadUpdateData extends ApiBillUploadSaveData, ApiBillUploadId {}

/**
 * @description: 账单导入的列表每项
 */
export interface ApiBillUploadItem extends ApiBillUpload, ApiBillUploadId {}
