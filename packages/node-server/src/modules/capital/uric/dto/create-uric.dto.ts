import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUricDto {
  @ApiProperty({
    description: '测量时间',
  })
  @IsNotEmpty({ message: '测量时间不能为空' })
  measureTime: string;

  @ApiProperty({
    description: '尿酸测量值',
    example: 1,
  })
  uricAcid: number;

  @ApiProperty({
    description: '血糖测量值',
    example: 1,
  })
  bloodGlucose: number;

  @ApiProperty({
    description: '测量方式',
    example: '',
  })
  @IsNotEmpty({ message: '测量方式不能为空' })
  measureType: string;
}
