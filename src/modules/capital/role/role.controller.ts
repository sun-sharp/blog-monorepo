import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { PageRoleDto } from './dto/page-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('权限')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('role_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取权限列表' })
  getRolePage(@Body() pageRoleDto: PageRoleDto) {
    return this.roleService.getRolePage(pageRoleDto);
  }

  @Get('all')
  @ApiOperation({ summary: '获取全部权限列表' })
  findAll() {
    return this.roleService.findAll();
  }

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '新增权限' })
  save(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.save(createRoleDto);
  }

  @Put('update')
  @ApiOperation({ summary: '修改权限列表' })
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  @Delete(':roleId')
  @ApiOperation({ summary: '删除权限' })
  remove(@Param('roleId') roleId: string) {
    return this.roleService.remove(roleId);
  }

  @Get('api_all')
  @ApiOperation({ summary: '获取全部api接口列表' })
  findApiAll() {
    return this.roleService.findApiAll();
  }
}
