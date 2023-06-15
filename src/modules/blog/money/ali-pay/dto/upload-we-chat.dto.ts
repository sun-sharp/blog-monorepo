import { ApiProperty } from '@nestjs/swagger';

export class UploadAliPayDto {
  @ApiProperty({ description: '单文件上传', type: 'string', format: 'binary' })
  file: any;
}
