import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @Prop()
  @ApiProperty({
    description: '用户名',
    example: 'text',
  })
  username: string;
  @Prop()
  @ApiProperty({
    description: '密码',
    example: '123123',
  })
  password: string;
}
