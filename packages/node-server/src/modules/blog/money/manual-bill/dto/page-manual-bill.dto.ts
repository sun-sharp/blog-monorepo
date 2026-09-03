import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageManualBillDto extends PaginateDto {
  @ApiProperty({
    description: '交易对方',
    required: false,
  })
  readonly tradeOtherPerson: string;

  @ApiProperty({
    description: '流入/流出',
    required: false,
  })
  inflowOrOutflow: number;

  @ApiProperty({
    description: '账单类型',
    required: false,
  })
  billType: number;

  @ApiProperty({
    description: '账单方式',
    required: false,
  })
  billMethod: number;
}
