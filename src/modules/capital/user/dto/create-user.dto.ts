import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'text',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({
    description: '昵称',
  })
  @IsNotEmpty({ message: '昵称不能为空' })
  name: string;

  @ApiProperty({
    description: '用户头像',
  })
  avatar: string;

  @ApiProperty({
    description: '角色标识',
  })
  @IsNotEmpty({ message: '角色标识不能为空' })
  roleCode: string;
}
