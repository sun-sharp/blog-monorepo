import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({
    description: '菜单id',
  })
  @IsString({ message: '菜单id必须是字符串' })
  @IsNotEmpty({ message: '菜单id不能为空' })
  readonly menuId: string;
}
