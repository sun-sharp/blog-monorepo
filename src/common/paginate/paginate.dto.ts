import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { paginateDefault } from '../enums/paginate.enum';

export class PaginateDto {
  @ApiProperty({
    description: '每页数量',
    example: 10,
  })
  @IsInt({ message: '每页数量必须是数字' })
  size = paginateDefault.SIZE;

  @ApiProperty({
    description: '当前页',
    example: 1,
  })
  @IsInt({ message: '每页数量必须是数字' })
  current = paginateDefault.CURRENT;
}
