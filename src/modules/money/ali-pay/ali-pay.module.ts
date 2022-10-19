import { Module } from '@nestjs/common';
import { AliPayService } from './ali-pay.service';
import { AliPayController } from './ali-pay.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AliPay, AliPaySchema } from 'src/schemas/money/ali-pay.schema';

const ALI_PAY_MONGO_MODULE = MongooseModule.forFeature([{ name: AliPay.name, schema: AliPaySchema }], 'money');

@Module({
  imports: [ALI_PAY_MONGO_MODULE],
  controllers: [AliPayController],
  providers: [AliPayService, JwtStrategy],
  exports: [AliPayService],
})
export class AliPayModule {}
