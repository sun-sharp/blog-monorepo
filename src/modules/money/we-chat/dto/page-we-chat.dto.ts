import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageWeChatDto extends PaginateDto {
  @ApiProperty({
    description: '交易对方',
    required: false,
    default: '',
  })
  readonly tradeOtherPerson: string = '';
}
