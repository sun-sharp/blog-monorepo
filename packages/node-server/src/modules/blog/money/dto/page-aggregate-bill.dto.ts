import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageAggregateBillDto extends PaginateDto {
  @ApiProperty({ description: '交易对方/说明搜索关键词', required: false })
  @IsOptional()
  readonly tradeOtherPerson: string;

  @ApiProperty({ description: '流入/流出', required: false })
  @IsOptional()
  inflowOrOutflow: number;

  @ApiProperty({ description: '账单来源: bank/aliPay/weChat', required: false })
  @IsOptional()
  @IsIn(['bank', 'aliPay', 'weChat'], { message: '账单来源必须是 bank/aliPay/weChat' })
  source: string;

  @ApiProperty({ description: '开始时间', required: false })
  @IsOptional()
  startTime: string;

  @ApiProperty({ description: '结束时间', required: false })
  @IsOptional()
  endTime: string;

  @ApiProperty({ description: '银行类型', required: false })
  @IsOptional()
  bankType: number;

  @ApiProperty({ description: '账单类型（微信/支付宝）', required: false })
  @IsOptional()
  billType: number;

  @ApiProperty({ description: '账单方式（微信/支付宝）', required: false })
  @IsOptional()
  billMethod: number;

  @ApiProperty({ description: '银行账单类型', required: false })
  @IsOptional()
  bankBillType: number;
}
