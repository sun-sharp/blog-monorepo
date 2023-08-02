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
  // 角色名
  @Prop()
  name: string;

  // 角色唯一标识
  @Prop()
  roleCode: string;

  // 角色类型
  @Prop()
  roleType: number;

  // 角色菜单权限
  @Prop()
  menuPermission: Array<string>;

  // 角色api权限
  @Prop()
  apiPermission: Array<string>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
