import { ApiPaginateParams } from '../../common';
import { ApiUserId } from '../capital/user';

/** 手写账单基础交易字段 */
export interface ManualBillBaseFields {
  // 交易时间
  tradeTime: string;
  // 交易对方
  tradeOtherPerson: string;
  // 交易金额
  moneyAmount: number;
  // 余额
  balance: number;
  // 账单说明
  explain: string;
  // 交易场所
  place: string;
  // 收/支（可选占位）
  incomeOrPay?: string;
  // 交易类型（可选占位）
  tradeType?: string;
  // 其它费用（可选占位）
  otherCost?: number;
}

/** 手写账单创建/系统字段（不含 userId） */
export interface ManualBillCreateFields {
  // 流入/流出
  inflowOrOutflow: number;
  // 账单类型
  billType: number;
  // 账单方式
  billMethod: number;
}

/** 手写账单 ID */
export interface ApiManualBillId {
  manualBillId: string;
}

/** 手写账单基础数据字段 */
export type ApiManualBillBase = ManualBillBaseFields;

/** 手写账单创建数据字段（关联用户ID） */
export type ApiManualBillCreate = ManualBillCreateFields & ApiUserId;

/** 手写账单保存数据字段（基础 + 创建字段，不含ID） */
export type ApiManualBillSaveData = ManualBillBaseFields & ManualBillCreateFields;

/** 手写账单完整数据 */
export type ApiManualBill = ManualBillBaseFields & ManualBillCreateFields;

/** 手写账单列表项（含ID） */
export type ApiManualBillItem = ManualBillBaseFields & ManualBillCreateFields & ApiManualBillId;

/** 修改手写账单参数 */
export type ApiManualBillUpdateData = ApiManualBillId &
  Partial<
    Pick<
      ManualBillBaseFields,
      'tradeTime' | 'tradeOtherPerson' | 'moneyAmount' | 'balance' | 'explain' | 'place' | 'incomeOrPay' | 'tradeType' | 'otherCost'
    >
  > &
  Pick<ManualBillCreateFields, 'inflowOrOutflow' | 'billMethod' | 'billType'>;

/** 手写账单查询参数（部分字段可选） */
export type ApiManualBillSearchParams = Partial<
  Pick<ManualBillCreateFields, 'inflowOrOutflow' | 'billType' | 'billMethod'> &
    Pick<ManualBillBaseFields, 'tradeOtherPerson'>
>;

/** 分页查询参数 */
export type ApiManualBillFindPageData = ApiPaginateParams & ApiManualBillSearchParams;