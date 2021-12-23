import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('权限')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  @ApiOperation({ summary: '获取全部权限列表' })
  findAll() {
    return this.roleService.findAll();
  }
}
