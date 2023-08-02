import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';

@Controller('blog')
@ApiTags('博客')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
}
