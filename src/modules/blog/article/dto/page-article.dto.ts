import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageArticleDto extends PaginateDto {
  @ApiProperty({
    description: '文章标题',
    required: false,
    default: '',
  })
  readonly title: string = '';

  // @ApiProperty({
  //   description: '用户名',
  //   required: false,
  //   default: '',
  // })
  // readonly username: string = '';
}
