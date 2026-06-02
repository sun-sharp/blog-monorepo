import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class StatisticsStartEndTimeDto {
  @ApiProperty({
    description: '开始时间（ISO格式）',
  })
  @IsOptional()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: '结束时间（ISO格式）',
  })
  @IsOptional()
  @IsDateString()
  endTime: string;
}
