import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AliPayService } from './ali-pay.service';
import { CreateAliPayDto } from './dto/create-ali-pay.dto';
import { UpdateAliPayDto } from './dto/update-ali-pay.dto';

@Controller('ali-pay')
export class AliPayController {
  constructor(private readonly aliPayService: AliPayService) {}

  @Post()
  create(@Body() createAliPayDto: CreateAliPayDto) {
    return this.aliPayService.create(createAliPayDto);
  }

  @Get()
  findAll() {
    return this.aliPayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aliPayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAliPayDto: UpdateAliPayDto) {
    return this.aliPayService.update(+id, updateAliPayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aliPayService.remove(+id);
  }
}
