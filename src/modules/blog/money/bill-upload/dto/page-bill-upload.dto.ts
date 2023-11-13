import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageBillUploadDto extends PaginateDto {
  @ApiProperty({
    description: '全局类型分类',
  })
  readonly type: string = '';

  @ApiProperty({
    description: '全局类型名称',
  })
  readonly label: string = '';
}
