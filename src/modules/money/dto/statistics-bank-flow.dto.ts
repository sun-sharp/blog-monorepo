import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StatisticsBankFlowDto {
  @Prop()
  @IsString({ message: '开始时间必须是字符串' })
  @ApiProperty({
    description: '开始时间',
  })
  startTime: string;

  @Prop()
  @IsString({ message: '结束时间必须是字符串' })
  @ApiProperty({
    description: '结束时间',
  })
  endTime: string;
}
