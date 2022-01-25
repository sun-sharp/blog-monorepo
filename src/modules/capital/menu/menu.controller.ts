import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { menuFindAllDto } from './dto/menu-find-all-dto';

@Controller('menu')
@ApiTags('菜单')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('save')
  @ApiOperation({ summary: '新增系统菜单' })
  save(@Body() body: CreateMenuDto) {
    return this.menuService.save(body);
  }

  @Get('find_term')
  @ApiOperation({ summary: '条件查询获取管理系统全部菜单列表' })
  findAll(@Query() query: menuFindAllDto) {
    return this.menuService.findAll(query);
  }

  @Put('update')
  @ApiOperation({ summary: '修改系统菜单' })
  update(@Body() body: UpdateMenuDto) {
    return this.menuService.update(body);
  }

  @Delete(':menuId')
  @ApiOperation({ summary: '删除系统菜单' })
  remove(@Param('menuId') menuId: string) {
    return this.menuService.remove(menuId);
  }
}
