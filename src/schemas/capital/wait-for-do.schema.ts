import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 待办数据字段
 * @export
 * @class WaitForDo
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class WaitForDo extends Document {
  @Prop()
  title: string; // 标题

  @Prop()
  classify: string; // 分类

  @Prop()
  deadline: string; // 截止时间

  @Prop()
  remark: string; // 备注

  @Prop()
  state: number; // 状态

  @Prop()
  sort: number; // 排序

  @Prop()
  isRemove: boolean; // 是否删除
}

export const WaitForDoSchema = SchemaFactory.createForClass(WaitForDo);
