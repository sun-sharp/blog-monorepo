import { Module } from '@nestjs/common';
import { AliPayService } from './ali-pay.service';
import { AliPayController } from './ali-pay.controller';

@Module({
  controllers: [AliPayController],
  providers: [AliPayService],
})
export class AliPayModule {}
