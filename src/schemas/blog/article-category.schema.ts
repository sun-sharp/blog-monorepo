import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 文章分类数据字段
 * @export
 * @class ArticleCategory
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class ArticleCategory extends Document {
  // 文章分类标识
  @Prop()
  value: number;

  // 文章分类名称
  @Prop()
  name: string;
}

export const ArticleCategorySchema = SchemaFactory.createForClass(ArticleCategory);
