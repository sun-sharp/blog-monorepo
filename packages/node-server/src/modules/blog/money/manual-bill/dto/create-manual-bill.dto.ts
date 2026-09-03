import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * @description: 创建手写账单验证
 */
export class CreateManualBillDto {
  @ApiProperty({
    description: '交易时间',
  })
  @IsNotEmpty({ message: '交易时间不能为空！' })
  tradeTime: string;

  @ApiProperty({
    description: '交易对方',
  })
  @IsNotEmpty({ message: '交易对方不能为空！' })
  tradeOtherPerson: string;

  @ApiProperty({
    description: '交易金额',
  })
  @IsNotEmpty({ message: '交易金额不能为空！' })
  moneyAmount: number;

  @ApiProperty({
    description: '余额',
  })
  @IsNotEmpty({ message: '余额不能为空！' })
  balance: number;

  @ApiProperty({
    description: '流入/流出',
  })
  @IsNotEmpty({ message: '流入/流出不能为空！' })
  inflowOrOutflow: number;

  @ApiProperty({
    description: '账单类型',
  })
  @IsNotEmpty({ message: '账单类型不能为空！' })
  billType: number;

  @ApiProperty({
    description: '账单方式',
  })
  @IsNotEmpty({ message: '账单方式不能为空！' })
  billMethod: number;

  @ApiProperty({
    description: '说明',
  })
  explain: string;

  @ApiProperty({
    description: '交易场所',
  })
  place: string;

  @ApiProperty({
    description: '收/支（可选）',
  })
  incomeOrPay: string;

  @ApiProperty({
    description: '交易类型（可选）',
  })
  tradeType: string;

  @ApiProperty({
    description: '其它费用（可选）',
  })
  otherCost: number;
}
