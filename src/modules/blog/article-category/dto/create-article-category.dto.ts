import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArticleCategoryDto {
  @ApiProperty({
    description: '文章分类名称',
    example: '测试',
  })
  @IsNotEmpty({ message: '文章分类名称不能为空' })
  name: string;
}
