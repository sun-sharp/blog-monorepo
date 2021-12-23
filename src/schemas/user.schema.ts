import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 用户数据字段
 * @date 21/11/2021
 * @export
 * @class User
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  loginDate: string;

  @Prop()
  roleCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
