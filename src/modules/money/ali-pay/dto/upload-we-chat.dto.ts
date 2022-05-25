import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty } from 'class-validator';

export class UploadAliPayDto {
  @ApiProperty({ description: '单文件上传', type: 'string', format: 'binary' })
  file: any;

  // @ApiProperty({ description: '来源', type: 'string' })
  // @IsNotEmpty({ message: '来源不能为空' })
  // source: string;
}
