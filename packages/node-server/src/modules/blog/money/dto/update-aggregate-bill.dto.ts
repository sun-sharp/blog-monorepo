import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAggregateBillDto {
  @ApiProperty({ description: '账单来源: bank/aliPay/weChat/manual' })
  @IsNotEmpty({ message: '账单来源不能为空' })
  @IsIn(['bank', 'aliPay', 'weChat', 'manual'], { message: '账单来源必须是 bank/aliPay/weChat/manual' })
  readonly source: string;

  @ApiProperty({ description: '账单id' })
  @IsNotEmpty({ message: '账单id不能为空' })
  readonly billId: string;

  @ApiProperty({ description: '交易对方备注', required: false })
  @IsOptional()
  tradeOtherPersonRemarks: string;

  @ApiProperty({ description: '流入/流出' })
  @IsNotEmpty({ message: '流入/流出不能为空！' })
  inflowOrOutflow: number;

  @ApiProperty({ description: '账单说明', required: false })
  @IsOptional()
  explain: string;

  @ApiProperty({ description: '使用地点', required: false })
  @IsOptional()
  place: string;

  @ApiProperty({ description: '其它费用（银行）', required: false })
  @IsOptional()
  otherCost: number;

  @ApiProperty({ description: '银行账单类型（银行）', required: false })
  @IsOptional()
  bankBillType: number;

  @ApiProperty({ description: '账单类型（微信/支付宝）', required: false })
  @IsOptional()
  billType: number;

  @ApiProperty({ description: '账单方式（微信/支付宝）', required: false })
  @IsOptional()
  billMethod: number;

  @ApiProperty({ description: '支付方式（手写账单）', required: false })
  @IsOptional()
  manualPaymentMethod: number;
}
