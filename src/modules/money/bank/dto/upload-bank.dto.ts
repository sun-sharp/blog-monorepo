import { ApiProperty } from '@nestjs/swagger';

export class UploadBankDto {
  @ApiProperty({ description: '单文件上传', type: 'string', format: 'binary' })
  file: any;
}
