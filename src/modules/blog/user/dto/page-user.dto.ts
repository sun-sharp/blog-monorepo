import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageUserDto extends PaginateDto {
  @ApiProperty({
    description: '昵称',
  })
  name: string;

  @ApiProperty({
    description: '用户名',
  })
  username: string;
}
