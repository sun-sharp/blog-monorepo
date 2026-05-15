import { Module, forwardRef } from '@nestjs/common';
import { BillUploadService } from './bill-upload.service';
import { BillUploadController } from './bill-upload.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { useCustomConfig } from 'src/config';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { BillUpload, BillUploadSchema } from 'src/schemas/blog/money/bill-upload.schema';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const BILL_UPLOAD_MONGO_MODULE = MongooseModule.forFeature([{ name: BillUpload.name, schema: BillUploadSchema }], blogDatabaseName);

@Module({
  imports: [BILL_UPLOAD_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [BillUploadController],
  providers: [BillUploadService, JwtStrategy],
  exports: [BillUploadService],
})
export class BillUploadModule {}
