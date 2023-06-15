import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageBankDto extends PaginateDto {
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
    description: '银行账单类型',
    required: false,
  })
  bankBillType: number;

  @ApiProperty({
    description: '银行类型',
    required: false,
  })
  bankType: number;
}
