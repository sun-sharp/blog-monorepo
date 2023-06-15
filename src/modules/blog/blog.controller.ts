import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';

@Controller('blog')
@ApiTags('博客')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({
    summary: '博客内容',
  })
  index() {
    return this.blogService.index();
  }
}
