import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleCssService } from './article-css.service';
import { CreateArticleCssDto } from './dto/create-article-css.dto';
import { UpdateArticleCssDto } from './dto/update-article-css.dto';

@Controller('article-css')
export class ArticleCssController {
  constructor(private readonly articleCssService: ArticleCssService) {}

  @Post()
  create(@Body() createArticleCssDto: CreateArticleCssDto) {
    return this.articleCssService.create(createArticleCssDto);
  }

  @Get()
  findAll() {
    return this.articleCssService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleCssService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleCssDto: UpdateArticleCssDto) {
    return this.articleCssService.update(+id, updateArticleCssDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleCssService.remove(+id);
  }
}
