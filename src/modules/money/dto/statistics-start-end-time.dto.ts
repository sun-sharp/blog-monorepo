import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StatisticsStartEndTimeDto {
  @Prop()
  @ApiProperty({
    description: '开始时间',
  })
  @IsNotEmpty({ message: '开始时间不能为空' })
  startTime: string;

  @Prop()
  @ApiProperty({
    description: '结束时间',
  })
  @IsNotEmpty({ message: '结束时间不能为空' })
  endTime: string;
}
