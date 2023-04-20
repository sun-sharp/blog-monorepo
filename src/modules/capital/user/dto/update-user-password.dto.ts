import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: '密码',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({
    description: '修改密码',
  })
  @IsNotEmpty({ message: '修改密码不能为空' })
  updatePassword: string;
}
