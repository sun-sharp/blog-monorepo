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

  // 商品
  @Prop()
  goods: string;

  // 收/支
  @Prop()
  incomeOrPay: string;

  // 金额(元)
  @Prop()
  moneyAmount: number;

  // 其它费用(元)
  @Prop()
  otherCost: number;

  // 支付方式
  @Prop()
  paymentMethod: string;

  // 当前状态
  @Prop()
  currentStatus: string;

  // 备注
  @Prop()
  remarks: string;

  // 流入/流出（1/2）
  @Prop()
  inflowOrOutflow: number;

  // 账单说明
  @Prop()
  explain: string;

  // 使用地点
  @Prop()
  place: string;

  // 账单类型（1/2）
  @Prop()
  billType: number;

  // 账单方式（1/2）
  @Prop()
  billMethod: number;

  // 余额(元)
  @Prop()
  balance: number;
}

export const WeChatSchema = SchemaFactory.createForClass(WeChat);
