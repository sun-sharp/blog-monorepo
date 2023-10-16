import { forwardRef, Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { Bank, BankSchema } from 'src/schemas/blog/money/bank.schema';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const BANK_MONGO_MODULE = MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }], blogDatabaseName);

@Module({
  imports: [BANK_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [BankController],
  providers: [BankService, JwtStrategy],
  exports: [BankService],
})
export class BankModule {}
