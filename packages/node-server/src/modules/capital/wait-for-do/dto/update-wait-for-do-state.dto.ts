import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { IdWaitForDoDto } from './id-wait-for-do.dto';

export class UpdateWaitForDoStateDto extends IdWaitForDoDto {
  @ApiProperty({
    description: '状态',
  })
  @IsInt({ message: '状态必现是整数' })
  @IsNotEmpty({ message: '状态不能为空' })
  state: number;
}
