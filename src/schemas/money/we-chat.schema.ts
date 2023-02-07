import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 微信账号数据字段
 * @export
 * @class WeChat
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class WeChat extends Document {
  @Prop()
  userId: string; // 用户id

  @Prop()
  tradeTime: string; // 交易时间

  @Prop()
  tradeType: string; // 交易类型

  @Prop()
  tradeOtherPerson: string; // 交易对方

  @Prop()
  tradeOtherPersonRemarks: string; // 交易对方备注

  @Prop()
  goods: string; // 商品

  @Prop()
  incomeOrPay: string; // 收/支

  @Prop()
  moneyAmount: number; // 金额(元)

  @Prop()
  otherCost: number; // 其它费用

  @Prop()
  paymentMethod: string; // 支付方式

  @Prop()
  currentStatus: string; // 当前状态

  @Prop()
  remarks: string; // 备注

  @Prop()
  inflowOrOutflow: number; // 流入/流出

  @Prop()
  explain: string; // 账单说明

  @Prop()
  place: string; // 使用地点

  @Prop()
  billType: number; // 账单类型

  @Prop()
  billMethod: number; // 账单方式

  @Prop()
  balance: number; // 余额
}

export const WeChatSchema = SchemaFactory.createForClass(WeChat);
