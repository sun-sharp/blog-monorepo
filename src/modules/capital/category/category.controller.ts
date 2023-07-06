import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { CategoryCertainTypeDto } from './dto/category-certain-type.dto';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { PageCategoryDto } from './dto/page-category.dto';

@Controller('category')
@ApiTags('分类')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('certain_type_all')
  @ApiOperation({ summary: '某种类型的所有配置' })
  certainTypeAll(@Query() query: CategoryCertainTypeDto) {
    return this.categoryService.certainTypeAll(query.type);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取分类列表' })
  findPage(@Body() pageCategoryDto: PageCategoryDto) {
    return this.categoryService.findPage(pageCategoryDto);
  }
}
