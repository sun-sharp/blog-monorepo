import { Controller, Post, Request, UseGuards, HttpCode, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { PageArticleDto } from './dto/page-article.dto';

@Controller('article')
@ApiTags('文章')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取文章列表' })
  findPage(@Body() pageArticleDto: PageArticleDto) {
    return this.articleService.findPage(pageArticleDto);
  }

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '新增文章' })
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  save(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.save(req.user, createArticleDto);
  }
}
