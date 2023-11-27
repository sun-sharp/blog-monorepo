import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { IdWaitForDoDto } from './id-wait-for-do.dto';

export class UpdateWaitForDoSortDto extends IdWaitForDoDto {
  @ApiProperty({
    description: '排序',
  })
  @IsInt({ message: '排序必现是整数' })
  @IsNotEmpty({ message: '排序不能为空' })
  sort: number;
}
