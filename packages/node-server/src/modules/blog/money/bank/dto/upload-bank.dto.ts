import { ApiProperty } from '@nestjs/swagger';

export class UploadBankDto {
  @ApiProperty({ description: '单文件上传', type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ description: '银行类型(1-工商 2-农业 3-建设 4-民生 5-招商)', type: Number })
  bankType: number;
}
