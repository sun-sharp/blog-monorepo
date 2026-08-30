import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManualBillService } from './manual-bill.service';
import { ManualBillController } from './manual-bill.controller';
import { ManualBill, ManualBillSchema } from 'src/schemas/blog/money/manual-bill.schema';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { useCustomConfig } from 'src/config';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const MANUAL_BILL_MONGO_MODULE = MongooseModule.forFeature([{ name: ManualBill.name, schema: ManualBillSchema }], blogDatabaseName);

@Module({
  imports: [MANUAL_BILL_MONGO_MODULE, JwtAuthModule, UserModule, forwardRef(() => RoleModule)],
  controllers: [ManualBillController],
  providers: [ManualBillService],
  exports: [ManualBillService],
})
export class ManualBillModule {}
