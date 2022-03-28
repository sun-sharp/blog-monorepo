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
  goods: string; // 商品

  @Prop()
  incomeOrPay: string; // 收入

  @Prop()
  moneyAmount: number; // 金额(元)

  @Prop()
  paymentMethod: string; // 支付方式

  @Prop()
  currentStatus: string; // 当前状态

  @Prop()
  transactionNo: string; // 交易单号

  @Prop()
  merchantNo: string; // 商户单号

  @Prop()
  remarks: string; // 备注
}

export const WeChatSchema = SchemaFactory.createForClass(WeChat);
