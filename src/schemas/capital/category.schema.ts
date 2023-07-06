import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 全局类型数据字段
 * @export
 * @class category
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Category extends Document {
  // 全局类型分类
  @Prop()
  type: string;

  // 全局类型标识
  @Prop()
  value: number;

  // 全局类型字符串类型的标识
  @Prop()
  valueStr: string;

  // 全局类型名称
  @Prop()
  label: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
