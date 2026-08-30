import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * @description: 创建银行卡片验证
 */
export class CreateBankCardDto {
  @ApiProperty({
    description: '银行类型',
  })
  @IsNotEmpty({ message: '银行类型不能为空！' })
  bankType: number;

  @ApiProperty({
    description: '凭证类型(1存折/2储蓄卡/3信用卡)',
  })
  @IsNotEmpty({ message: '凭证类型不能为空！' })
  voucherType: number;

  @ApiProperty({
    description: '本卡号',
  })
  @IsNotEmpty({ message: '卡号不能为空！' })
  cardNo: string;

  @ApiProperty({
    description: '状态：1=在用, 2=已报废',
  })
  @IsNotEmpty({ message: '状态不能为空！' })
  status: number;

  @ApiProperty({
    description: '说明/备注',
  })
  @IsOptional()
  cardRemark: string;

  @ApiProperty({
    description: '换卡后的新卡号',
    required: false,
  })
  @IsOptional()
  replaceCardNo: string;

  @ApiProperty({
    description: '本卡由旧卡替换而来',
    required: false,
  })
  @IsOptional()
  oldCardNo: string;

  @ApiProperty({
    description: '换卡/报废时间',
    required: false,
  })
  @IsOptional()
  replaceTime: string;
}