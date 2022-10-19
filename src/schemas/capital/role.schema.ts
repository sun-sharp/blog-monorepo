import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 角色数据字段
 * @export
 * @class Role
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Role extends Document {
  @Prop()
  name: string; // 角色名

  @Prop()
  roleCode: string; // 角色唯一标识

  @Prop()
  roleType: number; // 角色类型

  @Prop()
  permission: Array<string>; // 角色权限
}

export const RoleSchema = SchemaFactory.createForClass(Role);
