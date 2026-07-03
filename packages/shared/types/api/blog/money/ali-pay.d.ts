import { ApiPaginateParams } from '../../common';
import { ApiUserId } from '../capital/user';

/** 支付宝账单基础交易字段（对应 ApiAliPayBase） */
export interface AliPayBaseFields {
  // 交易时间
  tradeTime: string;
  // 交易类型
  tradeType: string;
  // 交易对方
  tradeOtherPerson: string;
  // 交易对方备注
  tradeOtherPersonRemarks: string;
  // 商品说明
  productDescription: string;
  // 收/支
  incomeOrPay: string;
  // 金额(元)
  moneyAmount: number;
  // 其它费用
  otherCost: number;
  // 收/付款方式
  paymentMethod: string;
  // 对方账号
  oppositeAccount: string;
  // 账单说明
  explain: string;
  // 使用地点
  place: string;
}

/** 支付宝账单创建/系统字段（不含 userId） */
export interface AliPayCreateFields {
  // 流入/流出
  inflowOrOutflow: number;
  // 账单类型
  billType: number;
  // 账单方式
  billMethod: number;
  // 余额
  balance: number;
  // 余额宝
  balanceBaby: number;
}

/** 支付宝账单 ID */
export interface ApiAliPayId {
  aliPayId: string;
}

/** 支付宝账单基础数据字段 */
export type ApiAliPayBase = AliPayBaseFields;

/** 支付宝账单创建数据字段（关联用户ID） */
export type ApiAliPayCreate = AliPayCreateFields & ApiUserId;

/** 支付宝账单完整数据 */
export type ApiAliPay = ApiAliPayBase & ApiAliPayCreate;

/** 支付宝账单列表项（含ID） */
export type ApiAliPayItem = ApiAliPayBase & ApiAliPayCreate & ApiAliPayId;

/** 支付宝账单批量创建项（基础字段 + 部分创建字段可选） */
export type ApiAliPayBatchSaveItem = AliPayBaseFields &
  Partial<AliPayCreateFields>;

/** 批量创建参数 */
export type ApiAliPayBatchSaveData = {
  batches: ApiAliPayBatchSaveItem[];
};

/** 修改支付宝账单参数 */
export type ApiAliPayUpdateData = ApiAliPayId &
  Partial<
    Pick<AliPayBaseFields, 'tradeOtherPersonRemarks' | 'explain' | 'place'>
  > &
  Pick<AliPayCreateFields, 'inflowOrOutflow' | 'billMethod' | 'billType'>;

/** 支付宝账单导入数据（从基础字段和创建字段中选取，并额外包含 tradeStatus） */
export type ApiAliPayUpload = Pick<
  AliPayBaseFields,
  | 'tradeTime'
  | 'tradeType'
  | 'tradeOtherPerson'
  | 'oppositeAccount'
  | 'productDescription'
  | 'incomeOrPay'
  | 'moneyAmount'
  | 'paymentMethod'
> &
  Pick<AliPayCreateFields, 'billMethod' | 'inflowOrOutflow' | 'billType'> & {
    // 交易状态（仅在导入数据中存在）
    tradeStatus: string;
  };

/** 支付宝账单查询参数（部分字段可选） */
export type ApiAliPaySearchParams = Partial<
  Pick<AliPayCreateFields, 'inflowOrOutflow' | 'billType' | 'billMethod'> &
    Pick<AliPayBaseFields, 'tradeOtherPerson'>
>;

/** 分页查询参数 */
export type ApiAliPayFindPageData = ApiPaginateParams & ApiAliPaySearchParams;