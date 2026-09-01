import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticlePreviewDto {
  @ApiProperty({
    description: '文章的markdown内容',
    example: '# 标题',
  })
  @IsString({ message: 'markdown内容必须是字符串' })
  @IsNotEmpty({ message: 'markdown内容不能为空' })
  markdownContent: string;

  @ApiProperty({
    description: '文章的css名称',
    example: 'default',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'css名称必须是字符串' })
  cssName?: string;
}