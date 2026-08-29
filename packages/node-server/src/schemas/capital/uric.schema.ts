import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 尿酸血糖测量记录的数据字段
 * @export
 * @class Uric
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Uric extends Document {
  // 测量时间
  @Prop()
  measureTime: Date;

  // 尿酸测量值
  @Prop()
  uricAcid: number;

  // 血糖测量值
  @Prop()
  bloodGlucose: number;

  // 测量方式
  @Prop()
  measureType: string;

  // 血糖检测时段(1凌晨/2空腹/3早餐后/4午餐前/5午餐后/6晚餐前/7晚餐后/8睡前/101随机)
  @Prop()
  bloodSugarPeriod: number;

  // 创建的用户id
  @Prop()
  userId: string;
}

export const UricSchema = SchemaFactory.createForClass(Uric);
