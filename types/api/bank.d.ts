import { ApiPaginateParams } from './common';
import { ApiUserId } from './user';

/**
 * @description: 全局类型查询传参
 */
export type ApiBankSearchParams = {
  // 交易对方
  tradeOtherPerson?: string;
  // 流入/流出
  inflowOrOutflow?: number;
  // 银行类型
  bankType?: number;
  // 银行账单类型
  bankBillType?: number;
};

/**
 * @description: 条件并分页获取全局类型列表参数
 */
export type ApiBankFindPageData = ApiPaginateParams & ApiBankSearchParams;

/**
 * @description: 银行账单的id
 */
export interface ApiBankId {
  // 银行账单id
  bankId: string;
}

/**
 * @description: 银行账单数据字段
 */
export interface ApiBankBase {
  // 交易时间
  tradeTime: string;

  // 交易类型
  tradeType: string;

  // 银行类型
  bankType: number;

  // 凭证类型
  voucherType: number;

  // 凭证号码
  voucherNo: string;

  // 交易对方
  tradeOtherPerson: string;

  // 交易对方账号
  tradeOtherPersonAccount: string;

  // 交易对方备注
  tradeOtherPersonRemarks: string;

  // 收/支
  incomeOrPay: string;

  // 交易金额
  moneyAmount: number;

  // 余额
  balance: number;

  // 其它费用
  otherCost: number;

  // 账单说明
  explain: string;

  // 使用地点
  place: string;
}

/**
 * @description: 微信账单创建数据字段
 */
export interface ApiBankCreate {
  // 流入/流出
  inflowOrOutflow: number;

  // 银行账单类型
  bankBillType: number;
}

/**
 * @description: 银行账单的列表每项
 */
export type ApiBankItem = ApiBankBase & ApiBankCreate & ApiBankId & ApiUserId;

/**
 * @description: 支付宝账单创建单个参数
 */
export type ApiBankBatchSaveItem = ApiBankBase & Partial<ApiBankCreate>;

/**
 * @description: 批量创建支付宝账单参数
 */
export type ApiBankBatchSaveData = {
  batches: ApiBankBatchSaveItem[];
};

/**
 * @description: 修改支付宝账单参数
 */
export interface ApiBankUpdateData extends ApiBankId {
  otherCost: number;
  tradeOtherPersonRemarks: string;
  inflowOrOutflow: number;
  explain: string;
  place: string;
  bankBillType: number;
}
