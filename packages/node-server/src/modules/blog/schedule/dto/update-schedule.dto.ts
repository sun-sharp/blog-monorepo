import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @ApiProperty({
    description: 'id',
  })
  @IsString({ message: 'id必须是字符串' })
  @IsNotEmpty({ message: 'id不能为空' })
  readonly scheduleId: string;
}
