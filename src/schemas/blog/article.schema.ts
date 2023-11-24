import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 文章数据字段
 * @export
 * @class Article
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Article extends Document {
  // 文章的标题
  @Prop()
  title: string;

  // 文章的简介
  @Prop()
  brief: string;

  // 文章的html内容
  @Prop()
  htmlContent: string;

  // 文章的markdown内容
  @Prop()
  markdownContent: string;

  // 文章的作者
  @Prop()
  authorId: string;

  // 文章的作者昵称
  @Prop()
  authorNickname: string;

  // 文章的类型标识
  @Prop()
  categoryVal: number;

  // 文章的创建时间
  @Prop()
  createTime: Date;

  // 是否私密
  @Prop()
  isPrivate: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
