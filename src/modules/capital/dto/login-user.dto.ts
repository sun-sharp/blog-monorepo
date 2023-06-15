import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @Prop()
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @ApiProperty({
    description: '用户名',
    example: 'nest',
  })
  username: string;
  @Prop()
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  password: string;
}
