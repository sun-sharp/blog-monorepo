import { Controller } from '@nestjs/common';
import { ArticleCssService } from './article-css.service';

@Controller('article-css')
export class ArticleCssController {
  constructor(private readonly articleCssService: ArticleCssService) {}
}
