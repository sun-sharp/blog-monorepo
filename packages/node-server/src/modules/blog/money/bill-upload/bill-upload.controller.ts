import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BillUploadService } from './bill-upload.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { PageBillUploadDto } from './dto/page-bill-upload.dto';
import { CreateBillUploadDto } from './dto/create-bill-upload.dto';
import { UpdateBillUploadDto } from './dto/update-bill-upload.dto';

@Controller('bill-upload')
@ApiTags('账单导入')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class BillUploadController {
  constructor(private readonly billUploadService: BillUploadService) {}

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取账单导入列表' })
  findPage(@Body() pageBillUploadDto: PageBillUploadDto) {
    return this.billUploadService.findPage(pageBillUploadDto);
  }

  @Get('one/:billUploadId')
  @ApiOperation({ summary: '获取账单导入详情' })
  findOne(@Param('billUploadId') billUploadId: string) {
    return this.billUploadService.findOneByBillUploadId(billUploadId);
  }

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建账单导入' })
  create(@Body() body: CreateBillUploadDto) {
    return this.billUploadService.create(body);
  }

  @Put('update')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '修改账单导入' })
  update(@Body() body: UpdateBillUploadDto) {
    return this.billUploadService.update(body);
  }

  @Delete(':billUploadId')
  @ApiOperation({ summary: '删除账单导入' })
  remove(@Param('billUploadId') billUploadId: string) {
    return this.billUploadService.remove(billUploadId);
  }
}
