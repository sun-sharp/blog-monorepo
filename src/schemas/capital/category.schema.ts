import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 分类数据字段
 * @export
 * @class category
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Category extends Document {
  @Prop()
  type: string; // 分类类型

  @Prop()
  value: number; // 分类标识

  @Prop()
  label: string; // 分类名称
}

export const CategorySchema = SchemaFactory.createForClass(Category);
