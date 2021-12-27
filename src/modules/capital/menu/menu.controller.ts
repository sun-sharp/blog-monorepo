import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu')
@ApiTags('菜单')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('save')
  @ApiOperation({ summary: '新增系统菜单' })
  save(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.save(createMenuDto);
  }

  @Get('find_all')
  @ApiOperation({ summary: '条件查询获取管理系统全部菜单列表' })
  findAll() {
    return this.menuService.findAll();
  }

  @Put('update')
  @ApiOperation({ summary: '修改系统菜单' })
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除系统菜单' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
