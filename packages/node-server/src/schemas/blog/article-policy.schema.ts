import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 文章访问策略数据字段
 * @export
 * @class ArticlePolicy
 * @extends {Document}
 */
@Schema({
  versionKey: false,
  collection: 'article_policies',
})
export class ArticlePolicy extends Document {
  @Prop({ required: true })
  articleId: string; // 关联的文章 ID

  @Prop({ required: true })
  maxVisits: number; // 最大访问次数

  @Prop({ default: 0 })
  visitCount: number; // 当前已访问次数

  @Prop({ required: true })
  expiresAt: Date; // 过期时间

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ArticlePolicySchema = SchemaFactory.createForClass(ArticlePolicy);
