import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: '角色名称',
  })
  @IsString({ message: '角色名称必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  readonly name: string;

  @ApiProperty({
    description: '角色标识',
  })
  @IsString({ message: '角色标识必须是字符串' })
  @IsNotEmpty({ message: '角色标识不能为空' })
  readonly roleCode: string;

  @ApiProperty({
    description: '角色权限类型',
  })
  @IsInt({ message: '角色权限类型必须是整数' })
  readonly roleType: number;

  @ApiProperty({
    description: '菜单权限',
  })
  readonly permission: Array<string>;
}
