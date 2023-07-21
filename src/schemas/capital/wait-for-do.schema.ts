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
  // 标题
  @Prop()
  title: string;

  // 分类
  @Prop()
  classify: number;

  // 截止时间
  @Prop()
  deadline: Date;

  // 备注
  @Prop()
  remark: string;

  // 状态
  @Prop()
  state: number;

  // 排序
  @Prop()
  sort: number;

  // 是否删除
  @Prop()
  isRemove: boolean;

  // 用户id
  @Prop()
  userId: string;
}

export const WaitForDoSchema = SchemaFactory.createForClass(WaitForDo);
