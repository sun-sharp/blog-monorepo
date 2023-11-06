import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: '菜单的唯一标识',
  })
  @IsString({ message: '菜单的唯一标识必须是字符串' })
  @IsNotEmpty({ message: '菜单的唯一标识不能为空' })
  readonly name: string;

  @ApiProperty({
    description: '菜单的名称',
  })
  readonly title: string;

  @ApiProperty({
    description: '上级菜单的id',
  })
  readonly parentId: string;

  @ApiProperty({
    description: '菜单类型',
  })
  @IsNotEmpty({ message: '菜单类型不能为空' })
  readonly menuType: number;

  @ApiProperty({
    description: '菜单是否隐藏',
  })
  @IsBoolean({ message: '菜单是否隐藏必须是枚举值' })
  readonly hidden: boolean;

  @ApiProperty({
    description: '组件内容或地址',
  })
  readonly component: string;

  @ApiProperty({
    description: '菜单的排序',
  })
  readonly sort: number;

  @ApiProperty({
    description: '菜单的图标',
  })
  readonly icon: string;

  @ApiProperty({
    description: '内嵌iframe地址',
  })
  readonly iframeSrc: string;

  @ApiProperty({
    description: '外链跳转地址',
  })
  readonly externalLink: string;

  @ApiProperty({
    description: '是否缓存',
  })
  @IsBoolean({ message: '是否缓存必须是枚举值' })
  readonly keepAlive: boolean;
}
