// import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageCategoryDto extends PaginateDto {
  // @ApiProperty({
  //   description: '图片名称',
  //   required: false,
  //   default: '',
  // })
  // readonly name: string = '';
  // @ApiProperty({
  //   description: '图片的来源',
  //   required: false,
  //   default: '',
  // })
  // readonly source: string = '';
}
