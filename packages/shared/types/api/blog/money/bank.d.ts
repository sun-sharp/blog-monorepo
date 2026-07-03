import { ApiPaginateParams } from '../../common';
import { ApiUserId } from '../capital/user';

/** 银行账单基础交易字段 */
export interface BankBaseFields {
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

export interface BankCreateFields {
    // 流入/流出
  inflowOrOutflow: number;
  // 银行账单类型
  bankBillType: number;
}

/** 银行账单 ID */
export interface ApiBankId {
  bankId: string;
}

/**
 * @description: 银行账单基础数据字段
 */
export type ApiBankBase = BankBaseFields;

/**
 * @description: 银行账单创建数据字段（关联用户ID）
 */
export type ApiBankCreate = BankCreateFields & ApiUserId;

/**
 * @description: 银行账单数据字段
 */
export type ApiBank = ApiBankBase & ApiBankCreate;

/**
 * @description: 银行账单的列表每项
 */
export type ApiBankItem = ApiBankBase & ApiBankCreate & ApiBankId;

/**
 * @description: 银行账单批量创建项
 */
export type ApiBankBatchSaveItem = BankBaseFields & Partial<BankCreateFields>;

/**
 * @description: 批量创建银行账单参数
 */
export type ApiBankBatchSaveData = {
  batches: ApiBankBatchSaveItem[];
};

/**
 * @description: 修改银行账单参数
 */
export type ApiBankUpdateData = ApiBankId &
  Pick<BankBaseFields, 'otherCost' | 'tradeOtherPersonRemarks' | 'explain' | 'place'> &
  Pick<BankCreateFields, 'inflowOrOutflow' | 'bankBillType'>;

/**
 * @description: 银行账单导入数据
 */
export type ApiBankUpload = BankBaseFields & BankCreateFields;

/**
 * @description: 银行账单查询传参
 */
export type ApiBankSearchParams = Partial<
  Pick<BankBaseFields, 'tradeOtherPerson' | 'bankType'> &
    Pick<BankCreateFields, 'inflowOrOutflow' | 'bankBillType'>
>;

/**
 * @description: 条件并分页获取银行账单列表参数
 */
export type ApiBankFindPageData = ApiPaginateParams & ApiBankSearchParams;