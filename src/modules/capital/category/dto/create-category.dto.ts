import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: '全局类型分类',
    example: 'text',
  })
  @IsNotEmpty({ message: '全局类型分类不能为空' })
  type: string;

  @ApiProperty({
    description: '全局类型标识',
    example: 1,
  })
  value: number;

  @ApiProperty({
    description: '全局类型标识（字符串类型）',
    example: 'text',
  })
  valueStr: string;

  @ApiProperty({
    description: '全局类型名称',
    example: '测试',
  })
  @IsNotEmpty({ message: '全局类型名称不能为空' })
  label: string;
}
