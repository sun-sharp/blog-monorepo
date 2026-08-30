import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageBankCardDto extends PaginateDto {
  @ApiProperty({
    description: '银行类型',
    required: false,
  })
  bankType: number;

  @ApiProperty({
    description: '卡号',
    required: false,
  })
  readonly cardNo: string;

  @ApiProperty({
    description: '状态：1=在用, 2=已报废',
    required: false,
  })
  status: number;
}