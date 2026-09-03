import { ApiPaginateParams } from '../../common';

/**
 * @description: 账单来源类型：bank=银行, aliPay=支付宝, weChat=微信, manual=手写
 */
export type BillSourceType = 'bank' | 'aliPay' | 'weChat' | 'manual';

/**
 * @description: 三表聚合账单列表项
 */
export interface ApiAggregateBillItem {
  // 账单来源
  source: BillSourceType;
  // 账单id（根据 source 对应 bankId/aliPayId/weChatId）
  billId: string;
  // 交易时间
  tradeTime: string;
  // 交易类型
  tradeType: string;
  // 交易对方
  tradeOtherPerson: string;
  // 交易对方备注
  tradeOtherPersonRemarks?: string;
  // 收/支
  incomeOrPay: string;
  // 交易金额
  moneyAmount: number;
  // 其它费用
  otherCost?: number;
  // 流入/流出
  inflowOrOutflow: number;
  // 账单说明
  explain: string;
  // 使用地点
  place: string;
  // 余额
  balance?: number;
  // --- 微信特有 ---
  goods?: string;
  paymentMethod?: string;
  currentStatus?: string;
  remarks?: string;
  // --- 支付宝特有 ---
  productDescription?: string;
  oppositeAccount?: string;
  billType?: number;
  billMethod?: number;
  balanceBaby?: number;
  // --- 银行特有 ---
  bankType?: number;
  voucherType?: number;
  voucherNo?: string;
  tradeOtherPersonAccount?: string;
  bankBillType?: number;
  // --- 银行报废卡信息 ---
  isRetiredBankCard?: boolean;
  bankCardRemark?: string;
  replaceCardNo?: string;
}

/**
 * @description: 三表聚合账单详情
 */
export type ApiAggregateBillDetail = ApiAggregateBillItem;

/**
 * @description: 三表聚合分页查询参数
 */
export interface ApiAggregateBillFindPageData extends ApiPaginateParams {
  // 交易对方/说明 搜索关键词
  tradeOtherPerson?: string;
  // 流入/流出
  inflowOrOutflow?: number;
  // 账单来源（不传则查全部）
  source?: BillSourceType;
  // 开始时间
  startTime?: string;
  // 结束时间
  endTime?: string;
  // 银行类型（source=bank 时有效）
  bankType?: number;
  // 账单类型（微信/支付宝）
  billType?: number;
  // 账单方式（微信/支付宝）
  billMethod?: number;
  // 银行账单类型（source=bank 时有效）
  bankBillType?: number;
}

/**
 * @description: 三表聚合账单修改参数
 */
export interface ApiAggregateBillUpdateData {
  // 账单来源
  source: BillSourceType;
  // 账单id
  billId: string;
  // 交易对方备注
  tradeOtherPersonRemarks?: string;
  // 流入/流出
  inflowOrOutflow: number;
  // 账单说明
  explain?: string;
  // 使用地点
  place?: string;
  // 其它费用（银行）
  otherCost?: number;
  // 银行账单类型（银行）
  bankBillType?: number;
  // 账单类型（微信/支付宝）
  billType?: number;
  // 账单方式（微信/支付宝）
  billMethod?: number;
}
