import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({
    description: '标题',
    example: '标题',
  })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @ApiProperty({
    description: '内容',
    example: '内容',
  })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @ApiProperty({
    description: '开始日期',
    example: '开始日期',
  })
  @IsNotEmpty({ message: '开始日期不能为空' })
  startDate: string;

  @ApiProperty({
    description: '结束日期',
    example: '结束日期',
  })
  @IsNotEmpty({ message: '结束日期不能为空' })
  endDate: string;

  @ApiProperty({
    description: '开始时间',
    example: '开始时间',
  })
  startTime: string;

  @ApiProperty({
    description: '结束时间',
    example: '结束时间',
  })
  endTime: string;
}
