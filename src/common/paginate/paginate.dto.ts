import { ApiProperty } from '@nestjs/swagger';
// import { paginateDefault } from '../enums/paginate.enum';

export class PaginateDto {
  @ApiProperty({
    description: '每页数量',
    example: 10,
  })
  size: number;

  @ApiProperty({
    description: '当前页',
    example: 1,
  })
  current: number;
}
