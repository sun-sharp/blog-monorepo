import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageBillUploadDto extends PaginateDto {
  @ApiProperty({
    description: '账单导入类型',
  })
  readonly billUploadType: number;

  @ApiProperty({
    description: '账单导入方式',
  })
  readonly billMethod: string = '';

  @ApiProperty({
    description: '账单方式',
  })
  readonly billType: string = '';

  @ApiProperty({
    description: '需处理类型',
  })
  readonly handleType: string = '';
}
