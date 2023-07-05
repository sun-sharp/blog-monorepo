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
  classify: string;

  @ApiProperty({
    description: '截止时间',
    example: '2023-06-07 22:12:45',
  })
  deadline: string;

  @ApiProperty({
    description: '备注',
    example: '备注1',
  })
  remark: string;

  @ApiProperty({
    description: '状态',
    example: 1,
  })
  @IsNotEmpty({ message: '状态不能为空' })
  state: number;

  @ApiProperty({
    description: '是否删除',
    example: false,
  })
  isRemove: boolean;
}
