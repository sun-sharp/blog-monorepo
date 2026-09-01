import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 文章临时预览数据字段（用于未保存文章的预览）
 * @export
 * @class ArticlePreview
 * @extends {Document}
 */
@Schema({
  versionKey: false,
  collection: 'artpreviews',
})
export class ArticlePreview extends Document {
  // 文章的markdown内容
  @Prop({ required: true })
  markdownContent: string;

  // 文章的css名称
  @Prop({ default: 'default' })
  cssName: string;

  // 过期时间（用于定时清理）
  @Prop({ required: true })
  expiresAt: Date;

  // 创建时间
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ArticlePreviewSchema = SchemaFactory.createForClass(ArticlePreview);