import { Controller, Post, Request, UseGuards, HttpCode, Body, Put, Delete, Param, Query, Get, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/jwt/optional-jwt-auth.guard';
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
  @UseGuards(OptionalJwtAuthGuard)
  findPage(@Request() req: any, @Body() pageArticleDto: PageArticleDto) {
    // 如果有用户信息，则查询全部文章（包括加密和不加密）
    // 如果没有用户信息，则只查询不加密的文章
    const user = req.user || null;
    return this.articleService.findPage(pageArticleDto, user);
  }

  @Post('find_all_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: 'jwt认证的条件并分页获取文章列表' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  findAllPage(@Body() pageArticleDto: AllPageArticleDto, @Request() req) {
    return this.articleService.findAllPage(pageArticleDto, req.user);
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
  @ApiOperation({ summary: '获取文章详情（支持可选认证）' })
  @UseGuards(OptionalJwtAuthGuard)
  findDetails(@Request() req: any, @Query('articleId') articleId: string) {
    // 如果有用户信息，则查询全部文章的详情，不限制（包括加密和不加密）
    // 如果没有用户信息，则只查询不加密的文章，有限制
    const user = req.user || null;
    return this.articleService.findDetails(articleId, user);
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
