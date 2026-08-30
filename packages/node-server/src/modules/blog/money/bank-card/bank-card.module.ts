import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankCardService } from './bank-card.service';
import { BankCardController } from './bank-card.controller';
import { BankCard, BankCardSchema } from 'src/schemas/blog/money/bank-card.schema';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { useCustomConfig } from 'src/config';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const BANK_CARD_MONGO_MODULE = MongooseModule.forFeature([{ name: BankCard.name, schema: BankCardSchema }], blogDatabaseName);

@Module({
  imports: [BANK_CARD_MONGO_MODULE, JwtAuthModule, UserModule, forwardRef(() => RoleModule)],
  controllers: [BankCardController],
  providers: [BankCardService],
  exports: [BankCardService],
})
export class BankCardModule {}