import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class menuFindAllDto {
  @ApiProperty({
    description: '菜单的唯一标识',
    required: false,
  })
  @IsString({ message: '菜单的唯一标识必须是字符串' })
  name: string;
}
