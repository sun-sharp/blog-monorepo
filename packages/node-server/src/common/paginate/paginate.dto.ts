import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { paginateDefault } from '../enums/paginate.enum';

export class PaginateDto {
  @ApiProperty({
    description: '每页数量',
    example: paginateDefault.SIZE,
  })
  @IsInt({ message: '每页数量类型必须是整数' })
  readonly size: number = paginateDefault.SIZE;

  @ApiProperty({
    description: '当前页',
    example: paginateDefault.CURRENT,
  })
  @IsInt({ message: '当前页类型必须是整数' })
  readonly current: number = paginateDefault.CURRENT;
}
