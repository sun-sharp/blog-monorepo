import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 手写账单数据字段
 * @export
 * @class ManualBill
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class ManualBill extends Document {
  // 用户id
  @Prop()
  userId: string;

  // 交易时间
  @Prop()
  tradeTime: Date;

  // 交易类型（可选占位）
  @Prop()
  tradeType: string;

  // 交易对方
  @Prop()
  tradeOtherPerson: string;

  // 收/支（可选占位）
  @Prop()
  incomeOrPay: string;

  // 交易金额
  @Prop()
  moneyAmount: number;

  // 其它费用（可选）
  @Prop()
  otherCost: number;

  // 支付方式：1=现金, 2=美团, 3=京东, 4=华为钱包
  @Prop()
  manualPaymentMethod: number;

  // 余额
  @Prop()
  balance: number;

  // 流入/流出
  @Prop()
  inflowOrOutflow: number;

  // 账单说明
  @Prop()
  explain: string;

  // 交易场所
  @Prop()
  place: string;

  // 账单类型
  @Prop()
  billType: number;

  // 账单方式
  @Prop()
  billMethod: number;
}

export const ManualBillSchema = SchemaFactory.createForClass(ManualBill);
