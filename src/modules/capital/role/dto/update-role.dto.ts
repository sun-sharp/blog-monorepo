import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    description: '权限id',
  })
  @IsString({ message: '权限id必须是字符串' })
  @IsNotEmpty({ message: '权限id不能为空' })
  readonly roleId: string;
}
