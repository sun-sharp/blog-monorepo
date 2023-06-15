import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: '菜单的唯一标识',
  })
  @IsString({ message: '菜单的唯一标识必须是字符串' })
  @IsNotEmpty({ message: '菜单的唯一标识不能为空' })
  readonly name: string;
  // name, title, path, sort, icon, parentId, iframeSrc, component, menuType, hidden
}
