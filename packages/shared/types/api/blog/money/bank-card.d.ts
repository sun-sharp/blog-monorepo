import { ApiPaginateParams } from '../../common';
import { ApiUserId } from '../capital/user';

/** 银行卡片状态 */
export enum BankCardStatus {
  // 在用
  inUse = 1,
  // 已报废
  retired = 2,
}

/** 银行卡片 ID */
export interface ApiBankCardId {
  bankCardId: string;
}

/** 银行卡片字段 */
export interface BankCardFields {
  // 银行类型(1-5)
  bankType: number;
  // 凭证类型(1存折/2储蓄卡/3信用卡)
  voucherType: number;
  // 本卡号（对应 bank.voucherNo）
  cardNo: string;
  // 状态：1=在用, 2=已报废
  status: number;
  // 说明/备注
  cardRemark: string;
  // 换卡后的新卡号（直接报废则空）
  replaceCardNo?: string;
  // 本卡由旧卡替换而来
  oldCardNo?: string;
  // 换卡/报废时间
  replaceTime?: string;
}

/** 银行卡片创建数据 */
export type ApiBankCardCreate = BankCardFields & ApiUserId;

/** 银行卡片列表项 */
export type ApiBankCardItem = BankCardFields & ApiBankCardId;

/** 修改银行卡片 */
export type ApiBankCardUpdateData = ApiBankCardId & Partial<Omit<BankCardFields, 'cardNo'>>;

/** 银行卡片查询参数 */
export type ApiBankCardSearchParams = Partial<
  Pick<BankCardFields, 'bankType' | 'cardNo' | 'status'>
>;

/** 分页查询参数 */
export type ApiBankCardFindPageData = ApiPaginateParams & ApiBankCardSearchParams;