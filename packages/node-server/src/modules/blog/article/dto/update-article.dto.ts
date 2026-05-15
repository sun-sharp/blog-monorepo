import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty({
    description: '文章id',
  })
  @IsString({ message: '文章id必须是字符串' })
  @IsNotEmpty({ message: '文章id不能为空' })
  readonly articleId: string;
}
