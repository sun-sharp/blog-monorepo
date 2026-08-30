import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 银行卡片数据字段（一张卡一条，用于标记报废并排除余额合计）
 * @export
 * @class BankCard
 * @extends {Document}
 */
@Schema({
  versionKey: false,
  timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
})
export class BankCard extends Document {
  // 用户id
  @Prop()
  userId: string;

  // 银行类型
  @Prop()
  bankType: number;

  // 凭证类型(1存折/2储蓄卡/3信用卡)
  @Prop()
  voucherType: number;

  // 本卡号（对应 bank.voucherNo）
  @Prop()
  cardNo: string;

  // 状态：1=在用, 2=已报废
  @Prop()
  status: number;

  // 说明/备注
  @Prop()
  cardRemark: string;

  // 换卡后的新卡号（直接报废则空）
  @Prop()
  replaceCardNo: string;

  // 本卡由旧卡替换而来
  @Prop()
  oldCardNo: string;

  // 换卡/报废时间
  @Prop()
  replaceTime: Date;

  // 创建时间
  @Prop()
  createTime: Date;

  // 更新时间
  @Prop()
  updateTime: Date;
}

export const BankCardSchema = SchemaFactory.createForClass(BankCard);
