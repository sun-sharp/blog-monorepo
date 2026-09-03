import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @description: 修改手写账单验证
 */
export class UpdateManualBillDto {
  @ApiProperty({
    description: '手写账单id',
  })
  @IsString({ message: '手写账单id必须是字符串' })
  @IsNotEmpty({ message: '手写账单id不能为空' })
  readonly manualBillId: string;

  @ApiProperty({
    description: '交易时间',
  })
  tradeTime: string;

  @ApiProperty({
    description: '交易对方',
  })
  tradeOtherPerson: string;

  @ApiProperty({
    description: '交易金额',
  })
  moneyAmount: number;

  @ApiProperty({
    description: '余额',
  })
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
