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
  @Prop({ required: true })
  type: string;

  // 全局类型标识
  @Prop({ type: Number, required: false })
  value: number;

  // 全局类型字符串类型的标识
  @Prop({ type: String, required: false })
  valueStr: string;

  // 全局类型名称
  @Prop()
  label: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// 🔥 索引 1：在同一个 type 下，如果 value 不为 null，则必须唯一
CategorySchema.index(
  { type: 1, value: 1 },
  {
    unique: true,
    partialFilterExpression: { value: { $type: 'number' } },
    // 含义：只有当 value 是字符串（非 null）时，才校验 (type, value) 组合唯一
  },
);

// 🔥 索引 2：在同一个 type 下，如果 valueStr 不为 null，则必须唯一
CategorySchema.index(
  { type: 1, valueStr: 1 },
  {
    unique: true,
    partialFilterExpression: { valueStr: { $type: 'string' } },
    // 含义：只有当 valueStr 是字符串（非 null）时，才校验 (type, valueStr) 组合唯一
  },
);
