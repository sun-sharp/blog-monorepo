import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class AllPageArticleDto extends PaginateDto {
  @ApiProperty({
    description: '关键字',
    required: false,
    default: '',
  })
  readonly keywords: string = '';

  @ApiProperty({
    description: '文章分类',
    required: false,
  })
  readonly categoryVal: number;
}
