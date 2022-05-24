import { Injectable } from '@nestjs/common';
import { CreateAliPayDto } from './dto/create-ali-pay.dto';
import { UpdateAliPayDto } from './dto/update-ali-pay.dto';

@Injectable()
export class AliPayService {
  create(createAliPayDto: CreateAliPayDto) {
    return 'This action adds a new aliPay';
  }

  findAll() {
    return `This action returns all aliPay`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aliPay`;
  }

  update(id: number, updateAliPayDto: UpdateAliPayDto) {
    return `This action updates a #${id} aliPay`;
  }

  remove(id: number) {
    return `This action removes a #${id} aliPay`;
  }
}
