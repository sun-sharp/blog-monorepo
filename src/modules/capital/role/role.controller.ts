import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('权限')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('role_page')
  @ApiOperation({ summary: '条件并分页获取权限列表' })
  getRolePage() {
    return this.roleService.getRolePage();
  }

  @Get('all')
  @ApiOperation({ summary: '获取全部权限列表' })
  findAll() {
    return this.roleService.findAll();
  }

  @Post('save')
  @HttpCode(200)
  @ApiOperation({ summary: '新增权限' })
  save() {
    return this.roleService.save();
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: '修改权限列表' })
  update() {
    return this.roleService.update();
  }

  @Post('remove')
  @HttpCode(200)
  @ApiOperation({ summary: '删除权限' })
  remove() {
    return this.roleService.remove();
  }
}
