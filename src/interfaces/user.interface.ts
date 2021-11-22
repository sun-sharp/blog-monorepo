import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: '昵称',
  })
  name: string;

  @Prop()
  @ApiProperty({
    description: '用户头像',
  })
  avatar: string;

  @Prop()
  @ApiProperty({
    description: '用户名',
  })
  username: string;

  @Prop()
  @ApiProperty({
    description: '密码',
  })
  password: string;

  @Prop()
  @ApiProperty({
    description: '上传登录时间',
  })
  loginDate: string;

  @Prop()
  @ApiProperty({
    description: '角色标识',
  })
  roleCode: string;
}
