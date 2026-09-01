import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { ArticleCssService } from './article-css.service';

@Controller('article-css')
@ApiTags('文章css')
export class ArticleCssController {
  constructor(private readonly articleCssService: ArticleCssService) {}

  @Get('list')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '查询全部 css 名称列表' })
  findAllNames() {
    return this.articleCssService.findAllNames();
  }
}
