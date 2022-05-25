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
  incomeOrPay: string; // 收/支

  @Prop()
  tradeOtherPerson: string; // 交易对方

  @Prop()
  oppositeAccount: string; // 对方账号

  @Prop()
  productDescription: string; // 商品说明

  @Prop()
  paymentMethod: string; // 收/付款方式

  @Prop()
  moneyAmount: number; // 金额

  @Prop()
  transactionClassification: string; // 交易分类

  @Prop()
  transactionNo: string; // 交易订单号

  @Prop()
  merchantNo: string; // 商户订单号

  @Prop()
  tradeTime: string; // 交易时间
}

export const AliPaySchema = SchemaFactory.createForClass(AliPay);
