import { ApiPaginateParams } from '../../common';
import { ApiUserId } from '../capital/user';

/**
 * @description: 支付宝账单查询传参
 */
export type ApiAliPaySearchParams = {
  // 交易对方
  tradeOtherPerson?: string;
  // 流入/流出
  inflowOrOutflow?: number;
  // 账单类型
  billType?: number;
  // 账单方式
  billMethod?: number;
};

/**
 * @description: 条件并分页获取支付宝账单列表参数
 */
export type ApiAliPayFindPageData = ApiPaginateParams & ApiAliPaySearchParams;

/**
 * @description: 支付宝账单的id
 */
export interface ApiAliPayId {
  // 支付宝账单id
  aliPayId: string;
}

/**
 * @description: 支付宝账单基础数据字段
 */
export interface ApiAliPayBase {
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

/**
 * @description: 支付宝账单创建数据字段
 */
export interface ApiAliPayCreate {
  // 用户id
  userId: string;
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

/**
 * @description: 支付宝账单数据字段
 */
export interface ApiAliPay extends ApiAliPayBase, ApiAliPayCreate {}

/**
 * @description: 支付宝账单的列表每项
 */
export interface ApiAliPayItem extends ApiAliPayBase, ApiAliPayCreate, ApiAliPayId {}

/**
 * @description: 支付宝账单批量创建项
 */
export type ApiAliPayBatchSaveItem = ApiAliPayBase & Partial<ApiAliPayCreate>;

/**
 * @description: 修改支付宝账单参数
 */
export interface ApiAliPayUpdateData extends ApiAliPayId {
  // 交易对方备注
  tradeOtherPersonRemarks?: string;
  // 流入/流出
  inflowOrOutflow: number;
  // 账单说明
  explain?: string;
  // 使用地点
  place?: string;
  // 账单方式
  billMethod: number;
  // 账单类型
  billType: number;
}

/**
 * @description: 批量创建支付宝账单参数
 */
export type ApiAliPayBatchSaveData = {
  batches: ApiAliPayBatchSaveItem[];
};

/**
 * @description: 支付宝账单导入数据
 */
export interface ApiAliPayUpload {
  // 交易时间
  tradeTime: string;
  // 交易类型
  tradeType: string;
  // 交易对方
  tradeOtherPerson: string;
  // 对方账号
  oppositeAccount: string;
  // 商品说明
  productDescription: string;
  // 收/支
  incomeOrPay: string;
  // 金额(元)
  moneyAmount: number;
  // 收/付款方式
  paymentMethod: string;
  // 交易状态
  tradeStatus: string;
  // 账单方式
  billMethod: number;
  // 流入/流出
  inflowOrOutflow: number;
  // 账单类型
  billType: number;
}
