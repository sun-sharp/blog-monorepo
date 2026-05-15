import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 用户数据字段
 * @export
 * @class User
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class User extends Document {
  // 昵称
  @Prop()
  nickname: string;

  // 用户头像
  @Prop()
  avatar: string;

  // 账号名
  @Prop()
  username: string;

  // 密码
  @Prop()
  password: string;

  // 上次登录时间
  @Prop()
  loginDate: Date;

  // 角色类型
  @Prop()
  roleCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
