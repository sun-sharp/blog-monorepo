import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/schemas/money/bank.schema';
import { UserModule } from 'src/modules/capital/user/user.module';

const BANK_MONGO_MODULE = MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }], 'money');

@Module({
  imports: [BANK_MONGO_MODULE, UserModule],
  controllers: [BankController],
  providers: [BankService, JwtStrategy],
  exports: [BankService],
})
export class BankModule {}
