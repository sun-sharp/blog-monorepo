import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 文章css样式数据字段
 * @export
 * @class ArticleCss
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class ArticleCss extends Document {
  // 文章css的名称
  @Prop()
  name: string;

  // 文章的css内容
  @Prop({
    required: true, // 是否必填
    trim: true, // 自动去除首尾空格
  })
  cssContent: string;
}

export const ArticleCssSchema = SchemaFactory.createForClass(ArticleCss);
