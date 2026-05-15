import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({
    description: '昵称',
  })
  @IsString({ message: '昵称必须是字符串' })
  @IsNotEmpty({ message: '昵称不能为空' })
  readonly nickname: string;

  @ApiProperty({
    description: '用户头像',
  })
  @IsString({ message: '用户头像必须是字符串' })
  @IsNotEmpty({ message: '用户头像不能为空' })
  readonly avatar: string;

  @ApiProperty({
    description: '账号名',
  })
  @IsString({ message: '账号名必须是字符串' })
  @IsNotEmpty({ message: '账号名不能为空' })
  readonly username: string;
}
