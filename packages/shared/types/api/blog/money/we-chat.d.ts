import { ApiPaginateParams } from '../../common';
import { ApiUserId } from '../capital/user';

/**
 * @description: 微信账单查询传参
 */
export type ApiWeChatSearchParams = {
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
 * @description: 条件并分页获取微信账单列表参数
 */
export type ApiWeChatFindPageData = ApiPaginateParams & ApiWeChatSearchParams;

/**
 * @description: 微信账单的id
 */
export interface ApiWeChatId {
  // 微信账单id
  weChatId: string;
}

/**
 * @description: 微信账单基础数据字段
 */
export interface ApiWeChatBase {
  // 交易时间
  tradeTime: string;
  // 交易类型
  tradeType: string;
  // 交易对方
  tradeOtherPerson: string;
  // 交易对方备注
  tradeOtherPersonRemarks: string;
  // 商品
  goods: string;
  // 收/支
  incomeOrPay: string;
  // 金额(元)
  moneyAmount: number;
  // 其它费用
  otherCost: number;
  // 支付方式
  paymentMethod: string;
  // 当前状态
  currentStatus: string;
  // 备注
  remarks: string;
  // 账单说明
  explain: string;
  // 使用地点
  place: string;
}

/**
 * @description: 微信账单创建数据字段
 */
export interface ApiWeChatCreate {
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
}

/**
 * @description: 微信账单数据字段
 */
export interface ApiWeChat extends ApiWeChatBase, ApiWeChatCreate {}

/**
 * @description: 微信账单的列表每项
 */
export interface ApiWeChatItem extends ApiWeChatBase, ApiWeChatCreate, ApiWeChatId {}

/**
 * @description: 微信账单批量创建项
 */
export type ApiWeChatBatchSaveItem = ApiWeChatBase & Partial<ApiWeChatCreate>;

/**
 * @description: 修改微信账单参数
 */
export interface ApiWeChatUpdateData extends ApiWeChatId {
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
 * @description: 批量创建微信账单参数
 */
export type ApiWeChatBatchSaveData = {
  batches: ApiWeChatBatchSaveItem[];
};

/**
 * @description: 微信账单导入数据
 */
export interface ApiWeChatUpload {
  // 交易时间
  tradeTime: string;
  // 交易类型
  tradeType: string;
  // 交易对方
  tradeOtherPerson: string;
  // 商品
  goods: string;
  // 收/支
  incomeOrPay: string;
  // 金额(元)
  moneyAmount: number;
  // 支付方式
  paymentMethod: string;
  // 当前状态
  currentStatus: string;
  // 备注
  remarks: string;
  // 账单方式
  billMethod: number;
  // 流入/流出
  inflowOrOutflow: number;
  // 账单类型
  billType: number;
}
