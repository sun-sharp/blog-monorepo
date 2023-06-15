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
  @Prop()
  nickname: string; // 昵称

  @Prop()
  avatar: string; // 用户头像

  @Prop()
  username: string; // 账号名

  @Prop()
  password: string; // 密码

  @Prop()
  loginDate: string; // 上次登录时间

  @Prop()
  roleCode: string; // 角色类型
}

export const UserSchema = SchemaFactory.createForClass(User);
