import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: '文章的标题',
    example: '文章的标题',
  })
  @IsNotEmpty({ message: '文章的标题不能为空' })
  title: string;

  @ApiProperty({
    description: '文章的简介',
    example: '文章的简介',
  })
  brief: string;

  @ApiProperty({
    description: '文章的markdown内容',
    example: '',
  })
  markdownContent: string;

  @ApiProperty({
    description: '文章的css名称',
    example: '',
  })
  cssName: string;

  @ApiProperty({
    description: '文章的类型标识',
    example: 1,
  })
  @IsNotEmpty({ message: '文章的类型标识不能为空' })
  categoryVal: number;

  @ApiProperty({
    description: '是否私密',
    example: false,
  })
  @IsNotEmpty({ message: '是否私密不能为空' })
  @IsBoolean({ message: '是否私密必须是枚举值' })
  isPrivate: boolean;
}
