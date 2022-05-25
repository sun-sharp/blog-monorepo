import { Controller, UseGuards, UseInterceptors, HttpCode, UploadedFile, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { AliPayService } from './ali-pay.service';
// import { CreateAliPayDto } from './dto/create-ali-pay.dto';
// import { UpdateAliPayDto } from './dto/update-ali-pay.dto';
import { UploadAliPayDto } from './dto/upload-we-chat.dto';

@Controller('ali-pay')
@ApiTags('支付宝')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class AliPayController {
  constructor(private readonly aliPayService: AliPayService) {}

  @ApiOperation({ summary: '支付宝账单导入' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadAliPayDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @HttpCode(ApiHttpStatus.SUCCESS)
  upload(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.aliPayService.upload(req.user.userId, file);
  }

  // @Post()
  // create(@Body() createAliPayDto: CreateAliPayDto) {
  //   return this.aliPayService.create(createAliPayDto);
  // }

  // @Get()
  // findAll() {
  //   return this.aliPayService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.aliPayService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAliPayDto: UpdateAliPayDto) {
  //   return this.aliPayService.update(+id, updateAliPayDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.aliPayService.remove(+id);
  // }
}
