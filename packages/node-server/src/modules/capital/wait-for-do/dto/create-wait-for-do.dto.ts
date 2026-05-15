import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWaitForDoDto {
  @ApiProperty({
    description: '标题',
    example: '标题1',
  })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @ApiProperty({
    description: '分类',
    example: '分类1',
  })
  @IsNotEmpty({ message: '分类不能为空' })
  classify: number;

  @ApiProperty({
    description: '截止时间',
    example: '2023-06-07 22:12:45',
  })
  deadline: string;

  @ApiProperty({
    description: '状态',
    example: 1,
  })
  @IsNotEmpty({ message: '状态不能为空' })
  state: number;
}
