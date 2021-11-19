import { getModelForClass, prop } from '@typegoose/typegoose';

export class User {
  @prop()
  name: string;
  @prop()
  avatar: string;
  @prop()
  username: string;
  @prop()
  password: string;
  @prop()
  loginDate: string;
  @prop()
  roleCode: string;
}

export const UserSchema = getModelForClass(User);
