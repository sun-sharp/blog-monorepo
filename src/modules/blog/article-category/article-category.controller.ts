import { Controller, Post, Body, HttpCode, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { ArticleCategoryService } from './article-category.service';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
// import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';

@Controller('article-category')
@ApiTags('文章分类')
export class ArticleCategoryController {
  constructor(private readonly articleCategoryService: ArticleCategoryService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '新增文章分类' })
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  save(@Body() createArticleCategoryDto: CreateArticleCategoryDto) {
    return this.articleCategoryService.save(createArticleCategoryDto);
  }

  @Get('all')
  @ApiOperation({ summary: '获取全部文章分类列表' })
  findAll() {
    return this.articleCategoryService.findAll();
  }
}
