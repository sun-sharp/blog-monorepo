import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageUricDto extends PaginateDto {
  @ApiProperty({
    description: '测量方式',
  })
  readonly measureType: string = '';
}
