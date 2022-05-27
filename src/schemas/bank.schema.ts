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
  @Prop()
  userId: string; // 用户id

  @Prop()
  tradeTime: string; // 交易时间

  @Prop()
  tradeType: string; // 交易类型

  @Prop()
  bankType: number; // 银行类型

  @Prop()
  voucherType: number; // 凭证类型

  @Prop()
  voucherNo: string; // 凭证号码

  @Prop()
  tradeOtherPerson: string; // 交易对方

  @Prop()
  tradeOtherPersonAccount: string; // 交易对方账号

  @Prop()
  tradeOtherPersonRemarks: string; // 交易对方备注

  @Prop()
  incomeOrPay: string; // 收/支

  @Prop()
  moneyAmount: number; // 交易金额

  @Prop()
  balance: number; // 余额

  @Prop()
  otherCost: number; // 其它费用

  @Prop()
  inflowOrOutflow: number; // 流入/流出

  @Prop()
  explain: string; // 账单说明

  @Prop()
  place: string; // 使用地点

  @Prop()
  bankBillType: number; // 银行账单类型
}

export const BankSchema = SchemaFactory.createForClass(Bank);
