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
  readonly judgeWay: string = '';
}
