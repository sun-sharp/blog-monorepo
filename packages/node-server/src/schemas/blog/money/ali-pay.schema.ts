import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 支付宝账单数据字段
 * @export
 * @class AliPay
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class AliPay extends Document {
  // 用户id
  @Prop()
  userId: string;

  // 交易时间
  @Prop()
  tradeTime: Date;

  // 交易类型
  @Prop()
  tradeType: string;

  // 交易对方
  @Prop()
  tradeOtherPerson: string;

  // 交易对方备注
  @Prop()
  tradeOtherPersonRemarks: string;

  // 商品说明
  @Prop()
  productDescription: string;

  // 收/支
  @Prop()
  incomeOrPay: string;

  // 金额(元)
  @Prop()
  moneyAmount: number;

  // 其它费用
  @Prop()
  otherCost: number;

  // 收/付款方式
  @Prop()
  paymentMethod: string;

  // 对方账号
  @Prop()
  oppositeAccount: string;

  // 流入/流出
  @Prop()
  inflowOrOutflow: number;

  // 账单说明
  @Prop()
  explain: string;

  // 使用地点
  @Prop()
  place: string;

  // 账单类型
  @Prop()
  billType: number;

  // 账单方式
  @Prop()
  billMethod: number;

  // 余额
  @Prop()
  balance: number;

  // 余额宝
  @Prop()
  balanceBaby: number;
}

export const AliPaySchema = SchemaFactory.createForClass(AliPay);
