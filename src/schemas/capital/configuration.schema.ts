import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 设置数据字段
 * @export
 * @class Configuration
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Configuration extends Document {
  @Prop()
  userId: string; // 用户id

  @Prop()
  isDarkTheme: boolean; // 深色主题

  @Prop()
  appTheme: string; // 系统主题色
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
