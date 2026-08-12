import { Controller, Post, Request, UseGuards, HttpCode, Body, Put, Delete, Param, Query, Get, Res, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/jwt/optional-jwt-auth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { LitePageArticleDto } from './dto/lite-page-article.dto';
import { BatchUpdatePrivateArticleDto } from './dto/batch-update-private-article.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('article')
@ApiTags('文章')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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

  @Get('mobile_details')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '获取文章详情（支持可选认证）' })
  @UseGuards(OptionalJwtAuthGuard)
  findMobileDetails(@Request() req: any, @Query('articleId') articleId: string) {
    // 如果有用户信息，则查询全部文章的详情，不限制（包括加密和不加密）
    // 如果没有用户信息，则只查询不加密的文章，有限制
    const user = req.user || null;
    return this.articleService.findMobileDetails(articleId, user);
  }

  @Get('render')
  @ApiOperation({ summary: '根据 policyId 查询文章 并处理成 html' })
  renderHtml(@Query('pid') policyId: string, @Res() res: Response) {
    return this.articleService.renderHtml(policyId, res);
  }

  @Get('export_article/:articleId')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '导出文章' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  exportArticle(@Param('articleId') articleId: string, @Res() res: Response) {
    return this.articleService.exportArticle(articleId, res);
  }

  @Post('lite_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取简洁文章列表' })
  @UseGuards(OptionalJwtAuthGuard)
  litePage(@Request() req: any, @Body() pageArticleDto: LitePageArticleDto) {
    // 如果有用户信息，则查询全部文章（包括加密和不加密）
    // 如果没有用户信息，则只查询不加密的文章
    const user = req.user || null;
    return this.articleService.litePage(pageArticleDto, user);
  }

  @ApiOperation({ summary: '上传 MD 文件并解析为 HTML（不存库，只返回预览数据）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload_md')
  @HttpCode(ApiHttpStatus.SUCCESS)
  uploadMd(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.articleService.uploadMd(file, (req.headers as any)['css-name']);
  }
}
