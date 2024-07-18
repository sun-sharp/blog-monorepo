import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 日程数据字段
 * @export
 * @class Schedule
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Schedule extends Document {
  // 日程的标题
  @Prop()
  title: string;

  // 日程内容
  @Prop()
  content: string;

  // 开始日期
  @Prop()
  startDate: string;

  // 结束日期
  @Prop()
  endDate: string;

  // 开始时间
  @Prop()
  startTime: string;

  // 结束时间
  @Prop()
  endTime: string;

  // 创建人物id
  @Prop()
  userId: string;

  // 创建时间
  @Prop()
  createTime: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
