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
  @Prop()
  userId: string; // 用户id

  @Prop()
  tradeTime: string; // 交易时间

  @Prop()
  transactionClassification: string; // 交易分类

  @Prop()
  tradeOtherPerson: string; // 交易对方

  @Prop()
  tradeOtherPersonRemarks: string; // 交易对方备注

  @Prop()
  productDescription: string; // 商品说明

  @Prop()
  incomeOrPay: string; // 收/支

  @Prop()
  moneyAmount: string; // 金额

  @Prop()
  paymentMethod: string; // 收/付款方式

  @Prop()
  oppositeAccount: string; // 对方账号

  @Prop()
  inflowOrOutflow: number; // 流入/流出

  @Prop()
  explain: string; // 账单说明

  @Prop()
  place: string; // 使用地点

  @Prop()
  billType: number; // 账单类型
}

export const AliPaySchema = SchemaFactory.createForClass(AliPay);
