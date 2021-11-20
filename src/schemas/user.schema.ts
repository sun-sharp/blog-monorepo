import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
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
