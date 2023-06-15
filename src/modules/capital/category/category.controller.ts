import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { CategoryCertainTypeDto } from './dto/category-ertain-type.dto';

@Controller('category')
@ApiTags('分类')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('certain_type_all')
  @ApiOperation({ summary: '某种类型的所以配置' })
  certainTypeAll(@Query() query: CategoryCertainTypeDto) {
    return this.categoryService.certainTypeAll(query.type);
  }
}
