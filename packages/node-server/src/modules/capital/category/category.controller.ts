import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { CategoryCertainTypeDto } from './dto/category-certain-type.dto';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { PageCategoryDto } from './dto/page-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@ApiTags('全局类型')
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
  @ApiOperation({ summary: '条件并分页获取全局类型列表' })
  findPage(@Body() pageCategoryDto: PageCategoryDto) {
    return this.categoryService.findPage(pageCategoryDto);
  }

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建全局类型' })
  create(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }

  @Put('update')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '修改全局类型' })
  update(@Body() body: UpdateCategoryDto) {
    return this.categoryService.update(body);
  }

  @Delete(':categoryId')
  @ApiOperation({ summary: '删除全局类型' })
  remove(@Param('categoryId') categoryId: string) {
    return this.categoryService.remove(categoryId);
  }
}
