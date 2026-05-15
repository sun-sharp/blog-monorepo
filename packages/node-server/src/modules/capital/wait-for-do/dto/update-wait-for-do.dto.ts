import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IdWaitForDoDto } from './id-wait-for-do.dto';

export class UpdateWaitForDoDto extends IdWaitForDoDto {
  @ApiProperty({
    description: '标题',
  })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @ApiProperty({
    description: '截止时间',
  })
  deadline: string;

  @ApiProperty({
    description: '备注',
  })
  remark: string;
}
