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
  name: string;

  @Prop()
  roleCode: string;

  @Prop()
  roleType: number;

  @Prop()
  permission: Array<string>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
