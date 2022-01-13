import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoleMenuDto {
  @ApiProperty({
    description: '角色标识',
  })
  @IsString({ message: '角色标识必须是字符串' })
  @IsNotEmpty({ message: '角色标识不能为空' })
  roleCode: string;
}
