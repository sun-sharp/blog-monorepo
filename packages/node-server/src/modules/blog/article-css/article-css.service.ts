import { Injectable } from '@nestjs/common';
import { CreateArticleCssDto } from './dto/create-article-css.dto';
import { UpdateArticleCssDto } from './dto/update-article-css.dto';
import { logger } from 'src/common/journal';

@Injectable()
export class ArticleCssService {
  create(createArticleCssDto: CreateArticleCssDto) {
    logger.log('createArticleCssDto', createArticleCssDto);
    return 'This action adds a new articleCss';
  }

  findAll() {
    return `This action returns all articleCss`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleCss`;
  }

  update(id: number, updateArticleCssDto: UpdateArticleCssDto) {
    logger.log('updateArticleCssDto', updateArticleCssDto);
    return `This action updates a #${id} articleCss`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleCss`;
  }
}
