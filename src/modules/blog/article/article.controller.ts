import { Controller, Post, Request, UseGuards, HttpCode, Body, Put, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { PageArticleDto } from './dto/page-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

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
  @UseGuards(JwtAuthGuard)
  save(@Request() req: any, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.save(req.user, createArticleDto);
  }

  @Put('update')
  @ApiOperation({ summary: '修改文章' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  update(@Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(updateArticleDto);
  }

  @Delete(':articleId')
  @ApiOperation({ summary: '删除文章' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  remove(@Param('articleId') articleId: string) {
    return this.articleService.remove(articleId);
  }
}
