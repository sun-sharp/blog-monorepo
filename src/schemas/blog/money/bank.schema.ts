import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 银行账单数据字段
 * @export
 * @class Bank
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Bank extends Document {
  // 用户id
  @Prop()
  userId: string;

  // 交易时间
  @Prop()
  tradeTime: Date;

  // 交易类型
  @Prop()
  tradeType: string;

  // 银行类型
  @Prop()
  bankType: number;

  // 凭证类型
  @Prop()
  voucherType: number;

  // 凭证号码
  @Prop()
  voucherNo: string;

  // 交易对方
  @Prop()
  tradeOtherPerson: string;

  // 交易对方账号
  @Prop()
  tradeOtherPersonAccount: string;

  // 交易对方备注
  @Prop()
  tradeOtherPersonRemarks: string;

  // 收/支
  @Prop()
  incomeOrPay: string;

  // 交易金额
  @Prop()
  moneyAmount: number;

  // 余额
  @Prop()
  balance: number;

  // 其它费用
  @Prop()
  otherCost: number;

  // 流入/流出
  @Prop()
  inflowOrOutflow: number;

  // 账单说明
  @Prop()
  explain: string;

  // 使用地点
  @Prop()
  place: string;

  // 银行账单类型
  @Prop()
  bankBillType: number;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
