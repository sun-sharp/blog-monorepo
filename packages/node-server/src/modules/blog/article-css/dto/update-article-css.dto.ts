import { PartialType } from '@nestjs/swagger';
import { CreateArticleCssDto } from './create-article-css.dto';

export class UpdateArticleCssDto extends PartialType(CreateArticleCssDto) {}
