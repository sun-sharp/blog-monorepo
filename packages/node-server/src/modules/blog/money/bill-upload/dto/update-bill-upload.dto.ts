import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBillUploadDto } from './create-bill-upload.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBillUploadDto extends PartialType(CreateBillUploadDto) {
  @ApiProperty({
    description: '账单导入id',
  })
  @IsString({ message: '账单导入id必须是字符串' })
  @IsNotEmpty({ message: '账单导入id不能为空' })
  readonly billUploadId: string;
}
