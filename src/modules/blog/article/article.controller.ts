import { Controller, Post, Request, UseGuards, HttpCode, Body, Put, Delete, Param, Query, Get, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { PageArticleDto } from './dto/page-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AllPageArticleDto } from './dto/all-page-article.dto';
import { BatchUpdatePrivateArticleDto } from './dto/batch-update-private-article.dto';
import { Response } from 'express';

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

  @Post('find_all_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取文章列表' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  findAllPage(@Body() pageArticleDto: AllPageArticleDto) {
    return this.articleService.findAllPage(pageArticleDto);
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

  @Put('batch_update_private')
  @ApiOperation({ summary: '根据id批量修改文章加密' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  batchUpdatePrivate(@Body() body: BatchUpdatePrivateArticleDto) {
    return this.articleService.batchUpdatePrivate(body);
  }

  @Delete(':articleId')
  @ApiOperation({ summary: '删除文章' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  remove(@Param('articleId') articleId: string) {
    return this.articleService.remove(articleId);
  }

  @Get('details')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '获取不加密文章详情' })
  findDetails(@Query('articleId') articleId: string) {
    return this.articleService.findDetails(articleId);
  }

  @Get('all_details')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '获取全部文章详情' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  findAllDetails(@Query('articleId') articleId: string) {
    return this.articleService.findAllDetails(articleId);
  }

  @Get('export_article/:articleId')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '导出文章' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  exportArticle(@Param('articleId') articleId: string, @Res() res: Response) {
    return this.articleService.exportArticle(articleId, res);
  }
}
