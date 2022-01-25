import { ApiProperty } from '@nestjs/swagger';

export class menuFindAllDto {
  @ApiProperty({
    description: '菜单的唯一标识',
    required: false,
  })
  readonly name: string;

  @ApiProperty({
    description: '菜单名称',
    required: false,
  })
  readonly title: string;
}
