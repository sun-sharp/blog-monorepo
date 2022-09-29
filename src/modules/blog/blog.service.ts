import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogService {
  index() {
    return '博客内容';
  }
}
