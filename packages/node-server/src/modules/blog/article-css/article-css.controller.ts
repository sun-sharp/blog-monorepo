import { Controller } from '@nestjs/common';
import { ArticleCssService } from './article-css.service';
// import { CreateArticleCssDto } from './dto/create-article-css.dto';
// import { UpdateArticleCssDto } from './dto/update-article-css.dto';

@Controller('article-css')
export class ArticleCssController {
  constructor(private readonly articleCssService: ArticleCssService) {}
}
