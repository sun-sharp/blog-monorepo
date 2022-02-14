import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageRoleDto extends PaginateDto {
  @ApiProperty({
    description: '角色名称',
    required: false,
  })
  readonly name: string;

  @ApiProperty({
    description: '角色标识',
    required: false,
  })
  readonly roleCode: string;
}
