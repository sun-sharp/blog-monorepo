import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class StatisticsStartEndTimeDto {
  @Prop()
  @ApiProperty({
    description: '开始时间',
  })
  startTime: string;

  @Prop()
  @ApiProperty({
    description: '结束时间',
  })
  endTime: string;
}
