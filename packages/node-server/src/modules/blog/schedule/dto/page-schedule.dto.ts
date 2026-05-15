import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageScheduleDto extends PaginateDto {
  @ApiProperty({
    description: '关键字',
    required: false,
    default: '',
  })
  readonly keywords: string = '';
}
