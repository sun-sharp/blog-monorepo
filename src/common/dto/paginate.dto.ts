import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateDto {
  @ApiProperty({
    description: '每页数量',
    example: 10,
  })
  size: number;
  @Prop()
  @ApiProperty({
    description: '当前页',
    example: 1,
  })
  current: number;
}
