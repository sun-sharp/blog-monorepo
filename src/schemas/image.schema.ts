import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 图片数据字段
 * @export
 * @class Image
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Image extends Document {
  @Prop()
  name: string; // 图片的唯一标识

  @Prop()
  src: string; // 图片的链接

  @Prop()
  size: number; // 图片的大小

  @Prop()
  imageType: string; // 图片类型

  @Prop()
  createTime: string; // 图片创建的时间
}

export const ImageSchema = SchemaFactory.createForClass(Image);
