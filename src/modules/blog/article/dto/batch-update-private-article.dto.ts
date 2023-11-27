import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class BatchUpdatePrivateArticleDto {
  @ApiProperty({ description: '文章id数组', type: 'string[]' })
  @IsArray({ message: '文章id必须是数组' })
  @ArrayNotEmpty({ message: '文章id数组不能为空' })
  articleIdArr: string[];

  @ApiProperty({ description: '是否加密' })
  @IsBoolean({ message: '是否私密必须是枚举值' })
  @IsNotEmpty({ message: '是否私密不能为空' })
  isPrivate: boolean;
}
